const fetch = require("node-fetch");

exports.handler = async function (event, context) {
    try {
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) throw new Error("Missing OpenRouter API Key in Netlify");

        // Available models array
        const models = [
            "google/gemini-2.0-flash-thinking-exp:free",
            "google/gemini-2.0-pro-exp-02-05:free",
            "nvidia/llama-3.1-nemotron-70b-instruct:free"
        ];

        // Random model selection
        const selectedModel = models[Math.floor(Math.random() * models.length)];

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
                "HTTP-Referer": "https://for-my-love-website.com"
            },
            body: JSON.stringify({
                model: selectedModel,
                messages: [{
                    role: "system",
                    content: `You're a romantic AI helping Piggy Fatty express love to Noni Piggy. 
                    Use nicknames naturally and include specific travel memories.`
                }, {
                    role: "user",
                    content: `Write heartfelt message with:
                    - Longing from long-distance
                    - Memories: Agra (Taj Mahal), Dharamshala (mountains)
                    - Jodhpur (blue city), Jaipur (palaces)
                    - Nicknames "Noni Piggy" and "Piggy Fatty"
                    - Start with "Dearest Noni Piggy,"
                    - End with two newlines then "END"
                    - Include 2-4 romantic emojis
                    - 150-250 words maximum`
                }],
                max_tokens: 1000000,
                temperature: 0.7,
                stop: ["END"]
            }),
        });

        const data = await response.json();
        let message = data.choices?.[0]?.message?.content?.trim();

        // Post-processing
        if (message) {
            // Ensure proper ending
            if (!message.endsWith("END")) message += "\n\nEND";
            // Clean markdown and add emojis if missing
            message = message.replace(/\*\*/g, "")
                .replace(/(\nEND)$/, "\n\nEND");
            if ((message.match(/❤️|💖|🥰|💕/g) || []).length < 2) {
                message = message.replace(/\nEND$/, " ❤️💖\n\nEND");
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: message || "Could not generate message",
                model: selectedModel.split("/")[1] || "AI Model"
            }),
        };
    } catch (error) {
        console.error("Error:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: error.message,
                note: "Check API key and model availability"
            }),
        };
    }
};