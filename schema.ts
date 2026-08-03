import { decimal, integer, pgEnum, pgTable, text, timestamp, varchar, serial } from "drizzle-orm/pg-core";

// ============================================
// ENUMS
// ============================================
export const roleEnum = pgEnum("role", ["user", "admin"]);
export const typeEnum = pgEnum("type", ["deposit", "withdrawal", "purchase"]);
export const statusEnum = pgEnum("status", ["pending", "completed", "failed", "active", "suspended", "cancelled"]);
export const categoryEnum = pgEnum("category", ["panel", "bot", "addon"]);

// ============================================
// USERS TABLE
// ============================================
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  openId: varchar("open_id", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  password: varchar("password", { length: 255 }),
  loginMethod: varchar("login_method", { length: 64 }),
  role: roleEnum("role").default("user").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  lastSignedIn: timestamp("last_signed_in").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

// ============================================
// WALLETS TABLE
// ============================================
export const wallets = pgTable("wallets", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  balance: decimal("balance", { precision: 15, scale: 2 }).default("0.00").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Wallet = typeof wallets.$inferSelect;
export type InsertWallet = typeof wallets.$inferInsert;

// ============================================
// TRANSACTIONS TABLE
// ============================================
export const transactions = pgTable("transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  type: typeEnum("type").notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  paymentMethod: varchar("payment_method", { length: 50 }),
  status: statusEnum("status").default("pending").notNull(),
  reference: varchar("reference", { length: 255 }),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Transaction = typeof transactions.$inferSelect;
export type InsertTransaction = typeof transactions.$inferInsert;

// ============================================
// PRODUCTS TABLE
// ============================================
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  category: categoryEnum("category").notNull(),
  price: decimal("price", { precision: 15, scale: 2 }).notNull(),
  billingCycle: varchar("billing_cycle", { length: 50 }).default("monthly"),
  features: text("features"),
  active: integer("active").default(1),
  
  // Pterodactyl specific fields
  eggId: integer("egg_id"),
  nestId: integer("nest_id"),
  locationId: integer("location_id"),
  memory: integer("memory"),
  swap: integer("swap").default(0),
  disk: integer("disk"),
  cpu: integer("cpu").default(100),
  io: integer("io").default(500),
  databases: integer("databases").default(0),
  backups: integer("backups").default(0),
  allocations: integer("allocations").default(1),
  
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Product = typeof products.$inferSelect;
export type InsertProduct = typeof products.$inferInsert;

// ============================================
// SETTINGS TABLE
// ============================================
export const settings = pgTable("settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 255 }).notNull().unique(),
  value: text("value").notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Setting = typeof settings.$inferSelect;
export type InsertSetting = typeof settings.$inferInsert;

// ============================================
// ORDERS TABLE
// ============================================
export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  productId: integer("product_id").notNull(),
  quantity: integer("quantity").default(1),
  totalPrice: decimal("total_price", { precision: 15, scale: 2 }).notNull(),
  status: statusEnum("status").default("pending").notNull(),
  serviceId: varchar("service_id", { length: 255 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export type Order = typeof orders.$inferSelect;
export type InsertOrder = typeof orders.$inferInsert;