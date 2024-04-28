import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import * as schema from "./schema";
export * from "./schema";

export const pgPool = new Pool({
  host: process.env.DB_HOST,
  port: 5432,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  // database: process.env.DB_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// pgPool.on("connect", (c) => console.log("PG connected"));
// pgPool.on("acquire", (c) => console.log("PG acquire"));
// pgPool.on("release", (c) => console.log("PG release"));
// pgPool.on("remove", (c) => console.log("PG remove"));
pgPool.on("error", err => console.log("PG error", err));

export const db = drizzle(pgPool, { schema });
