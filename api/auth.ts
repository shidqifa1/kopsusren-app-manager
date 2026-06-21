import type { VercelRequest, VercelResponse } from "@vercel/node";
import { verifyPassword, createToken } from "./_auth.js";

const VALID_USERNAME = process.env.VALID_USERNAME || "shidqifa";

const ENV_HASH = process.env.VALID_PASSWORD_HASH;
const FALLBACK_HASH = "81f6a36517ec9561788ed1c9e324d770:1d4d5c79412eb34c5febeee94d1b5330b4b2a0aeb54cc8f045781b6979066401b757360f44fe2d2b070357870792ca3931f7a34588a3c3a400f1258d61220b4d";
const VALID_PASSWORD_HASH = ENV_HASH || FALLBACK_HASH;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  const { username = "", password = "" } = req.body || {};

  if (!username || !password) {
    return res.status(400).json({ ok: false, error: "Username dan password wajib diisi" });
  }

  if (username !== VALID_USERNAME) {
    return res.status(401).json({ ok: false, error: "Username atau password salah" });
  }

  const passwordValid = verifyPassword(password, VALID_PASSWORD_HASH);

  if (passwordValid) {
    const token = createToken(username);
    return res.status(200).json({ ok: true, token });
  }

  return res.status(401).json({
    ok: false,
    error: "Username atau password salah"
  });
}
