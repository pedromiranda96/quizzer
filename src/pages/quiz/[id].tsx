import { GetStaticProps, GetStaticPaths } from "next";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";

import { Layout } from "app/components/common/layout";
import { prisma } from "app/server/db/client";
import { trpc } from "app/utils/trpc";

type QuizPageProps = {
  quiz: {
    id: string;
    title: string;
    description: string;
    user: {
      image: string | null;
      id: string;
      name: string | null;
    };
    _count: {
      questions: number;
      submissions: number;
    };
  };
};

// TODO: Display quiz tags somewhere
export default function QuizPage({ quiz }: QuizPageProps) {
  const router = useRouter();

  const { mutateAsync: createSubmission, isLoading } =
    trpc.submission.create.useMutation({
      async onSuccess(data) {
        await router.push(`/submission/${data.id}`);
      },
    });

  const compactNumberFormatter = Intl.NumberFormat("en", {
    notation: "compact",
  });

  return (
    <Layout>
      <div className="flex-1 flex">
        <div className="flex flex-col m-auto w-[420px]">
          <header className="space-y-1">
            <h1 className="text-2xl text-slate-800 text-center font-bold">
              {quiz.title}
            </h1>
            <h2 className="text-lg text-slate-500 text-center font-semibold">
              {quiz.description}
            </h2>
          </header>
          <main className="flex flex-col items-center mt-10">
            <Image
              src={quiz.user.image ?? "https://github.com/diego3g"}
              alt="alt"
              width={128}
              height={128}
              className="rounded-full"
            />
            <span className="text-slate-500 text-md font-light mt-4 leading-4">
              created by
            </span>
            <Link href="/profile/123">
              <a className="text-lg text-indigo-800 font-bold hover:underline">
                {quiz.user.name}
              </a>
            </Link>
            <div className="flex items-center divide-x-2 w-full mt-10">
              <QuizStat label="Questions" value={quiz._count.questions} />
              <QuizStat label="Time" value="15:00" />
              <QuizStat
                label="Submissions"
                value={compactNumberFormatter.format(quiz._count.submissions)}
              />
            </div>
          </main>
          <button
            className="py-2 bg-indigo-800 text-white font-bold rounded mt-12 hover:bg-indigo-900 transition-colors disabled:bg-slate-400"
            disabled={isLoading}
            onClick={() => {
              createSubmission({ quizId: quiz.id });
            }}
          >
            Start Quiz
          </button>
        </div>
      </div>
    </Layout>
  );
}

function QuizStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="flex-1 flex flex-col items-center">
      <span className="text-3xl text-indigo-800 font-bold">{value}</span>
      <span className="text-slate-600 font-semibold">{label}</span>
    </div>
  );
}

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps<QuizPageProps> = async ({
  params,
}) => {
  const id = String(params?.id);
  const quiz = await prisma.quiz.findUnique({
    where: {
      id,
    },
    select: {
      id: true,
      title: true,
      description: true,
      user: {
        select: {
          id: true,
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          questions: true,
          submissions: true,
        },
      },
    },
  });

  if (!quiz) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      quiz,
    },
  };
};
