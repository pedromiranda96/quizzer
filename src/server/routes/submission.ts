import { z } from "zod";

import { protectedProcedure, t } from "../trpc";

export const submissionRouter = t.router({
  create: protectedProcedure
    .input(
      z.object({
        quizId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.submission.create({
        data: {
          quiz: {
            connect: {
              id: input.quizId,
            },
          },
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
        select: {
          id: true,
        },
      });
    }),
});
