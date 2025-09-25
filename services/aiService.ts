import { GoogleGenAI, Chat } from "@google/genai";
import { Message, Role } from '../types';

class AIService {
  private ai: GoogleGenAI | null = null;
  private chat: Chat | null = null;

  initialize(apiKey: string): boolean {
    if (!apiKey) {
      console.error("API key is missing.");
      return false;
    }
    try {
      this.ai = new GoogleGenAI({ apiKey });
      return true;
    } catch (error) {
      console.error("Failed to initialize GoogleGenAI:", error);
      this.ai = null;
      return false;
    }
  }
  
  isInitialized(): boolean {
    return this.ai !== null;
  }

  startChat(history: Message[]) {
    if (!this.ai) {
      throw new Error("AI Service not initialized.");
    }
    this.chat = this.ai.chats.create({
        model: 'gemini-2.5-flash',
        history: history.map(msg => ({
            role: msg.role === Role.USER ? 'user' : 'model',
            parts: [{ text: msg.content }]
        })),
        config: {
            systemInstruction: 'You are a helpful assistant, designed to be a clone of ChatGPT. Your responses should be informative, well-structured, and engaging.',
        },
    });
  }

  async sendMessageStream(prompt: string) {
    if (!this.chat) {
        throw new Error("Chat not started. Call startChat first.");
    }
    return this.chat.sendMessageStream({ message: prompt });
  }

  async generateTitle(prompt: string): Promise<string> {
    if (!this.ai) {
        throw new Error("AI Service not initialized.");
    }
    const response = await this.ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `Generate a short, concise title (4-5 words max) for this user prompt: "${prompt}"`,
    });
    const title = response.text;
    return title.replace(/"/g, '');
  }
}

export const aiService = new AIService();
