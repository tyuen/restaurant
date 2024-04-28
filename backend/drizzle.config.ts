var path = require("node:path");
var dotenv = require("dotenv");

dotenv.config({
  path: path.join(__dirname, "../.env"),
});
dotenv.config({
  path: path.join(__dirname, "../../.env"),
});

/** @satisfies {import("drizzle-kit").Config} */
var config = {
  schema: "./src/schema.ts",
  out: "./drizzle",
  driver: "pg",
  dbCredentials: {
    host: process.env.DB_HOST,
    port: 5432,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: false,
  },
  verbose: true,
  strict: true,
};
export default config;
