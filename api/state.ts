import type { VercelRequest, VercelResponse } from "@vercel/node";
import { db } from "../db/index.js"; // Jalur diubah jadi ../ karena foldernya naik 1 tingkat
import { appState } from "../db/schema.js";
import { eq } from "drizzle-orm";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Method GET (Ambil Data)
  if (req.method === "GET") {
    const rows = await db.select().from(appState).limit(1);
    if (rows.length === 0) {
      return res.status(200).json(null);
    }
    return res.status(200).json(rows[0].data);
  }

  // 2. Method POST (Simpen / Update Data)
  if (req.method === "POST") {
    const data = req.body; // Vercel udah otomatis parsing req.body, gausah pake await req.json()
    
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

    return res.status(200).json({ ok: true });
  }

  // 3. Method DELETE (Hapus Data)
  if (req.method === "DELETE") {
    await db.delete(appState);
    return res.status(200).json({ ok: true });
  }

  // 4. Kalau method-nya selain GET/POST/DELETE, tolak!
  return res.status(405).send("Method not allowed");
}