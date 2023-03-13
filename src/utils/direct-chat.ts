import { type OpenAIStreamPayload, type ChatMessage } from "../types";

export async function directChat(
  apiKey: string,
  chatList: ChatMessage[],
  systemPrompt = "You are ChatGPT, a large language model trained by OpenAI."
) {
  const messages = chatList
    .slice(-10)
    .map((chat) => {
      return [
        {
          role: "user",
          content: chat.question,
        },
        ...(chat.answer
          ? [
              {
                role: "assistant",
                content: chat.answer,
              },
            ]
          : []),
      ];
    })
    .flat();
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    method: "POST",
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: systemPrompt,
        },
        ...messages,
      ],
      stream: true,
      max_tokens: 500,
      // temperature: 0.7,
      // top_p: 1,
      // frequency_penalty: 0,
      // presence_penalty: 0,
      // n: 1,
    } as OpenAIStreamPayload),
  });
  let data: ReadableStream<Uint8Array> | null;
  try {
    data = response.body;
    if (!response.ok || !data) {
      throw new Error(
        "Sorry, An error occurred. If this issue persists please contact Open AI through help center at help.openai.com."
      );
    }
  } catch (error) {
    console.error(`OpenAI API error`, error);
    throw new Error("Sorry, Open AI is not available");
  }

  const reader = data.getReader();
  const decoder = new TextDecoder();
  let done = false;
  while (!done) {
    const { value, done: doneReading } = await reader.read();
    done = doneReading;
    const chunkValue = decoder.decode(value);
    
  }
  return response;
}
