import { GetStaticProps, GetStaticPaths } from "next";
import Head from "next/head";
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
    tags: string[];
    user: {
      id: string;
      image: string | null;
      name: string | null;
    };
    _count: {
      questions: number;
      submissions: number;
    };
  };
};

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
    <>
      <Head>
        <title>{`${quiz.title} - Quizzer`}</title>
      </Head>
      <Layout>
        <div className="flex-1 flex py-8">
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
                src={quiz.user.image ?? "/fallback-avatar.png"}
                alt="alt"
                width={128}
                height={128}
                className="rounded-full"
              />
              <span className="text-slate-500 text-md font-light mt-4 leading-4">
                created by
              </span>
              <Link href={`/profile/${quiz.user.id}`}>
                <a className="text-lg text-indigo-800 font-bold hover:underline">
                  {quiz.user.name ?? `u::${quiz.user.id}`}
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
            <section className="mt-12">
              <button
                className="py-2 w-full bg-indigo-800 text-white font-bold rounded hover:bg-indigo-900 transition-colors disabled:bg-slate-400"
                disabled={isLoading}
                onClick={() => {
                  createSubmission({ quizId: quiz.id });
                }}
              >
                Start Quiz
              </button>
            </section>
            <section className="flex gap-2 flex-wrap justify-center items-start mt-8">
              {quiz.tags.map((tag) => (
                <button
                  key={tag}
                  className="bg-indigo-200 text-indigo-800 px-2 rounded-full hover:bg-indigo-300 font-medium transition-colors"
                >
                  {tag}
                </button>
              ))}
            </section>
          </div>
        </div>
      </Layout>
    </>
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
      tags: true,
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
    revalidate: 600,
  };
};
