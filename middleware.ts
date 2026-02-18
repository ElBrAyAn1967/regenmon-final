// ==============================================
// MIDDLEWARE
// ==============================================
// CORS para APIs públicas + Protección de rutas /admin

import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// ==============================================
// CORS HEADERS para APIs públicas
// ==============================================
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization",
};

// ==============================================
// MIDDLEWARE PRINCIPAL
// ==============================================
export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // --- CORS: Handle preflight OPTIONS for /api routes ---
  if (pathname.startsWith("/api/") && req.method === "OPTIONS") {
    return new NextResponse(null, { status: 204, headers: corsHeaders });
  }

  // --- CORS: Add headers to all public /api responses ---
  if (pathname.startsWith("/api/") && !pathname.startsWith("/api/admin")) {
    const response = NextResponse.next();
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value);
    });
    return response;
  }

  // --- Admin protection: require NextAuth session ---
  if (pathname.startsWith("/admin") && !pathname.startsWith("/admin/login")) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    if (!token) {
      const loginUrl = new URL("/admin/login", req.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

// ==============================================
// MATCHER
// ==============================================
export const config = {
  matcher: ["/api/:path*", "/admin/:path*"],
};
