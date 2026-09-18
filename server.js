require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;
const geminiApiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || "";
const placeholderApiKey = "your_openai_api_key_here";
const GEMINI_MODELS = [
    "gemini-3.6-flash",
    "gemini-2.5-flash",
    "gemini-2.0-flash-lite",
    "gemini-1.5-flash"
];

app.use(cors());
app.use(express.json());
app.use(express.static("public"));

if (!geminiApiKey || geminiApiKey.trim() === "" || geminiApiKey.trim() === placeholderApiKey) {
    console.warn("GEMINI_API_KEY is missing or still using the placeholder value. Add a real key to .env before making requests.");
}

app.post("/generate", async (req, res) => {
    try {
        const { prompt } = req.body;

        if (!prompt || prompt.trim() === "") {
            return res.status(400).json({
                success: false,
                error: "Prompt cannot be empty."
            });
        }

        if (!geminiApiKey || geminiApiKey.trim() === "" || geminiApiKey.trim() === placeholderApiKey) {
            return res.status(500).json({
                success: false,
                error: "GEMINI_API_KEY is not configured. Add a valid key to the .env file."
            });
        }

        let lastError = null;

        for (const model of GEMINI_MODELS) {
            const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "X-goog-api-key": geminiApiKey
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: prompt
                                }
                            ]
                        }
                    ]
                })
            });

            const data = await response.json();

            if (response.ok) {
                const result =
                    data?.candidates?.[0]?.content?.parts
                        ?.map((part) => part.text)
                        .join("") || "No response generated.";

                return res.json({
                    success: true,
                    result
                });
            }

            lastError = data?.error?.message || `Gemini request failed for ${model}.`;

            const message = lastError.toLowerCase();
            if (!message.includes("429") && !message.includes("overloaded") && !message.includes("high demand") && !message.includes("temporarily unavailable") && !message.includes("resource exhausted")) {
                break;
            }
        }

        if (lastError) {
            throw new Error(lastError);
        }

        throw new Error("Gemini API request failed.");

    } catch (error) {
        console.error(error);

        res.status(500).json({
            success: false,
            error: "Something went wrong. Please try again."
        });
    }
});

const server = app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});

server.on("error", (error) => {
    if (error.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use. Stop the running server or set PORT to a different value.`);
        process.exit(1);
    }

    console.error("Server failed to start:", error.message);
    process.exit(1);
});