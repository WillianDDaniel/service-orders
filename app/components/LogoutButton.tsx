"use client";

import { useRouter } from "next/navigation";

export default function LogoutButton() {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/sign-out", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: "{}",
    });

    router.replace("/auth/sign-in");
    router.refresh();
  }

  return <button className="cursor-pointer" onClick={handleLogout}>Logout</button>;
}
