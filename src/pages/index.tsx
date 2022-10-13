import Link from "next/link";

import { Layout } from "app/components/common/layout";

export default function HomePage() {
  return (
    <Layout pageTitle="Home">
      <div className="flex-1 flex items-center justify-center">
        <Link href="/quiz/create">
          <button className="px-4 py-2 bg-slate-200 hover:bg-slate-300">
            Create quiz page
          </button>
        </Link>
      </div>
    </Layout>
  );
}
