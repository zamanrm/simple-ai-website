function clearChat() {
    const prompt = document.getElementById("prompt");
    const error = document.getElementById("error");
    const result = document.getElementById("result");

    if (prompt) prompt.value = "";
    if (error) error.textContent = "";
    if (result) {
        result.textContent = "Your AI response will appear here...";
    }
}

async function generateText() {

    const prompt = document.getElementById("prompt").value.trim();
    const error = document.getElementById("error");
    const result = document.getElementById("result");

    error.textContent = "";
    result.textContent = "";

    if (!prompt) {
        error.textContent = "Prompt cannot be empty!";
        return;
    }

    result.textContent = "Generating...";

    try {
        const baseUrl = window.location.origin;
        const response = await fetch(`${baseUrl}/generate`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ prompt })
        });

        const data = await response.json();

        if (!response.ok) {
            error.textContent = data.error;
            result.textContent = "";
            return;
        }

        result.textContent = data.result;

    } catch (err) {

        error.textContent = "Failed to connect to server.";
        result.textContent = "";
    }
}