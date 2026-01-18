// app/auth/auth-view-client.tsx

"use client";

import dynamic from "next/dynamic";

const AuthViewNoSSR = dynamic(
  () => import("@neondatabase/auth/react").then((m) => m.AuthView),
  { ssr: false }
);

export default function AuthViewClient({ path }: { path: string }) {
  return <AuthViewNoSSR path={path as any} />;
}
