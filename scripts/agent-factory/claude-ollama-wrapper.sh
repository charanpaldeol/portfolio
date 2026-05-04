#!/bin/bash

# Claude CLI wrapper that uses Ollama instead
# Reads prompt from stdin, calls Ollama API, outputs response

OLLAMA_URL="${FACTORY_RESEARCH_OLLAMA_URL:-http://127.0.0.1:11434}"
OLLAMA_URL="${OLLAMA_URL%/}"  # Remove trailing slash
MODEL="${FACTORY_RESEARCH_MODEL:-llama3.2}"

>&2 echo "[ollama-wrapper] Using model: $MODEL"
>&2 echo "[ollama-wrapper] Ollama URL: $OLLAMA_URL"

# Read prompt from stdin
PROMPT=$(cat)

if [ -z "$PROMPT" ]; then
    >&2 echo "[ollama-wrapper] Error: empty prompt"
    exit 1
fi

# Call Ollama API
# Build JSON payload more carefully to avoid quoting issues
JSON_PAYLOAD=$(jq -n \
    --arg model "$MODEL" \
    --arg content "$PROMPT" \
    '{model: $model, messages: [{role: "user", content: $content}], stream: false, temperature: 0.3}')

RESPONSE=$(curl -s -X POST "$OLLAMA_URL/api/chat" \
    -H "Content-Type: application/json" \
    -d "$JSON_PAYLOAD")

# Check if response is valid JSON
if ! echo "$RESPONSE" | jq . > /dev/null 2>&1; then
    >&2 echo "[ollama-wrapper] Invalid JSON response from Ollama"
    >&2 echo "$RESPONSE"
    exit 1
fi

# Extract message content
CONTENT=$(echo "$RESPONSE" | jq -r '.message.content // empty')

if [ -z "$CONTENT" ]; then
    >&2 echo "[ollama-wrapper] Empty response from Ollama"
    >&2 echo "$RESPONSE"
    exit 1
fi

# Output the response
echo "$CONTENT"
>&2 echo "[ollama-wrapper] Completed successfully"
exit 0
