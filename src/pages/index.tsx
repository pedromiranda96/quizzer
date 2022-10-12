import Link from "next/link";

import { Layout } from "../components/common/layout";

export default function HomePage() {
  return (
    <Layout>
      <div className="flex-1 space-x-2">
        <Link href="/quiz/create">
          <button className="px-4 py-2 bg-slate-200 hover:bg-slate-300">
            Create quiz page
          </button>
        </Link>
        <Link href="/quiz/123">
          <button className="px-4 py-2 bg-slate-200 hover:bg-slate-300">
            Quiz page
          </button>
        </Link>
        <Link href="/submission/123">
          <button className="px-4 py-2 bg-slate-200 hover:bg-slate-300">
            Submission page
          </button>
        </Link>
        <Link href="/submission/123/score">
          <button className="px-4 py-2 bg-slate-200 hover:bg-slate-300">
            Score page
          </button>
        </Link>
      </div>
    </Layout>
  );
}
