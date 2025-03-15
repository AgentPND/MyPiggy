const fetch = require("node-fetch");

exports.handler = async function (event, context) {
    try {
        const apiKey = process.env.OPENROUTER_API_KEY;

        if (!apiKey) {
            throw new Error("Missing OpenRouter API Key! Ensure it is set in Netlify.");
        }

        console.log("Using API Key:", apiKey.substring(0, 5) + "********");

        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`,
            },
            body: JSON.stringify({
                model: "deepseek/deepseek-r1-zero:free",
                messages: [
                    { 
                        role: "system", 
                        content: "You are a poet who writes deeply romantic and personal love messages." 
                    },
                    { 
                        role: "user", 
                        content: `Write a heartfelt love message about a long-distance couple who deeply miss each other.
                        They have only met twice when she traveled to see him.  
                        The first time, they went to **Agra and Dharamshala** together.  
                        The second time, they went to **Jodhpur and Jaipur**.  
                        They call each other **"Noni Piggy"** and **"Piggy Fatty"** as a joke but also as a way to show their love.  

                        The message should:  
                        - Express deep longing and love  
                        - Include beautiful memories from their trips  
                        - Mention their special nicknames naturally  
                        - **Start directly** (no introduction like "Sure, here's a message")  
                        - **End with "END" after a blank line**  
                        
                        Keep it emotional and heartfelt.`
                    }
                ],
                max_tokens: 200,
            }),
        });

        const data = await response.json();
        console.log("API Response:", JSON.stringify(data, null, 2)); // Debugging

        let message = data.choices?.[0]?.message?.content?.trim();

        if (!message && data.choices?.[0]?.message?.reasoning) {
            message = data.choices[0].message.reasoning.trim();
        }

        if (!message) {
            throw new Error("Message content missing in API response.");
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ message }),
        };
    } catch (error) {
        console.error("Error fetching message:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || "Failed to fetch message" }),
        };
    }
};
