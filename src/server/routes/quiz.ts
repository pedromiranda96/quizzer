import { z } from "zod";

import { t, protectedProcedure } from "../trpc";

export const quizRouter = t.router({
  create: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
        tags: z.string().array(),
        questions: z
          .object({
            text: z.string(),
            answers: z.string().array(),
            correctAnswerIndex: z.number(),
          })
          .array(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.quiz.create({
        data: {
          title: input.title,
          description: input.description,
          tags: input.tags,
          user: {
            connect: {
              id: ctx.session.user.id,
            },
          },
          questions: {
            create: input.questions.map((question) => ({
              text: question.text,
              answers: {
                create: question.answers.map((answer, index) => ({
                  text: answer,
                  correct: question.correctAnswerIndex === index,
                })),
              },
            })),
          },
        },
        select: {
          id: true,
        },
      });
    }),

  get: t.procedure
    .input(
      z.object({
        quizId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.quiz.findUnique({
        where: {
          id: input.quizId,
        },
        select: {
          id: true,
          title: true,
          description: true,
          _count: {
            select: {
              questions: true,
              submissions: true,
            },
          },
        },
      });
    }),
});
