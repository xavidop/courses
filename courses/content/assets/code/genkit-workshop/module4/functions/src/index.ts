/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { genkit, z } from "genkit";
import { gpt4o, openAI, textEmbeddingAda002 } from "genkitx-openai";
import { Document } from 'genkit/retriever';

import {
  devLocalIndexerRef,
  devLocalRetrieverRef,
  devLocalVectorstore,
} from "@genkit-ai/dev-local-vectorstore";
import { chunk } from "llm-chunk";
import { readFile } from "fs/promises";
import pdf from "pdf-parse";
import * as path from "path";
import { logger } from 'genkit/logging';
import { onCallGenkit } from "firebase-functions/https";

const ai = genkit({
  model: gpt4o,
  plugins: [
    openAI({
      apiKey: process.env.OPENAI_API_KEY!,
    }),
    devLocalVectorstore([
      {
        indexName: "jokes",
        embedder: textEmbeddingAda002,
      },
    ]),
  ],
});
logger.setLogLevel('debug');

export const jokeIndexer = devLocalIndexerRef("jokes");
export const jokeRetriever = devLocalRetrieverRef('jokes');

export const ingester = ai.defineFlow(
  {
    name: "ingester",
    inputSchema: z.string(),
    outputSchema: z.void(),
  },
  async (filepath: string) => {
    const file = path.resolve(filepath);

    // Read the pdf.
    const pdfTxt = await ai.run("extract-text", () => extractTextFromPdf(file));
    const chunkingConfig = {
      minLength: 1000,
      maxLength: 2000,
      splitter: "paragraph",
      overlap: 100,
      delimiters: "",
    } as any;
    // Divide the pdf text into segments.
    const chunks = await ai.run("chunk-it", async () =>
      chunk(pdfTxt, chunkingConfig),
    );

    // Convert chunks of text into documents to store in the index.
    const documents = chunks.map((text: string) => {
      return Document.fromText(text, { filepath });
    });

    // Add documents to the index.
    await ai.index({
      indexer: jokeIndexer,
      documents,
    });
  },
);

export const ingesterFlow = onCallGenkit({
  authPolicy: () => true, // Allow all users to call this function. Not recommended for production.
}, ingester);

async function extractTextFromPdf(filePath: string) {
  const pdfFile = path.resolve(filePath);
  const dataBuffer = await readFile(pdfFile);
  const data = await pdf(dataBuffer);
  return data.text;
}

const getJoke = ai.defineTool(
  {
    name: "getJoke",
    description: "Get a randome joke about a specific topic",
    inputSchema: z.object({ jokeTopic: z.string() }),
    outputSchema: z.object({ joke: z.string() }),
  },
  async ({ jokeTopic }) => {
    const response = await fetch(
      `https://v2.jokeapi.dev/joke/Any?contains=${jokeTopic}`,
    );
    const joke = await response.json();
    return { joke: joke.joke };
  },
);

export const myFlow = ai.defineFlow(
  {
    name: "myFlow",
    inputSchema: z.object({ text: z.string() }),
    outputSchema: z.string(),
  },
  async (toProcess) => {
    const prompt = `Tell me a joke about ${toProcess.text}. Create a joke structure that follows best practices and explain which ones you used.`;

    const docs = await ai.retrieve({
      retriever: jokeRetriever,
      query: "Joke structure best practices",
      options: { k: 3 },
    });

    console.log(JSON.stringify(docs, null, 2));

    const result = await ai.generate({
      prompt,
      tools: [getJoke],
      docs,
    });

    return result.text;
  },
);

export const tellJoke = onCallGenkit({
  authPolicy: () => true, // Allow all users to call this function. Not recommended for production.
}, myFlow);