// middleware.ts
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/dashboard")) {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.sub) {
      return NextResponse.redirect(new URL("/", req.url));
    }
    let ul = `${req.nextUrl.origin}/api/checkValidity`;

    const response = await fetch(ul, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        cookie: req.headers.get("cookie") || "",
      },
    });
    if (response.status !== 200) {

      return NextResponse.redirect(new URL("/", req.url));
    }
  }
    return NextResponse.next();
}
export const config = {
  matcher: "/dashboard/:path*",
};
