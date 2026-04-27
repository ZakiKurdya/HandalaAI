import seed from "@/data/resources.json";
import { z } from "zod";

export const resourceSchema = z.object({
  id: z.string(),
  title: z.string().min(2),
  author: z.string().min(1),
  year: z.number().int().min(1).max(3000).nullable().optional(),
  type: z.enum(["book", "article", "website", "archive", "video", "image"]),
  url: z.string().url(),
  tags: z.array(z.string()).default([]),
  summary: z.string().max(600).default(""),
  verified: z.boolean().default(false),
  snippets: z.array(z.string()).optional(),
});

export type Resource = z.infer<typeof resourceSchema>;

// In-memory store seeded from JSON. Reset per server process — swap for a DB in NestJS.
let store: Resource[] = (seed as unknown as Resource[]).map((r) => ({ ...r, verified: r.verified ?? false }));

export const resourcesService = {
  list(): Resource[] {
    return store;
  },
  search(query: string, type?: Resource["type"]): Resource[] {
    const q = query.trim().toLowerCase();
    return store.filter((r) => {
      if (type && r.type !== type) return false;
      if (!q) return true;
      const hay = [r.title, r.author, r.summary, ...(r.tags ?? [])].join(" ").toLowerCase();
      return hay.includes(q);
    });
  },
  add(input: Omit<Resource, "id" | "verified">): Resource {
    const id = `${input.title.toLowerCase().replace(/[^a-z0-9]+/g, "-").slice(0, 40)}-${Date.now()}`;
    const next: Resource = { ...input, id, verified: false };
    const parsed = resourceSchema.parse(next);
    store = [parsed, ...store];
    return parsed;
  },
};
