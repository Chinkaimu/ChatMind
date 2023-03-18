import { z } from "zod";
import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { ChatResponse, type ChatGPTMessage } from "../../../types";
import { fetchChatGPT } from "../../utils/chatgpt-request";

export const chatMessageSchema = z.object({
  question: z.string(),
  answer: z.string(),
  createdAt: z.number(),
  error: z.string().optional(),
});

export const chatMessagesSchema = z.array(chatMessageSchema);

export const chatRouter = createTRPCRouter({
  summary: publicProcedure
    .input(z.object({ messages: chatMessagesSchema, apiKey: z.string() }))
    .query(async ({ input }) => {
      const normalizedMessages: ChatGPTMessage[] = input.messages
        .slice(-5)
        .map((chat) => {
          return [
            {
              role: "user",
              content: chat.question,
            } as const,
            ...(chat.answer
              ? [
                  {
                    role: "assistant",
                    content: chat.answer,
                  } as const,
                ]
              : []),
          ];
        })
        .flat();
      const res = await fetchChatGPT(input.apiKey, {
        messages: [
          ...normalizedMessages,
          {
            role: "user",
            content:
              "Could you summary the main topic of this conversation? No more than 10 words.",
          },
        ],
      });
      const data = await res.json() as ChatResponse;
      return data.choices[0]?.message.content;
    }),
});
