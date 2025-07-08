// middleware.js
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  console.log("🟠 Middleware appelé sur :", pathname);

  if (pathname === "/commande") {
    const autorise = req.cookies.get("commande_autorisee")?.value;

    console.log("🟡 Cookie reçu =", autorise);

    if (!autorise) {
      const url = req.nextUrl.clone();
      url.pathname = "/produits";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/commande"],
};
