/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { onCallGenkit } from "firebase-functions/https";

import { gpt4o, openAI } from "genkitx-openai";
import { genkit, z } from "genkit";
import { logger } from 'genkit/logging';


const ai = genkit({
  model: gpt4o,
  plugins: [openAI(
    {
      apiKey: process.env.OPENAI_API_KEY!,
    }
  )],
});
logger.setLogLevel('debug');

export const myFlow = ai.defineFlow(
  {
    name: "myFlow",
    inputSchema: z.object({ text: z.string() }),
    outputSchema: z.string(),
  },
  async (toProcess: { text: any; }) => {
    const prompt =
    `Tell me a joke about ${toProcess.text}`;

    const llmResponse = await ai.generate({
        prompt: prompt,
        config: {
        temperature: 1,
        },
    });

    return llmResponse.text;
  },
);

export const tellJoke = onCallGenkit({
  authPolicy: () => true, // Allow all users to call this function. Not recommended for production.
}, myFlow);
