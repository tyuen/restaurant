import express, { type Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import path from "node:path";
import cors from "cors";
import morgan from "morgan";
import bodyParser from "body-parser";

import errorHandler from "./middleware/errorHandler";
import corsPostOnly from "./middleware/corsPostOnly";
import addResponseHeaders from "./middleware/responseHeaders";
import checkSessionCookie from "./middleware/checkSessionCookie";
import cookieSession from "cookie-session";

import { router } from "./routes/router";

dotenv.config({
  path: path.join(__dirname, "../.env"),
});
dotenv.config({
  path: path.join(__dirname, "../../.env"),
  debug: true,
});

const app = express();

app.use(addResponseHeaders);
app.use(corsPostOnly);
app.use(checkSessionCookie);

app.use(bodyParser.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

app.use(
  cookieSession({
    secret: process.env.COOKIE_SESSION_KEY!,
  }),
);
app.use(cors());
app.set("trust proxy", 1 /* number of proxies between user and server */);
app.use("/api", router);

app.use(errorHandler);

const server = app.listen(4000, () => {
  console.log(`Listening on ${JSON.stringify(server.address())}`);
});

const handleShutdown = () => {
  process.off("SIGINT", handleShutdown);
  process.off("SIGTERM", handleShutdown);

  console.log("Signal received. Shutting down...");

  server.close(err => {
    console.log(err ? err.message : "App stopped.");
    process.exit(err ? 1 : 0);
  });
  setTimeout(() => {
    console.log("Manual exit");
    process.exit(1);
  }, 8000);
};
process.on("SIGINT", handleShutdown);
process.on("SIGTERM", handleShutdown);
