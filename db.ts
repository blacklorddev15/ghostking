import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { users, wallets, transactions, products, orders, settings } from "./schema";
import type { InsertUser, InsertTransaction, InsertOrder } from "./schema";
import { ENV } from './env';

let _db: ReturnType<typeof drizzle> | null = null;

export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  const db = await getDb();
  if (!db) return;
  try {
    const values: InsertUser = { openId: user.openId };
    const updateSet: Record<string, unknown> = {};
    const textFields = ["name", "email", "loginMethod"] as const;
    textFields.forEach(field => {
      const value = user[field];
      if (value !== undefined) {
        const normalized = value ?? null;
        values[field] = normalized as any;
        updateSet[field] = normalized;
      }
    });
    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }
    if (!values.lastSignedIn) values.lastSignedIn = new Date();
    if (Object.keys(updateSet).length === 0) updateSet.lastSignedIn = new Date();
    await db.insert(users).values(values).onDuplicateKeyUpdate({ set: updateSet });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const db = await getDb();
  if (!db) return undefined;
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getOrCreateWallet(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const existing = await db.select().from(wallets).where(eq(wallets.userId, userId)).limit(1);
  if (existing.length > 0) return existing[0];
  await db.insert(wallets).values({ userId, balance: "0.00" } as any);
  const created = await db.select().from(wallets).where(eq(wallets.userId, userId)).limit(1);
  return created[0];
}

export async function getWalletBalance(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const wallet = await db.select().from(wallets).where(eq(wallets.userId, userId)).limit(1);
  return wallet.length > 0 ? wallet[0].balance : "0.00";
}

export async function updateWalletBalance(userId: number, newBalance: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(wallets).set({ balance: newBalance as any }).where(eq(wallets.userId, userId));
}

export async function createTransaction(data: InsertTransaction) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(transactions).values(data);
}

export async function getTransactionHistory(userId: number, limit: number = 50) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(transactions).where(eq(transactions.userId, userId)).limit(limit);
}

export async function getActiveProducts() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(products).where(eq(products.active, 1));
}

export async function getProductById(id: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateProduct(id: number, data: any) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.update(products).set(data).where(eq(products.id, id));
}

export async function getAllProducts() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(products);
}

export async function createOrder(data: InsertOrder) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(orders).values(data);
}

export async function getUserOrders(userId: number) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(orders).where(eq(orders.userId, userId));
}

export async function getAllUsers() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(users);
}

export async function getAllTransactions() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(transactions);
}

export async function getAllOrders() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(orders);
}

export async function getSettings() {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  return await db.select().from(settings);
}

export async function getSetting(key: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  const result = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  return result.length > 0 ? result[0].value : null;
}

export async function updateSetting(key: string, value: string) {
  const db = await getDb();
  if (!db) throw new Error("Database not available");
  await db.insert(settings).values({ key, value }).onDuplicateKeyUpdate({ set: { value } });
}
