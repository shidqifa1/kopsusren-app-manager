/// <reference types="node" />
import { defineConfig } from "drizzle-kit";

export default defineConfig({
  schema: "./db/schema.ts",
  out: "./db/migrations", // Kita pindahin folder migration dari Netlify ke folder db biar rapi
  dialect: "postgresql",   // Kita ubah dialect-nya ke postgresql murni
  dbCredentials: {
    url: process.env.DATABASE_URL || "",
  },
});