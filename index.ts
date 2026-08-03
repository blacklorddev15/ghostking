import "dotenv/config";
import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { ENV } from "./env";
import { upsertUser, getUserByOpenId, getOrCreateWallet, getUserByEmail, getUserByUsername, createUser, hashPassword, verifyPassword } from "./db";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(cookieParser());
app.use(express.json());

// Auth middleware
app.use(async (req, res, next) => {
  const sessionData = req.cookies.session;
  if (sessionData) {
    try {
      const user = await getUserByOpenId(sessionData);
      if (user) {
        await getOrCreateWallet(user.id);
        (req as any).user = user;
      }
    } catch (error) {
      console.error("Auth middleware error:", error);
    }
  }
  next();
});

// REGISTER endpoint
app.post("/api/register", async (req, res) => {
  const { username, email, password, name } = req.body;
  
  console.log("Registration attempt:", { username, email, name });

  if (!username || !email || !password) {
    return res.status(400).json({ error: "Username, email, and password required" });
  }

  // Check if user exists
  const existingUser = await getUserByUsername(username);
  if (existingUser) {
    return res.status(400).json({ error: "Username already taken" });
  }

  const existingEmail = await getUserByEmail(email);
  if (existingEmail) {
    return res.status(400).json({ error: "Email already registered" });
  }

  try {
    // Create user with hashed password
    await createUser({
      openId: username,
      name: name || username,
      email: email,
      password: password,
      loginMethod: "password",
      role: "user",
    });

    const user = await getUserByUsername(username);
    if (user) {
      await getOrCreateWallet(user.id);
      // Set session cookie
      res.cookie("session", username, { 
        maxAge: 30 * 24 * 60 * 60 * 1000, 
        path: "/",
        httpOnly: false,
      });
      res.json({ success: true, user: { id: user.id, username: user.openId, email: user.email, name: user.name } });
    } else {
      res.status(500).json({ error: "Failed to create user" });
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// LOGIN endpoint with password - FIXED
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  
  console.log("Login attempt - Username:", username);
  console.log("Login attempt - Password received:", password ? "Yes (length: " + password.length + ")" : "No");

  if (!username || !password) {
    console.log("Missing username or password");
    return res.status(400).json({ error: "Username and password required" });
  }

  try {
    // Find user by username or email
    let user = await getUserByUsername(username);
    if (!user) {
      user = await getUserByEmail(username);
    }

    if (!user) {
      console.log("User not found:", username);
      return res.status(401).json({ error: "Invalid username or password" });
    }

    console.log("User found:", user.openId);
    console.log("Stored password hash:", user.password ? "Yes" : "No");
    console.log("Password match:", user.password ? verifyPassword(password, user.password) : false);

    // Verify password
    if (!user.password || !verifyPassword(password, user.password)) {
      console.log("Password verification failed");
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Set session cookie
    res.cookie("session", user.openId, { 
      maxAge: 30 * 24 * 60 * 60 * 1000, 
      path: "/",
      httpOnly: false,
    });

    console.log("Login successful for:", user.openId);

    res.json({ 
      success: true, 
      user: { 
        id: user.id, 
        username: user.openId, 
        email: user.email, 
        name: user.name,
        role: user.role 
      } 
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Login failed: " + (error as Error).message });
  }
});

// LOGOUT endpoint
app.post("/api/logout", (req, res) => {
  res.clearCookie("session");
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