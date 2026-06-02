import type { Config } from "@netlify/functions";
import { createHash } from "crypto";

const VALID_USERNAME = "shidqifa";
const VALID_PASSWORD_HASH = createHash("sha256").update("kopsusren").digest("hex");

export default async (req: Request) => {
  if (req.method !== "POST") {
    return new Response("Method not allowed", { status: 405 });
  }

  let body: { username?: string; password?: string };
  try {
    body = await req.json();
  } catch {
    return Response.json({ ok: false, error: "Invalid request" }, { status: 400 });
  }

  const { username = "", password = "" } = body;
  const inputHash = createHash("sha256").update(password).digest("hex");

  if (username === VALID_USERNAME && inputHash === VALID_PASSWORD_HASH) {
    const token = createHash("sha256")
      .update(username + Date.now().toString() + Math.random().toString())
      .digest("hex");
    return Response.json({ ok: true, token });
  }

  return Response.json(
    { ok: false, error: "Username atau password salah" },
    { status: 401 }
  );
};

export const config: Config = {
  path: "/api/auth",
};
