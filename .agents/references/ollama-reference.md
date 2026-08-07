# Ollama Integration Reference

## 1. Streaming Responses
If you need a chat-style UI with a typing effect, use streaming. Otherwise, for JSON extraction, use `stream: false`.

```javascript
async function streamLocalModel(userMessage, onChunk) {
  const response = await fetch('http://localhost:11434/api/chat', {
    method: 'POST',
    body: JSON.stringify({
      model: 'gemma4:e4b',
      messages: [{ role: 'user', content: userMessage }],
      stream: true
    })
  });

  const reader = response.body.getReader();
  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    const lines = decoder.decode(value).split('\n').filter(Boolean);
    for (const line of lines) {
      const json = JSON.parse(line);
      if (json.message?.content) onChunk(json.message.content);
    }
  }
}
```

## 2. Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| `Failed to fetch` in browser console | CORS blocked | Set `OLLAMA_ORIGINS=*`, restart Ollama |
| Very slow first response | Model loading into VRAM cold | Normal, subsequent requests are fast |
| Response falls back to CPU (very slow, minutes) | GPU not detected | Check `ollama ps` — if `100% CPU`, check GPU drivers |
| `model not found` error | Model not pulled yet | `ollama pull gemma4:e4b` |
| JSON.parse fails on response | Model added stray text/markdown fences | Strip fences defensively (`replace(/```json\|```/g, '').trim()`) |
| Model unloads too often, slow reload each time | Keep-alive too short | Increase `OLLAMA_KEEP_ALIVE` env var |

## 3. Model Management Cheatsheet

| Task | Command |
|---|---|
| List installed models | `ollama list` |
| Switch models | change `"model"` field in your fetch body — no restart needed |
| Update a model | `ollama pull gemma4:e4b` (re-pulls only if newer) |
| Remove a model | `ollama rm gemma4:e4b` |
| Check what's currently loaded in VRAM | `ollama ps` |
| Manually unload a model from VRAM | `ollama stop gemma4:e4b` |
