import { drizzle, type NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";

// Lazy singleton so importing this module never opens a connection at build
// time (e.g. during `next build` when DATABASE_URL may be absent).
let _db: NodePgDatabase<typeof schema> | undefined;

const globalForDb = globalThis as unknown as { __languagablePool?: Pool };

/** SSL config: off for local Postgres, on (lenient) for cloud hosts like Neon. */
function sslFor(url: string): false | { rejectUnauthorized: boolean } {
  try {
    const host = new URL(url).hostname;
    if (host === "localhost" || host === "127.0.0.1" || host === "::1") {
      return false;
    }
  } catch {
    // fall through to SSL on for anything we can't parse
  }
  // Neon/Supabase/etc. present valid certs; rejectUnauthorized:false avoids the
  // common "self-signed certificate in chain" failure without extra config.
  return { rejectUnauthorized: false };
}

// Drop sslmode/channel_binding from the URL: we pass an explicit `ssl` option,
// and leaving them in makes node-postgres emit a noisy deprecation warning.
function cleanUrl(url: string): string {
  try {
    const u = new URL(url);
    u.searchParams.delete("sslmode");
    u.searchParams.delete("channel_binding");
    return u.toString();
  } catch {
    return url;
  }
}

export function getDb(): NodePgDatabase<typeof schema> {
  if (_db) return _db;

  const url = process.env.DATABASE_URL;
  if (!url) {
    throw new Error(
      "DATABASE_URL is not set. Copy .env.example to .env.local and fill it in.",
    );
  }

  // Reuse one pool across hot reloads in dev.
  const pool =
    globalForDb.__languagablePool ??
    new Pool({
      connectionString: cleanUrl(url),
      ssl: sslFor(url),
      max: 10,
      idleTimeoutMillis: 30_000,
      connectionTimeoutMillis: 10_000,
    });
  if (process.env.NODE_ENV !== "production") {
    globalForDb.__languagablePool = pool;
  }

  _db = drizzle(pool, { schema });
  return _db;
}
