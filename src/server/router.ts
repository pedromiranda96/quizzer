import { quizRouter } from "./routes/quiz";
import { submissionRouter } from "./routes/submission";
import { t } from "./trpc";

export const router = t.router({
  quiz: quizRouter,
  submission: submissionRouter,
});

export type AppRouter = typeof router;
