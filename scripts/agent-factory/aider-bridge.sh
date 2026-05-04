#!/usr/bin/env bash
# aider-bridge.sh — factory-compatible wrapper around aider
#
# The factory calls the implementer binary like this:
#   echo "<prompt>" | <binary> -p --dangerously-skip-permissions ...
#   echo "<prompt>" | <binary> --prompt "" --yolo ...
#
# This wrapper ignores all CLI args (they are claude/gemini-specific),
# reads the full task prompt from stdin, and delegates to aider.
#
# Usage:
#   export FACTORY_CLAUDE_BIN="/Users/al/Projects AI/Portfolio/scripts/agent-factory/aider-bridge.sh"
#   export GEMINI_API_KEY=...   # required for default model below (or override AIDER_MODEL + matching key)
#
# Supported AIDER_MODEL values (set whichever you have a key for):
#   gemini/gemini-2.0-flash-exp         free tier                (GEMINI_API_KEY)  ← default
#   groq/llama-3.1-8b-instant           free tier, 20k TPM (GROQ_API_KEY)
#   groq/llama-3.3-70b-versatile        free tier, 12k TPM — too small for large contexts
#   groq/deepseek-r1-distill-llama-70b  free tier, strong coder  (GROQ_API_KEY)
#   ollama/qwen2.5-coder:7b             local, unlimited, free   (no key needed)
#   ollama/deepseek-coder:6.7b          local, unlimited, free   (no key needed)
#   deepseek/deepseek-chat              ~$0.01/task              (DEEPSEEK_API_KEY)
#   openrouter/meta-llama/llama-3.3-70b free tier on openrouter  (OPENROUTER_API_KEY)

set -euo pipefail

# Default: Gemini Flash (override with AIDER_MODEL if you use another provider)
MODEL="${AIDER_MODEL:-gemini/gemini-2.0-flash-exp}"

# Read the full prompt from stdin (factory sends it this way)
PROMPT=$(cat -)

if [[ -z "$PROMPT" ]]; then
  echo "aider-bridge: no prompt received on stdin" >&2
  exit 1
fi

# Prepend a short system note so aider ignores claude/gemini-specific
# tool names (Read/Edit/Write/Glob) and just implements the task directly.
FULL_PROMPT="You are an autonomous coding agent working in the current git worktree.
Implement the task below by directly reading and editing files in this directory.
Do not reference tool names like Read/Edit/Write/Glob — just make the changes.

---
${PROMPT}"

echo "aider-bridge: using model ${MODEL}" >&2

# Run aider in non-interactive mode:
#   --yes-always       auto-approve all file adds and edits (equiv. to --yolo)
#   --no-auto-commits  factory handles git commits itself
#   --no-show-model-warnings  suppress non-fatal warnings
#   --map-tokens 0     disable repo-map scan — keeps context small on strict TPM tiers
#                      (e.g. Groq free). Aider still reads files it needs.
#   --message          the task prompt (non-interactive trigger)
exec aider \
  --model "$MODEL" \
  --yes-always \
  --no-auto-commits \
  --no-show-model-warnings \
  --no-check-update \
  --map-tokens 0 \
  --message "$FULL_PROMPT"
