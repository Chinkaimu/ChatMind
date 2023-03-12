/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */

import { type OpenAIStreamPayload } from "../../types";
import { chatGPTStream } from "../../utils/stream";

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
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 500,
    stream: true,
    n: 1,
  };

  const stream = await chatGPTStream(apiKey, payload);
  return new Response(stream);
};

export default chat;
