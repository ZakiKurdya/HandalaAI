import { z } from "zod";
import crypto from "crypto";

export const contributionSchema = z.object({
  title: z.string().min(2).max(200),
  author: z.string().min(1).max(120),
  url: z.string().url(),
  type: z.enum(["book", "article", "website", "archive", "video", "image"]),
  tags: z.array(z.string()).default([]),
  summary: z.string().min(10).max(800),
  submittedBy: z.string().max(120).optional(),
});

export type ContributionInput = z.infer<typeof contributionSchema>;

export type Contribution = ContributionInput & {
  id: string;
  status: "pending" | "in_review" | "approved" | "rejected";
  createdAt: number;
};

// In-memory queue (reset per deploy — Google Sheets is the durable store).
let queue: Contribution[] = [];

// ── Lightweight Google Sheets via REST + service-account JWT ─────────────────
// Replaces the heavy `googleapis` package (~300 deps) with Node built-ins only.

const SHEET_ID   = process.env.GOOGLE_SHEETS_ID;
const SHEET_NAME = "Contributions";
const HEADERS    = ["ID","Title","Author","URL","Type","Tags","Summary","Submitted By","Status","Created At"];

function b64url(buf: Buffer | string): string {
  const b = typeof buf === "string" ? Buffer.from(buf) : buf;
  return b.toString("base64").replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
}

async function getAccessToken(email: string, privateKey: string): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  const header  = b64url(JSON.stringify({ alg: "RS256", typ: "JWT" }));
  const payload = b64url(JSON.stringify({
    iss: email,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  }));

  const toSign = `${header}.${payload}`;
  const sign   = crypto.createSign("RSA-SHA256");
  sign.update(toSign);
  const jwt = `${toSign}.${b64url(sign.sign(privateKey))}`;

  const res  = await fetch("https://oauth2.googleapis.com/token", {
    method:  "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body:    new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion:  jwt,
    }),
  });

  const data = await res.json() as { access_token?: string; error?: string };
  if (!data.access_token) throw new Error(`Token exchange failed: ${data.error}`);
  return data.access_token;
}

async function appendToSheet(contribution: Contribution): Promise<void> {
  if (!SHEET_ID) throw new Error("GOOGLE_SHEETS_ID is not set");

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!email || !rawKey) throw new Error("Google service account credentials are not set");

  const privateKey = rawKey.replace(/\\n/g, "\n");
  const token = await getAccessToken(email, privateKey);

  const range = encodeURIComponent(`${SHEET_NAME}!A:J`);

  // Ensure header row on first run
  const getMeta = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  const meta = await getMeta.json() as { values?: string[][] };
  if (!meta.values || meta.values.length === 0) {
    await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}?valueInputOption=RAW`,
      {
        method:  "PUT",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
        body:    JSON.stringify({ values: [HEADERS] }),
      }
    );
  }

  // Append the new row
  const res = await fetch(
    `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${range}:append?valueInputOption=RAW&insertDataOption=INSERT_ROWS`,
    {
      method:  "POST",
      headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      body:    JSON.stringify({
        values: [[
          contribution.id,
          contribution.title,
          contribution.author,
          contribution.url,
          contribution.type,
          contribution.tags.join(", "),
          contribution.summary,
          contribution.submittedBy ?? "",
          contribution.status,
          new Date(contribution.createdAt).toLocaleString("en-GB"),
        ]],
      }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`Sheets append failed ${res.status}: ${body}`);
  }
}

// ── Service ──────────────────────────────────────────────────────────────────

export const contributionsService = {
  list(): Contribution[] {
    return queue;
  },

  async submit(input: ContributionInput): Promise<Contribution> {
    const item: Contribution = {
      ...input,
      id:        `c_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      status:    "pending",
      createdAt: Date.now(),
    };
    queue = [item, ...queue];

    try {
      await appendToSheet(item);
    } catch (err) {
      console.error("[contributions] Failed to write to Google Sheets:", err);
    }

    return item;
  },
};
