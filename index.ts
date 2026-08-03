import "dotenv/config";
import express from "express";
import * as trpcExpress from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { ENV } from "./env";
import { 
  upsertUser, 
  getUserByOpenId, 
  getOrCreateWallet, 
  getUserByEmail, 
  getUserByUsername, 
  createUser, 
  hashPassword, 
  verifyPassword,
  getActiveProducts
} from "./db";
import cookieParser from "cookie-parser";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

// ============================================
// MIDDLEWARE
// ============================================
app.use(cookieParser());
app.use(express.json());

// CORS for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// ============================================
// AUTH MIDDLEWARE
// ============================================
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

// ============================================
// HEALTH CHECK - Test if server is running
// ============================================
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "Server is running" });
});

// ============================================
// REGISTER ENDPOINT
// ============================================
app.post("/api/register", async (req, res) => {
  const { username, email, password, name } = req.body;
  
  console.log("📝 Registration attempt:", { username, email, name });

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
      res.json({ 
        success: true, 
        user: { 
          id: user.id, 
          username: user.openId, 
          email: user.email, 
          name: user.name 
        } 
      });
    } else {
      res.status(500).json({ error: "Failed to create user" });
    }
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

// ============================================
// LOGIN ENDPOINT
// ============================================
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  
  console.log("🔑 Login attempt:", { username });

  if (!username || !password) {
    return res.status(400).json({ error: "Username and password required" });
  }

  try {
    // Find user by username or email
    let user = await getUserByUsername(username);
    if (!user) {
      user = await getUserByEmail(username);
    }

    if (!user) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Verify password
    if (!user.password || !verifyPassword(password, user.password)) {
      return res.status(401).json({ error: "Invalid username or password" });
    }

    // Set session cookie
    res.cookie("session", user.openId, { 
      maxAge: 30 * 24 * 60 * 60 * 1000, 
      path: "/",
      httpOnly: false,
    });

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
    res.status(500).json({ error: "Login failed" });
  }
});

// ============================================
// LOGOUT ENDPOINT
// ============================================
app.post("/api/logout", (req, res) => {
  res.clearCookie("session");
  res.json({ success: true });
});

// ============================================
// TEST PRODUCTS ENDPOINT - For debugging
// ============================================
app.get("/api/test-products", async (req, res) => {
  try {
    const products = await getActiveProducts();
    res.json({ success: true, products });
  } catch (error) {
    console.error("Test products error:", error);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ============================================
// TRPC ENDPOINT
// ============================================
app.use(
  "/api/trpc",
  trpcExpress.createExpressMiddleware({
    router: appRouter,
    createContext: ({ req, res }) => ({ 
      user: (req as any).user, 
      req, 
      res 
    }),
    onError: ({ error, req }) => {
      console.error("❌ TRPC Error:", error.message);
      console.error("Path:", req.url);
    },
  })
);

// ============================================
// STATIC FILES (Production)
// ============================================
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "dist")));
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "dist", "index.html"));
  });
}

// ============================================
// START SERVER
// ============================================
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`\n🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}/api/trpc`);
  console.log(`🏥 Health check: http://localhost:${PORT}/api/health`);
  console.log(`📦 Test products: http://localhost:${PORT}/api/test-products\n`);
});