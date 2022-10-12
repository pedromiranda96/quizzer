import { createNextApiHandler } from "@trpc/server/adapters/next";

import { createContext } from "app/server/context";
import { router } from "app/server/router";

export default createNextApiHandler({
  router,
  createContext,
  onError({ path, error }) {
    console.error(`tRPC failed on ${path}: ${error}`);
  },
});
