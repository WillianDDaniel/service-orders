import "@/app/globals.css";

import { NeonAuthUIProvider } from "@neondatabase/auth/react";
import { authClient } from "@/app/lib/auth/client";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <NeonAuthUIProvider
      authClient={authClient}
      credentials={{ forgotPassword: true }}
    >
      {children}
    </NeonAuthUIProvider>
  );
}
