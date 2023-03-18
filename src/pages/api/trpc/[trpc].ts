import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "~/server/api/root";
import { type NextRequest } from "next/server";
import { createInnerTRPCContext } from "~/server/api/trpc";

export const config = {
  runtime: "edge",
};
export default async function handler(req: NextRequest) {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    router: appRouter,
    req,
    createContext: () => createInnerTRPCContext({}),
  });
}
