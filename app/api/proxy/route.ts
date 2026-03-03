export async function GET(req: Request) {
  const url = req.url.replace(req.nextUrl.origin + "/api", "http://13.203.232.46:8000/api");
  const response = await fetch(url, {
    headers: req.headers,
  });
  return new Response(await response.text(), {
    status: response.status,
    headers: response.headers,
  });
}

export async function POST(req: Request) {
  const body = await req.text();
  const url = req.url.replace(req.nextUrl.origin + "/api", "http://13.203.232.46:8000/api");
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
