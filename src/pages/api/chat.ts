/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { type OpenAIStreamPayload } from "../../types";
import { chatGPTStream } from "~/server/utils/chatgpt-request";

export const config = {
  runtime: "edge",
};

type RequestBody = {
  apiKey: string;
} & Pick<OpenAIStreamPayload, "messages">;

const chat = async (req: Request): Promise<Response> => {
  const { apiKey, messages } = (await req.json()) as RequestBody;

  if (!apiKey) {
    return new Response("No API key", { status: 400 });
  }
  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo",
    messages,
    max_tokens: 500,
    stream: true,
  };

  const stream = await chatGPTStream(apiKey, payload);
  return new Response(stream);
};

export default chat;
