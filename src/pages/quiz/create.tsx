import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { Layout } from "app/components/common/layout";
import { QuestionManagementModal } from "app/components/pages/create-quiz/question-management-modal";
import {
  QuestionManagementProvider,
  useQuestionManagement,
} from "app/context/question-management-context";
import { trpc } from "app/utils/trpc";

interface CreateQuizFormData {
  title: string;
  tags: string[];
  description: string;
}

export default function CreateQuizPage() {
  return (
    <>
      <Head>
        <title>Create Quiz - Quizzer</title>
      </Head>
      <Layout>
        <QuestionManagementProvider>
          <PageContent />
        </QuestionManagementProvider>
      </Layout>
    </>
  );
}

function PageContent() {
  const router = useRouter();

  const {
    register,
    watch,
    setValue,
    handleSubmit,
    formState: { errors },
  } = useForm<CreateQuizFormData>({
    defaultValues: {
      tags: [],
    },
  });

  const { tags } = watch();
  const { questions } = useQuestionManagement();

  const [tag, setTag] = useState("");
  const [managingQuestions, setManagingQuestions] = useState(false);

  const { mutateAsync: createQuiz, isLoading } = trpc.quiz.create.useMutation({
    async onSuccess(data) {
      await router.push(`/quiz/${data.id}`);
    },
  });

  const onSubmit = handleSubmit(({ title, description, tags }) => {
    createQuiz({
      title,
      description,
      tags,
      questions,
    });
  });

  return (
    <div className="flex flex-col flex-1">
      <header className="mt-12">
        <h1 className="text-slate-800 text-xl font-bold">Create quiz</h1>
        <h2 className="text-slate-500 text-lg font-semibold">
          Build a quiz with your favorite theme and share it with everyone
        </h2>
      </header>
      <main className="mt-12">
        <form className="flex flex-col gap-8 max-w-md" onSubmit={onSubmit}>
          <div className="flex flex-col gap-1">
            <span className="text-slate-800 font-semibold">
              Give your quiz a title
            </span>
            <input
              type="text"
              className="text-sm border border-slate-300 rounded"
              {...register("title", {
                required: {
                  value: true,
                  message: "Your quiz must have a title",
                },
              })}
            />
            {errors.title?.message && (
              <span className="text-sm text-red-800 font-semibold">
                {errors.title.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-slate-800 font-semibold">
              Add some tags to help people find your quiz
            </span>
            <input
              type="text"
              className="text-sm border border-slate-300 rounded"
              value={tag}
              onChange={(e) => setTag(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();

                  if (tag) {
                    const lowercase = tag.toLowerCase();
                    setTag("");

                    if (!tags.some((t) => t === lowercase)) {
                      setValue("tags", [...tags, lowercase]);
                    }
                  }
                }
              }}
            />
            <input type="hidden" {...register("tags")} />
            <div className="flex gap-1 justify-end flex-wrap">
              {tags.map((tag, index) => (
                <button
                  type="button"
                  key={index}
                  className="text-sm bg-indigo-200 text-indigo-800 px-2 rounded-full hover:bg-red-200 hover:text-red-800"
                  onClick={() => {
                    setValue(
                      "tags",
                      tags.filter((t) => t !== tag)
                    );
                  }}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-slate-800 font-semibold">
              Write a small description of your quiz
            </span>
            <textarea
              rows={3}
              className="text-sm border border-slate-300 rounded resize-none"
              {...register("description", {
                required: {
                  value: true,
                  message: "Please add a description to your quiz",
                },
              })}
            />
            {errors.title?.message && (
              <span className="text-sm text-red-800 font-semibold">
                {errors.title.message}
              </span>
            )}
          </div>
          <div className="flex flex-col gap-1">
            <button
              type="button"
              className="py-2 bg-indigo-600 text-white text-sm font-bold rounded hover:bg-indigo-800 disabled:bg-slate-400 transition-colors relative"
              onClick={() => setManagingQuestions(true)}
              disabled={isLoading}
            >
              Manage questions
              <span className="px-2 py-1 text-sm text-white bg-sky-600 rounded-full absolute top-0 right-2 -translate-y-1/2">
                {questions.length}
              </span>
            </button>
            <button
              type="submit"
              className="py-2 bg-green-600 text-white text-sm font-bold rounded hover:bg-green-800 disabled:bg-slate-400 transition-colors"
              disabled={questions.length === 0 || isLoading}
            >
              Publish
            </button>
          </div>
        </form>
        <QuestionManagementModal
          open={managingQuestions}
          onClose={() => setManagingQuestions(false)}
        />
      </main>
    </div>
  );
}
