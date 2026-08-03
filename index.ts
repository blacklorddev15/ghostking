import "dotenv/config";
import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { ENV } from "./env";
import { upsertUser, getUserByOpenId, getOrCreateWallet } from "./db";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cookieParser());
app.use(express.json());

// Simple Username-based Auth Middleware
app.use(async (req, res, next) => {
  const username = req.cookies.session; // We store the username in the cookie
  if (username) {
    let user = await getUserByOpenId(username);
    if (!user) {
      // Auto-create user if they don't exist
      const role = username === ENV.ownerOpenId ? "admin" : "user";
      await upsertUser({ openId: username, name: username, role: role });
      user = await getUserByOpenId(username);
    }
    if (user) await getOrCreateWallet(user.id);
    (req as any).user = user;
  }
  next();
});

// Login endpoint for simple username
app.post("/api/login", async (req, res) => {
  const { username } = req.body;
  if (!username) return res.status(400).json({ error: "Username required" });
  
  // Set cookie for 30 days
  res.cookie("session", username, { maxAge: 30 * 24 * 60 * 60 * 1000, path: "/" });
  res.json({ success: true });
});

app.use(
  "/api/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: ({ req, res }) => ({ user: (req as any).user, req, res }),
  })
);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "dist")));
  app.get("*", (req, res) => res.sendFile(path.join(__dirname, "dist", "index.html")));
}

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
