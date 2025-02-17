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
  promptDir: 'prompts',
  plugins: [
    openAI(
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
  async (toProcess) => {

    const nluPrompt = ai.prompt("joke");

    const result = await nluPrompt({
        text: toProcess.text,
    });

    return result.text;
  },
);

export const tellJoke = onCallGenkit({
  authPolicy: () => true, // Allow all users to call this function. Not recommended for production.
}, myFlow);