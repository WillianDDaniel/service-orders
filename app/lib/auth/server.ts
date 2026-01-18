// app/lib/auth/server.ts
import { createAuthServer } from "@neondatabase/auth/next/server";

export const authServer = createAuthServer();

export async function requireUserId(): Promise<string> {
  const { data } = await authServer.getSession();
  const userId = data?.user?.id;

  if (!userId) throw new Error("Not authenticated");
  return userId;
}
