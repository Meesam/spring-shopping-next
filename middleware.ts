import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PUBLIC_PATHS = ["/login", "/register", "/forgotPassword","/", "/about", "/public"];

function isPublic(pathname: string) {
    return PUBLIC_PATHS.some((p) => pathname.startsWith(p));
}

export function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    // Example: read auth from cookie (adjust name)
    const token = req.cookies.get("access_token")?.value;
    if (!token && !isPublic(pathname)) {
        const url = new URL("/login", req.url);
        url.searchParams.set("redirect", pathname);
        return NextResponse.redirect(url);
    }
    // Optional role/claims checks by decoding token here

    return NextResponse.next();
}

// Limit to pages you care about
export const config = {
    matcher: [
        "/((?!_next/static|_next/image|favicon.ico|images|api/public).*)",
    ],
};