import { createProxySSGHelpers } from "@trpc/react/ssg";
import { Session } from "next-auth";

import { prisma } from "../db/client";
import { router } from "../router";

export const createTrpcSSGHelpers = (session: Session | null) =>
  createProxySSGHelpers({
    router,
    ctx: {
      prisma,
      session,
    },
  });
