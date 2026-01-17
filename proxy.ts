import { neonAuthMiddleware } from "@neondatabase/auth/next/server";

export default neonAuthMiddleware({
  loginUrl: "/auth/sign-in",
});

export const config = {
  matcher: [
    "/",              // protege home
    "/orders/:path*", // protege suas rotas do app
  ],
};
