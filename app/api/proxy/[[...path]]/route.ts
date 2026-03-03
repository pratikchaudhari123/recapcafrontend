import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = "https://api.recapca.com";

export async function GET(req: NextRequest) {
  try {
    const path = req.nextUrl.pathname.replace("/api/proxy", "");
    const url = `${BACKEND_URL}${path}${req.nextUrl.search}`;

    console.log(`[PROXY GET] ${url}`);

    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": req.headers.get("Authorization") || "",
      },
    });

    const data = await response.text();

    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("[PROXY GET ERROR]", error);
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.text();
    const path = req.nextUrl.pathname.replace("/api/proxy", "");
    const url = `${BACKEND_URL}${path}${req.nextUrl.search}`;

    console.log(`[PROXY POST] ${url}`);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": req.headers.get("Authorization") || "",
      },
      body,
    });

    const data = await response.text();

    return new NextResponse(data, {
      status: response.status,
      headers: {
        "Content-Type": "application/json",
      },
    });
  } catch (error) {
    console.error("[PROXY POST ERROR]", error);
    return NextResponse.json(
      { error: "Proxy request failed" },
      { status: 500 }
    );
  }
}
