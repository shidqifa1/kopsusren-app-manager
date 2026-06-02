import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { appState } from "../../db/schema.js";
import { eq } from "drizzle-orm";

export default async (req: Request) => {
  if (req.method === "GET") {
    const rows = await db.select().from(appState).limit(1);
    if (rows.length === 0) {
      return Response.json(null);
    }
    return Response.json(rows[0].data);
  }

  if (req.method === "POST") {
    const data = await req.json();
    const existing = await db
      .select({ id: appState.id })
      .from(appState)
      .limit(1);

    if (existing.length === 0) {
      await db.insert(appState).values({ data });
    } else {
      await db
        .update(appState)
        .set({ data, updatedAt: new Date() })
        .where(eq(appState.id, existing[0].id));
    }

    return Response.json({ ok: true });
  }

  if (req.method === "DELETE") {
    await db.delete(appState);
    return Response.json({ ok: true });
  }

  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = {
  path: "/api/state",
};
