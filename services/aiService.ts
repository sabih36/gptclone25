import { GoogleGenAI, Chat, GenerateContentResponse } from "@google/genai";
import { Message, Role } from '../types';

class AIService {
  private ai: GoogleGenAI | null = null;
  private chat: Chat | null = null;

  /**
   * Initializes the GoogleGenAI client using the API key from environment variables.
   * @returns {boolean} True if initialization is successful, false otherwise.
   */
  initialize(): boolean {
    try {
      // Per coding guidelines, API key must come from process.env.API_KEY.
      if (!process.env.API_KEY) {
        console.error("API_KEY environment variable not found.");
        return false;
      }
      this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      return true;
    } catch (error) {
      console.error("Failed to initialize GoogleGenAI:", error);
      this.ai = null;
      return false;
    }
  }
  
  /**
   * Checks if the AI service has been successfully initialized.
   * @returns {boolean}
   */
  isInitialized(): boolean {
    return this.ai !== null;
  }

  /**
   * Creates a new chat session, optionally with a pre-existing message history.
   * This method must be called before sending messages.
   * @param {Message[]} history - An array of previous messages to load into the chat history.
   */
  startChat(history: Message[]) {
    if (!this.ai) {
      throw new Error("AI Service not initialized. Cannot start chat.");
    }

    const mappedHistory = history.map(msg => ({
        role: msg.role === Role.USER ? 'user' : 'model',
        parts: [{ text: msg.content }]
    }));

    this.chat = this.ai.chats.create({
        model: 'gemini-2.5-flash',
        history: mappedHistory,
        config: {
            systemInstruction: 'You are a helpful assistant, designed to be a clone of ChatGPT. Your responses should be informative, well-structured, and engaging.',
        },
    });
  }

  /**
   * Sends a message to the currently active chat session and returns the response as a stream.
   * @param {string} prompt - The user's message.
   * @returns {Promise<AsyncGenerator<GenerateContentResponse>>} A stream of response chunks.
   */
  async sendMessageStream(prompt: string): Promise<AsyncGenerator<GenerateContentResponse>> {
    if (!this.chat) {
        throw new Error("Chat not started. Call startChat before sending a message.");
    }
    // As per SDK guidelines, sendMessageStream expects an object with a 'message' property.
    return this.chat.sendMessageStream({ message: prompt });
  }

  /**
   * Generates a short, concise title for a conversation based on the initial prompt.
   * @param {string} prompt - The user's first message in a conversation.
   * @returns {Promise<string>} The generated title.
   */
  async generateTitle(prompt: string): Promise<string> {
    if (!this.ai) {
        throw new Error("AI Service not initialized. Cannot generate title.");
    }
    try {
        const response = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: `Generate a short, concise title (4-5 words max) for this user prompt: "${prompt}"`,
        });
        
        // Use response.text for direct text output and provide a fallback.
        const title = response.text ?? 'Untitled Chat';
        // Sanitize the title by removing quotes and trimming whitespace.
        return title.replace(/"/g, '').trim();
    } catch (error) {
        console.error("Error generating title:", error);
        return 'Chat'; // Return a default title on error.
    }
  }
}

export const aiService = new AIService();