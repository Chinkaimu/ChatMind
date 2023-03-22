import { NextResponse } from "next/server";
import { type NextURL } from "next/dist/server/web/next-url";
import { type NextRequest } from "next/server";

export default function middleware(request: NextRequest) {
  if (
    ["/api", "/_next", "/assets"].some((path) =>
      request.nextUrl.pathname.startsWith(path)
    ) ||
    /^\/[^\/]+\.[^\/]+$/.test(request.nextUrl.pathname)
  ) {
    return NextResponse.next();
  }
  const { url, currentHost } = parseMiddlewareUrl(request);
  // console.log({ url, currentHost });
  if (currentHost == "app") {
    url.pathname = `/app${url.pathname}`;
    // console.log("rewrite app", url);
    return NextResponse.rewrite(url);
  }
  return NextResponse.next();
}

export const config = {
  matcher: "/",
};

type ParsedUrl = {
  url: NextURL;
  host: string;
  currentHost: string;
};

function parseMiddlewareUrl(req: NextRequest): ParsedUrl {
  const url = req.nextUrl;

  // Get host of request (e.g. chatmind.co, demo.localhost:3000)
  const host = req.headers.get("host") || "chatmind.co";

  const currentHost = parseSubdomain(host) || host;
  return { url, host, currentHost };
}

const HOME_HOSTS = [
  // All subdomains should come before the root domain,
  // or the replacing will not work as expected
  "chatmind.co",
  "localhost:3000",
];

function parseSubdomain(host: string) {
  let currentHost = host;
  HOME_HOSTS.forEach((homeDomain) => {
    currentHost = currentHost.replace(`.${homeDomain}`, "");
  });
  if (currentHost === host) {
    // It's not a subdomain
    return null;
  }
  return currentHost;
}
