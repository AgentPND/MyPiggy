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
                        content: "You are a poet who writes deeply romantic and personal love letters or poems." 
                    },
                    { 
                        role: "user", 
                        content: `Write a heartfelt love letter or poem about a long-distance couple who deeply miss each other.
                        They have only met twice when she traveled to see him.  
                        The first time, they went to **Agra and Dharamshala** together.  
                        The second time, they went to **Jodhpur and Jaipur**.  
                        They call each other **"Noni Piggy"** and **"Piggy Fatty"** as a joke but also as a way to show their love.  

                        The letter or poem should:  
                        - Express deep longing and love  
                        - Include beautiful memories from their trips  
                        - Mention their special nicknames naturally  
                        - **Start directly** (no introduction like "Sure, here's a poem")  
                        - **End with "END" after a blank line**  
                        
                        Keep it emotional and heartfelt.`
                    }
                ],
                max_tokens: 200,
            }),
        });

        const data = await response.json();
        console.log("API Response:", JSON.stringify(data, null, 2)); // Debugging

        // Extracting poem or letter content
        let poem = data.choices?.[0]?.message?.content?.trim();

        // If "content" is empty, try extracting from "reasoning"
        if (!poem && data.choices?.[0]?.message?.reasoning) {
            poem = data.choices[0].message.reasoning.trim();
        }

        if (!poem) {
            throw new Error("Poem or love letter content missing in API response.");
        }

        return {
            statusCode: 200,
            body: JSON.stringify({ poem }),
        };
    } catch (error) {
        console.error("Error fetching poem or love letter:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ error: error.message || "Failed to fetch poem or love letter" }),
        };
    }
};
