import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const ALLOWED_PATHS = new Set(["/", "/favicon.ico"]);

export function middleware(request: NextRequest) {
	const { pathname } = request.nextUrl;

	if (
		pathname.startsWith("/_next") ||
		pathname.startsWith("/api")
	) {
		return NextResponse.next();
	}

	if (ALLOWED_PATHS.has(pathname)) {
		return NextResponse.next();
	}

	const url = request.nextUrl.clone();
	url.pathname = "/";
	url.search = "";
	return NextResponse.redirect(url);
}

export const config = {
	matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
