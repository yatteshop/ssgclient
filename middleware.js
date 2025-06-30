import { NextResponse } from "next/server";

export function middleware(req) {
  if (req.nextUrl.pathname === "/commande") {
    const cartCookie = req.cookies.get("guest_cart")?.value;

    if (!cartCookie || cartCookie === "[]" || cartCookie === "{}") {
      const url = req.nextUrl.clone();
      url.pathname = "/client";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/commande"],
};
