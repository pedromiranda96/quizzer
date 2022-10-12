import * as trpc from "@trpc/server";
import { CreateNextContextOptions } from "@trpc/server/adapters/next";

import { prisma } from "./db/client";
import { getServerAuthSession } from "./helpers/session";

export const createContext = async ({ req, res }: CreateNextContextOptions) => {
  const session = await getServerAuthSession({
    req,
    res,
  });

  return {
    prisma,
    session,
  };
};

export type Context = trpc.inferAsyncReturnType<typeof createContext>;
