const fetch = require("node-fetch");

exports.handler = async function (event, context) {
    try {
        const apiKey = process.env.OPENROUTER_API_KEY;
        if (!apiKey) throw new Error("Missing OpenRouter API Key in Netlify");

        const models = [
            "google/gemini-2.0-pro-exp-02-05:free",
        ];

        const selectedModel = models[Math.floor(Math.random() * models.length)];

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
                "HTTP-Referer": "https://noni-piggy-love.com"
            },
            body: JSON.stringify({
                model: selectedModel,
                messages: [{
                    role: "system",
                    content: `You're Piggy Fatty writing to Noni Piggy. Use cute nicknames naturally in romantic messages.`
                }, {
                    role: "user",
                    content: `Write heartfelt message including:
                    - Long-distance relationship struggles
                    - Taj Mahal sunrise memory from Agra
                    - Dharamshala mountain adventures
                    - Jodhpur's blue city exploration
                    - Jaipur palace visit details
                    - Must start with "Dearest Noni Piggy,"
                    - End with two newlines then "END"
                    - Include 3 heart emojis
                    - Keep between 180-280 words`
                }],
                max_tokens: 600,
                temperature: 0.7,
                stop: ["END"]
            }),
        });

        const data = await response.json();
        let message = data.choices?.[0]?.message?.content?.trim();

        // DeepSeek model cleanup
        if (selectedModel.includes("deepseek")) {
            message = message.replace(/<\|im_end\|>/g, "")
                            .replace(/<\|im_start\|>/g, "")
                            .replace(/\[.*?\]/g, "");
        }

        // Ensure proper formatting
        message = message.replace(/\*\*/g, "")
                         .replace(/(\nEND)$/, "\n\nEND");
        
        if (!message.includes("❤️")) {
            message = message.replace(/\nEND$/, " ❤️❤️❤️\n\nEND");
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: message || "Our love is generating... Please wait 💌",
                model: selectedModel.split("/")[1].split(":")[0]
            }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: "Love transmission failed! Try again?",
                details: error.message
            }),
        };
    }
};
