import { Session } from "next-auth";
import { SessionProvider } from "next-auth/react";
import type { AppType } from "next/app";

import { trpc } from "app/utils/trpc";

import "../styles/globals.css";

const App: AppType<{ session: Session | null }> = ({
  Component,
  pageProps: { session, ...pageProps },
}) => {
  return (
    <SessionProvider session={session}>
      <Component {...pageProps} />
    </SessionProvider>
  );
};

export default trpc.withTRPC(App);
