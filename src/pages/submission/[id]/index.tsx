import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";

import { Layout } from "app/components/common/layout";
import { prisma } from "app/server/db/client";

type SubmissionPageProps = {
  submission: {
    id: string;
    quiz: {
      id: string;
      title: string;
      questions: {
        id: string;
        text: string;
        answers: {
          id: string;
          text: string;
        }[];
      }[];
    };
  };
};

// TODO: Shuffle answers
export default function SubmissionPage({ submission }: SubmissionPageProps) {
  const router = useRouter();

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState(-1);

  function nextQuestion() {
    if (currentQuestionIndex === submission.quiz.questions.length - 1) {
      // TODO: save submission answers in database

      router.push(`/submission/${submission.id}/score`);
      return;
    }

    setSelectedAnswerIndex(-1);
    setCurrentQuestionIndex((currentQuestionIndex) => currentQuestionIndex + 1);
  }

  return (
    <>
      <Head>
        <title>{`${submission.quiz.title} - Quizzer`}</title>
      </Head>
      <Layout>
        <div className="flex-1">
          <header className="mt-12">
            <h1 className="text-slate-800 text-2xl font-bold">
              {submission.quiz.title}
            </h1>
            <div className="flex items-center justify-between">
              <h2 className="text-slate-500 font-semibold text-xl">{`Question ${
                currentQuestionIndex + 1
              } of ${submission.quiz.questions.length}`}</h2>
              <span className="text-slate-500 font-semibold text-xl animate-pulse">
                20:00
              </span>
            </div>
          </header>
          <main className="mt-12 flex flex-col">
            <p className="text-slate-800 text-lg font-semibold">
              {submission.quiz.questions[currentQuestionIndex].text}
            </p>
            <div className="flex flex-col gap-1 mt-12">
              {submission.quiz.questions[currentQuestionIndex].answers.map(
                (answer, index) => (
                  <button
                    key={answer.id}
                    className={`p-4 font-semibold rounded text-left transition-colors break-words ${
                      selectedAnswerIndex === index
                        ? "bg-indigo-600 text-white"
                        : "bg-slate-200 text-slate-800 hover:bg-slate-300"
                    }`}
                    onClick={() => setSelectedAnswerIndex(index)}
                  >
                    {answer.text}
                  </button>
                )
              )}
            </div>
            <button
              className="mt-4 px-4 py-2 ml-auto bg-indigo-600 text-white font-bold rounded hover:bg-indigo-800 transition-colors disabled:bg-slate-400"
              disabled={selectedAnswerIndex === -1}
              onClick={nextQuestion}
            >
              {currentQuestionIndex == submission.quiz.questions.length - 1
                ? "Finish"
                : "Next question"}
            </button>
          </main>
        </div>
      </Layout>
    </>
  );
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<SubmissionPageProps> = async ({
  params,
}) => {
  const id = String(params?.id);
  const submission = await prisma.submission.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      quiz: {
        select: {
          id: true,
          title: true,
          questions: {
            select: {
              id: true,
              text: true,
              answers: {
                select: {
                  id: true,
                  text: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!submission) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      submission,
    },
  };
};
