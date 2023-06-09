import {
  createParser,
  type ParsedEvent,
  type ReconnectInterval,
} from "eventsource-parser";
import { type OpenAIStreamPayload } from "../../types";

export type ChatGPTPayload = Partial<OpenAIStreamPayload>;

export async function fetchChatGPT(
  apiKey: string,
  payload: ChatGPTPayload
): Promise<Response> {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    method: "POST",
    body: JSON.stringify({
      max_tokens: 500,
      model: "gpt-3.5-turbo",
      ...payload,
    }),
  });
  return res;
}

export async function chatGPTStream(
  apiKey: string,
  payload: Omit<ChatGPTPayload, "stream">
) {
  const res = await fetchChatGPT(apiKey, { ...payload, stream: true });
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  let counter = 0;
  const stream = new ReadableStream({
    async start(controller) {
      // callback
      function onParse(event: ParsedEvent | ReconnectInterval) {
        if (event.type === "event") {
          const data = event.data;
          // https://beta.openai.com/docs/api-reference/completions/create#completions/create-stream
          if (data === "[DONE]") {
            controller.close();
            return;
          }
          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta?.content || "";
            // console.log(JSON.stringify(json, null, 2));
            if (counter < 2 && (text.match(/\n/) || []).length) {
              // this is a prefix character (i.e., "\n\n"), do nothing
              return;
            }
            const queue = encoder.encode(text);
            controller.enqueue(queue);
            counter++;
          } catch (e) {
            // maybe parse error
            controller.error(e);
          }
        }
      }

      // stream response (SSE) from OpenAI may be fragmented into multiple chunks
      // this ensures we properly read chunks and invoke an event for each SSE event stream
      const parser = createParser(onParse);
      if (typeof window !== "undefined") {
        if (res.body) {
          const reader = res.body.getReader();
          for (;;) {
            const { done, value } = await reader.read();
            if (done) break;
            parser.feed(decoder.decode(value));
          }
        }
      } else {
        // https://web.dev/streams/#asynchronous-iteration
        for await (const chunk of res.body as any) {
          parser.feed(decoder.decode(chunk));
        }
      }
    },
  });

  return stream;
}
