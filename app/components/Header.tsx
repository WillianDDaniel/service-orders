import Link from "next/link";
import { cookies } from "next/headers";
import LogoutButton from "./LogoutButton";

export async function Header() {
  const cookieStore = await cookies();

  const hasSession =
    !!cookieStore.get("__Secure-neon-auth.session_token")?.value;

  return (
    <header className="app-header">
      <nav>
        <Link href="/">Home</Link>
        {hasSession ? <LogoutButton /> : null}
      </nav>
    </header>
  );
}
