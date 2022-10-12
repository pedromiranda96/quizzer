import { GetServerSidePropsContext } from "next";
import { unstable_getServerSession } from "next-auth";

import { nextAuthOptions } from "app/pages/api/auth/[...nextauth]";

export const getServerAuthSession = async (ctx: {
  req: GetServerSidePropsContext["req"];
  res: GetServerSidePropsContext["res"];
}) => {
  return await unstable_getServerSession(ctx.req, ctx.res, nextAuthOptions);
};
