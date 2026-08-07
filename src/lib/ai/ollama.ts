export async function askLocalModel(prompt: string, schema?: Record<string, any>): Promise<any> {
    const systemPrompt = schema 
        ? `You MUST respond only with valid JSON, no other text. Schema: ${JSON.stringify(schema)}` 
        : "You are an intelligent personal manager assistant. Keep answers concise.";

    const payload = {
        model: "gemma4:e4b",
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: prompt }
        ],
        stream: false,
        options: { num_ctx: 8192 }
    };

    try {
        const response = await fetch("http://localhost:11434/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        const content = data.message.content;

        if (schema) {
            // Defensive parsing: strip markdown code fences
            const clean = content.replace(/```json|```/g, '').trim();
            return JSON.parse(clean);
        }

        return content;
    } catch (error) {
        console.error("Failed to connect to local Ollama instance:", error);
        throw error;
    }
}
