import { z } from "zod";
import { google } from "googleapis";

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

// ── Google Sheets persistence ────────────────────────────────────────────────

const SHEET_ID = process.env.GOOGLE_SHEETS_ID;
const SHEET_NAME = "Contributions";

const HEADERS = [
  "ID",
  "Title",
  "Author",
  "URL",
  "Type",
  "Tags",
  "Summary",
  "Submitted By",
  "Status",
  "Created At",
];

async function appendToSheet(contribution: Contribution): Promise<void> {
  if (!SHEET_ID) throw new Error("GOOGLE_SHEETS_ID env var is not set");

  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const rawKey = process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY;
  if (!email || !rawKey) throw new Error("Google service account credentials are not set");

  // Support both escaped and literal newlines in the private key
  const privateKey = rawKey.replace(/\\n/g, "\n");

  const auth = new google.auth.JWT({
    email,
    key: privateKey,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  const sheets = google.sheets({ version: "v4", auth });

  // Ensure the header row exists
  const meta = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A1:J1`,
  });

  if (!meta.data.values || meta.data.values.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId: SHEET_ID,
      range: `${SHEET_NAME}!A1`,
      valueInputOption: "RAW",
      requestBody: { values: [HEADERS] },
    });
  }

  // Append the new row
  await sheets.spreadsheets.values.append({
    spreadsheetId: SHEET_ID,
    range: `${SHEET_NAME}!A:J`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: {
      values: [
        [
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
        ],
      ],
    },
  });
}

// ── Service ──────────────────────────────────────────────────────────────────

export const contributionsService = {
  list(): Contribution[] {
    return queue;
  },

  async submit(input: ContributionInput): Promise<Contribution> {
    const item: Contribution = {
      ...input,
      id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
      status: "pending",
      createdAt: Date.now(),
    };
    queue = [item, ...queue];

    try {
      await appendToSheet(item);
    } catch (err) {
      // Non-fatal: log and continue so the API response still succeeds
      console.error("[contributions] Failed to write to Google Sheets:", err);
    }

    return item;
  },
};
