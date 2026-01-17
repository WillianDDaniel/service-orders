import AuthViewClient from "../auth-view-client";

export const dynamicParams = false;

const allowed = new Set(["sign-in", "forgot-password", "reset-password"]);

export default async function AuthPage({
  params,
}: {
  params: Promise<{ path: string }>;
}) {
  const { path } = await params;

  if (!allowed.has(path)) return null;

  return <AuthViewClient path={path} />;
}
