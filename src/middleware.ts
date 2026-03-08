// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verifySession } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /dashboard routes but NOT /dashboard/login itself
  const isLoginPage = pathname === "/dashboard/login" || pathname.startsWith("/dashboard/login/");
  if (pathname.startsWith("/dashboard") && !isLoginPage) {
    const token = request.cookies.get("admin_session")?.value;
    if (!token || !(await verifySession(token))) {
      return NextResponse.redirect(new URL("/dashboard/login", request.url));
    }
  }

  // CORS for API routes
  if (pathname.startsWith("/api/")) {
    const origin = request.headers.get("origin");
    const allowedOrigin = process.env.NEXT_PUBLIC_URL ?? "http://localhost:3000";
    
    const response = NextResponse.next();
    
    if (origin === allowedOrigin || !origin) {
      response.headers.set("Access-Control-Allow-Origin", origin ?? allowedOrigin);
    }

    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": origin === allowedOrigin ? origin : allowedOrigin,
          "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
          "Access-Control-Allow-Headers": "Content-Type",
          "Access-Control-Max-Age": "86400",
        },
      });
    }

    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/api/:path*"],
};
