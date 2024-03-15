import { NextResponse } from "next/server";

export function middleware(request: Request) {
  const requestHeaders = new Headers(request.headers);

  const url = new URL(request.url);

  requestHeaders.set("x-url", url.href);
  requestHeaders.set("x-hostname", url.hostname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}
