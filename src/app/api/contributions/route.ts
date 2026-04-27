import { NextRequest } from "next/server";
import { contributionSchema, contributionsService } from "@/modules/contributions/contributions.service";

export const runtime = "nodejs";

export async function GET() {
  return Response.json({ items: contributionsService.list() });
}

export async function POST(req: NextRequest) {
  let payload: unknown;
  try {
    payload = await req.json();
  } catch {
    return new Response("Invalid JSON", { status: 400 });
  }

  const parsed = contributionSchema.safeParse(payload);
  if (!parsed.success) {
    return Response.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const created = await contributionsService.submit(parsed.data);
  return Response.json({ item: created }, { status: 201 });
}
