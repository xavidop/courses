/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { gpt4o, openAI } from "genkitx-openai";
import { genkit, z } from "genkit";
import { logger } from 'genkit/logging';
import { onCallGenkit } from "firebase-functions/https";

const ai = genkit({
  model: gpt4o,
  plugins: [
    openAI(
    {
      apiKey: process.env.OPENAI_API_KEY!,
    }
  )],
});
logger.setLogLevel('debug');

const getJoke = ai.defineTool(
  {
    name: "getJoke",
    description:
      "Get a randome joke about a specific topic",
    inputSchema: z.object({ jokeTopic: z.string() }),
    outputSchema: z.object({ joke: z.string() }),
  },
  async ({ jokeTopic }) => {
    const response = await fetch(`https://v2.jokeapi.dev/joke/Any?contains=${jokeTopic}`);
    const joke = await response.json();
    return {"joke": joke.joke};
  },
);

export const myFlow = ai.defineFlow(
  {
    name: "myFlow",
    inputSchema: z.object({ text: z.string() }),
    outputSchema: z.string(),
  },
  async (toProcess) => {

    const prompt =
    `Tell me a joke about ${toProcess.text}`;

    const result = await ai.generate({
      prompt,
      tools: [getJoke]
    });

    return result.text;
  },
);

export const tellJoke = onCallGenkit({
  authPolicy: () => true, // Allow all users to call this function. Not recommended for production.
}, myFlow);