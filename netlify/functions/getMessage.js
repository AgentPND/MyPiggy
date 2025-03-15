const fetch = require("node-fetch");

exports.handler = async function (event, context) {
    try {
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            throw new Error("Missing OpenRouter API Key! Ensure it is set in Netlify.");
        }

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "google/gemini-2.0-flash-thinking-exp:free",
                messages: [
                    { 
                        role: "system", 
                        content: "You are a poet who writes deeply romantic and personal love messages." 
                    },
                    { 
                        role: "user", 
                        content: `Write a heartfelt love message about a long-distance couple who deeply miss each other.
                        They have only met twice when she traveled to see him.  
                        First trip: Agra and Dharamshala - remember the Taj Mahal sunrise.  
                        Second trip: Jodhpur and Jaipur - recall the blue city and palace winds.  
                        Nicknames: "Noni Piggy" (her) and "Piggy Fatty" (him).  

                        Requirements:  
                        - Express longing and love  
                        - Include specific trip memories  
                        - Use nicknames naturally  
                        - Start directly (no greeting)  
                        - End with "END" after a blank line  
                        
                        Keep it under 300 tokens. Add romantic emojis.`
                    }
                ],
                max_tokens: 10000,
                temperature: 0.7,
            }),
        });

        const data = await response.json();
        let message = data.choices?.[0]?.message?.content?.trim();

        if (!message) {
            throw new Error("Message content missing in API response.");
        }

        // Ensure proper ending
        if (!message.endsWith("END")) {
            message += "\n\nEND";
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ 
                message,
                model: data.model || "Google PaLM-2"
            }),
        };
    } catch (error) {
        console.error("Error fetching message:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || "Failed to fetch message" }),
        };
    }
};