const { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } = require("@google/generative-ai");
const dotenv = require("dotenv");

dotenv.config({ path: "../.env" });

const GENERATION_CONFIG = {
  temperature: 0.7,
  topK: 40,
  topP: 0.95,
  maxOutputTokens: 1000,
};

const SAFETY_SETTINGS = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
];

const apiKey = process.env.GEMINI_API_KEY;

const genAI = new GoogleGenerativeAI(apiKey);
let chat; // Persistent chat session object.

async function initializeChat() {
  try {
    const model = genAI.getGenerativeModel({ model: process.env.MODEL_NAME });
    chat = model.startChat({
      generationConfig: GENERATION_CONFIG,
      safetySettings: SAFETY_SETTINGS,
      history: [], // Optional: Start with an empty chat history.
    });
    console.log("Gemini Chat initialized.");
  } catch (error) {
    console.error("Error initializing Gemini chat:", error.message);
  }
}

async function callGPT(promptContent, systemContent, previousChat) {
  try {
    if (!chat) {
      throw new Error("Chat session not initialized.");
    }

    // Combine the prompts into one cohesive input for the Gemini chat.
    const combinedPrompt = `${systemContent}\n\n${previousChat}\n\nUser: ${promptContent}`;

    const response = await chat.sendMessage(combinedPrompt);

    if (response.error) {
      throw new Error(response.error.message);
    }

    return response.response.text(); // Gemini responses are in `.response.text()`.
  } catch (error) {
    console.error("Gemini API Error:", error.message);
    return `An error occurred while processing the request: ${error.message}`;
  }
}

// Initialize the chat session when the module loads.
initializeChat();

module.exports = { callGPT };
