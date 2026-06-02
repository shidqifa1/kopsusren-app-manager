import type { VercelRequest, VercelResponse } from "@vercel/node";
import { createHash } from "crypto";

const VALID_USERNAME = "shidqifa";
const VALID_PASSWORD_HASH = createHash("sha256").update("kopsusren").digest("hex");

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Cek Method harus POST
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  // 2. Ambil username & password (Vercel udah otomatis parse req.body, gausah di-await json lagi)
  const { username = "", password = "" } = req.body || {};
  const inputHash = createHash("sha256").update(password).digest("hex");

  // 3. Validasi Login
  if (username === VALID_USERNAME && inputHash === VALID_PASSWORD_HASH) {
    const token = createHash("sha256")
      .update(username + Date.now().toString() + Math.random().toString())
      .digest("hex");
      
    return res.status(200).json({ ok: true, token });
  }

  // 4. Kalau salah kirim 401
  return res.status(401).json({ 
    ok: false, 
    error: "Username atau password salah" 
  });
}