import { NextRequest } from "next/server";
import { resourcesService, resourceSchema } from "@/modules/resources/resources.service";

export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const q = url.searchParams.get("q") ?? "";
  const type = url.searchParams.get("type") as ReturnType<typeof resourcesService.list>[number]["type"] | null;
  const items = resourcesService.search(q, type ?? undefined);
  return Response.json({ items });
}

export async function POST(req: NextRequest) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const partial = resourceSchema
    .omit({ id: true, verified: true })
    .safeParse(payload);
  if (!partial.success) {
    return Response.json({ error: partial.error.flatten() }, { status: 400 });
  }

  const created = resourcesService.add(partial.data);
  return Response.json({ item: created }, { status: 201 });
}
