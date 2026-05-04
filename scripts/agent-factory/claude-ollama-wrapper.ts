import process from "node:process"

async function main() {
  // Parse CLI args for compatibility with claude CLI interface
  // We support: -p --dangerously-skip-permissions --allowedTools <tools>
  const args = process.argv.slice(2)
  const hasPrintMode = args.includes("-p")

  // Read prompt from stdin
  let prompt = ""
  if (process.stdin.isTTY) {
    console.error("Error: stdin is a TTY, expected piped prompt")
    process.exitCode = 1
    return
  }

  try {
    for await (const chunk of process.stdin) {
      prompt += chunk.toString()
    }
  } catch (e) {
    console.error("Error reading stdin:", e instanceof Error ? e.message : String(e))
    process.exitCode = 1
    return
  }

  if (!prompt.trim()) {
    console.error("Error: empty prompt")
    process.exitCode = 1
    return
  }

  // Call Ollama API
  const ollamaUrl = (process.env.FACTORY_RESEARCH_OLLAMA_URL ?? "http://127.0.0.1:11434").replace(/\/+$/, "")
  const model = (process.env.FACTORY_RESEARCH_MODEL ?? "llama3.2").trim()

  console.error(`[ollama-wrapper] Using model: ${model}`)
  console.error(`[ollama-wrapper] Ollama URL: ${ollamaUrl}`)

  try {
    const response = await fetch(`${ollamaUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model,
        messages: [{ role: "user", content: prompt }],
        stream: false,
        temperature: 0.3,
      }),
    })

    if (!response.ok) {
      const text = await response.text()
      console.error(`[ollama-wrapper] API error: ${response.status}`)
      console.error(text)
      process.exitCode = 1
      return
    }

    const data = (await response.json()) as {
      message?: { content?: string }
    }
    const content = data.message?.content ?? ""

    if (!content.trim()) {
      console.error("[ollama-wrapper] Empty response from Ollama")
      process.exitCode = 1
      return
    }

    // Output the response
    process.stdout.write(content)
    console.error("[ollama-wrapper] Completed successfully")
  } catch (e) {
    console.error("[ollama-wrapper] Error calling Ollama:", e instanceof Error ? e.message : String(e))
    process.exitCode = 1
  }
}

main()
