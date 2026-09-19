# AI Prompt Generator

This project is a small web application that lets a user type a prompt in the browser and receive a response from a Gemini-powered AI model.

The full process works like this:

1. The user types a prompt on the webpage.
2. The browser sends that prompt to the backend server.
3. The server reads the API key from the `.env` file.
4. The backend calls the Gemini API with the prompt.
5. The AI response is sent back to the browser.
6. The frontend displays the answer on the page.

---

## Project Overview

This project uses:

- Node.js for the server
- Express for handling routes
- plain HTML, CSS, and JavaScript for the frontend
- Gemini API for AI generation
- a `.env` file to store the secret API key safely

---

## Project Structure

```bash
ai-website/
├── public/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── .env
├── package.json
├── server.js
├── README.md
└── node_modules/
```

### Important files

- `server.js` - starts the backend and handles AI requests
- `public/index.html` - page layout and input form
- `public/script.js` - sends user prompt to server and updates the page
- `.env` - stores the API key and other environment variables
- `package.json` - lists scripts and project dependencies

---

## Prerequisites

Before starting, make sure you have:

- Node.js installed on your computer
- npm installed
- a valid Gemini API key from Google AI Studio or the Google Generative AI service

You can check if Node.js is installed by running:

```bash
node -v
npm -v
```

If these commands return versions, your setup is ready.

---

## Step 1: Install dependencies

Open a terminal in the project folder and run:

```bash
npm install
```

This installs all packages required by the app, including:

- express
- cors
- dotenv
- openai

---

## Step 2: Create the `.env` file

In the root of the project, create a file named `.env`.

This file stores sensitive information like your API key, so it should not be shared publicly.

Inside `.env`, add:

```env
GEMINI_API_KEY=your_api_key_here
PORT=3000
```

### What this means

- `GEMINI_API_KEY` = your actual Gemini API key
- `PORT` = the port used by the local server

### Example

```env
GEMINI_API_KEY=AIzaSyourActualGeminiKeyHere123456
PORT=3000
```

> Replace `your_api_key_here` with the real key you received from Google AI Studio.

### Important note

The application reads the API key from `.env` at startup. If that value is missing or still left as a placeholder, the server will not be able to call Gemini.

---

## Step 3: Add the real API key

If you already have a Gemini key, paste it into the `.env` file like this:

```env
GEMINI_API_KEY=your_real_api_key
PORT=3000
```

The code in `server.js` does this:

```js
const geminiApiKey = process.env.GEMINI_API_KEY || process.env.OPENAI_API_KEY || "";
```

This means the server checks for `GEMINI_API_KEY` first. If it exists, it uses it. If not, it may also check for `OPENAI_API_KEY`.

In other words, the app cannot send requests to Gemini until a valid key is present in `.env`.

---

## Step 4: Start the backend

From the root project folder, run:

```bash
npm start
```

The server will start and usually listen on:

```text
http://localhost:3000
```

If the server starts successfully, you will see a message similar to:

```bash
Server running on http://localhost:3000
```

If you see errors, check the following:

- `.env` file exists
- `GEMINI_API_KEY` is not empty
- port 3000 is not already used by another app

---

## Step 5: Open the website

Open your browser and go to:

```text
http://localhost:3000
```

You should see the AI Prompt Generator page with:

- a text box for input
- a Generate button
- a Clear button
- a response area

---

## Step 6: Use the app

1. Type a prompt in the text area.
2. Click the Generate button.
3. The frontend sends your prompt to the backend.
4. The backend calls the Gemini API.
5. The AI result appears in the response box.

Example prompt:

```text
Write a short introduction for a new AI website.
```

The backend then sends a request to Gemini and returns the result to the page.

---

## How the app works internally

### Frontend flow

In `public/script.js`, the app does the following:

1. Reads the value typed by the user.
2. Validates that the prompt is not empty.
3. Sends a POST request to `/generate`.
4. Receives the AI response.
5. Displays it on the page.

The main request looks like this:

```js
fetch(`${baseUrl}/generate`, {
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify({ prompt })
});
```

### Backend flow

In `server.js`, the app does this:

1. Loads environment variables from `.env` using `dotenv`.
2. Creates an Express app.
3. Serves static files from the `public` folder.
4. Receives POST requests at `/generate`.
5. Checks whether the prompt is empty.
6. Checks whether the API key is configured.
7. Sends the prompt to Gemini using the Google API endpoint.
8. Returns the generated AI result as JSON.

The server uses an endpoint like this:

```js
app.post("/generate", async (req, res) => {
```

Then it builds a request to Gemini using the API key and the user prompt.

---

## API key validation logic

The server checks for missing or invalid keys before sending the request.

If the key is empty, it returns an error message like:

```json
{
  "success": false,
  "error": "GEMINI_API_KEY is not configured. Add a valid key to the .env file."
}
```

This is why the `.env` file must be correctly filled before running the app.

---

## Troubleshooting

### 1. The app says API key is missing

Check your `.env` file and make sure it contains:

```env
GEMINI_API_KEY=your_key_here
```

without spaces or missing quotes.

### 2. The browser shows "Failed to connect to server"

This usually means the backend is not running. Start it again with:

```bash
npm start
```

### 3. Port 3000 is already in use

Change the port in `.env`:

```env
PORT=3001
```

Then restart the app.

### 4. The model request fails

The app tries multiple Gemini models automatically. If one model is unavailable, it tries another. This is handled in `server.js`.

---

## Security note

The `.env` file should never be uploaded to a public GitHub repository because it contains your secret API key.

Add `.env` to your `.gitignore` file if it is not already included.

Example:

```gitignore
.env
node_modules/
```

---

## Git submission checklist

If you want to upload this project to GitHub, follow these steps in order.

### 1. Open the project folder in a terminal

```bash
cd path/to/ai-website
```

Replace `path/to/ai-website` with the actual folder where your project is saved.

### 2. Check whether the folder is already a Git repository

```bash
git status
```

If Git says the folder is not a repository, then initialize it:

```bash
git init
```

This creates a new Git repository in your project folder.

### 3. Check the files that will be added

```bash
git status
```

This shows which files are tracked, untracked, or modified.

### 4. Add all project files to staging

```bash
git add .
```

This tells Git to include all files in the current folder for the next commit.

### 5. Create a commit

```bash
git commit -m "Initial AI website setup"
```

A commit is a saved snapshot of your project. The message should describe what was added.

### 6. Create or switch to the main branch

```bash
git branch -M main
```

This renames the default branch to `main` so the project follows common GitHub naming conventions.

### 7. Connect the local repository to GitHub

```bash
git remote add origin <your_repository_url>
```

Example:

```bash
git remote add origin https://github.com/yourusername/ai-website.git
```

This links your local project to the GitHub repository you created online.

### 8. Push the project to GitHub

```bash
git push -u origin main
```

This uploads your code to GitHub and sets the upstream branch so future pushes are easier.

### 9. Future updates

After the first push, you can update the project with:

```bash
git add .
git commit -m "Update AI website features"
git push
```

### Important security reminder

Do not push your `.env` file to GitHub if it contains your real API key.

Before uploading, make sure `.env` is ignored in `.gitignore`:

```gitignore
.env
node_modules/
```

If the `.env` file was already committed before ignoring it, remove it from Git history with:

```bash
git rm --cached .env
```

Then commit the change again:

```bash
git add .gitignore
git commit -m "Ignore environment file"
git push
```

> This keeps your API key private while still allowing the project to be shared safely.

---

## Summary

To get the project working from the beginning:

1. Install dependencies with `npm install`
2. Create a `.env` file in the project root
3. Add your `GEMINI_API_KEY` there
4. Start the server with `npm start`
5. Open `http://localhost:3000`
6. Enter a prompt and generate AI output

That is the full process from setup to working AI app.

---

## License

This project is provided as-is for learning and personal use.
