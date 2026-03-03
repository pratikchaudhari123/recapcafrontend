import { NextRequest } from "next/server";

const BACKEND_URL = "http://13.203.232.46:8000";

export async function GET(req: NextRequest) {
  const path = req.nextUrl.pathname.replace("/api/proxy", "");
  const url = BACKEND_URL + path + req.nextUrl.search;

  const response = await fetch(url, {
    headers: req.headers,
  });

  return new Response(await response.text(), {
    status: response.status,
    headers: response.headers,
  });
}

export async function POST(req: NextRequest) {
  const body = await req.text();
  const path = req.nextUrl.pathname.replace("/api/proxy", "");
  const url = BACKEND_URL + path + req.nextUrl.search;

  const response = await fetch(url, {
    method: "POST",
    headers: req.headers,
    body,
  });

  return new Response(await response.text(), {
    status: response.status,
    headers: response.headers,
  });
}
