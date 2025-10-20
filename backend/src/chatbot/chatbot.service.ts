import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { EventsService } from 'src/events/events.service';
// You would need to install and import the Google Generative AI SDK
import { GoogleGenerativeAI } from '@google/generative-ai';

@Injectable()
export class ChatbotService {
  private genAI: GoogleGenerativeAI;

  constructor(
    private readonly eventsService: EventsService,
    private readonly configService: ConfigService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY is not set in the environment variables');
    }
    this.genAI = new GoogleGenerativeAI(apiKey);
  }

  async generateResponse(userQuery: string): Promise<{ reply: string }> {
    // 1. Fetch event context from the database
    const events = await this.eventsService.findAll({}); // Fetches all published events

    // 2. Construct a more sophisticated prompt
    const eventContext = events
      .map(
        (event) =>
          `- ID: ${event.id}, Title: ${event.title}, Description: ${event.description}, Starts: ${event.startAt}, Location: ${event.locationText}`,
      )
      .join('\n');

    const prompt = `You are FreeDay AI, a friendly and conversational event assistant. Your personality is helpful, enthusiastic, and a little bit fun. 

Your primary goal is to help users find interesting events. First, analyze the user's message to understand their intent.

1.  **If the user is asking for specific events** (e.g., "find me a concert", "any events this weekend?"), analyze the list of available events below and suggest a few that match. For each event you suggest, you MUST place a special link placeholder immediately after its title, like this: "You should check out The Great Gala [EVENT_URL:/events/evt_123]".
2.  **If the user is asking a general question** (e.g., "what can you do?", "what kind of events are there?"), answer it naturally without suggesting specific events from the list.
3.  **If the user is just making small talk** (e.g., "hello", "thank you"), respond politely and conversationally.

**LANGUAGE RULE:** You MUST detect the language of the user's message (e.g., Vietnamese, English, Japanese) and write your entire response in that same language.

**CRITICAL RULE:** Only use the 
[EVENT_URL:/events/EVENT_ID]
 placeholder if you are actively suggesting a specific event from the list. Do not include it in general conversation.
---
DATABASE: AVAILABLE EVENTS ---
${eventContext}
---

**User's Message:** "${userQuery}"

**Your Conversational Reply:**`;

    // --- 3. Call Gemini API ---
    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
      return { reply: text };
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      return { reply: "I'm sorry, I'm having trouble connecting to my brain right now. Please try again later." };
    }
  }
}

