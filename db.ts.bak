import { eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/node-postgres";
import pg from "pg";
import { users, wallets, transactions, products, orders, settings } from "./schema";
import type { InsertUser, InsertTransaction, InsertOrder } from "./schema";
import { ENV } from './env';
import crypto from 'crypto';

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

export const db = drizzle(pool);

export async function getDb() {
  return db;
}

// Hash password
export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Verify password
export function verifyPassword(password: string, hash: string): boolean {
  return hashPassword(password) === hash;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) throw new Error("User openId is required for upsert");
  try {
    await db.insert(users).values(user).onConflictDoUpdate({
      target: users.openId,
      set: {
        name: user.name,
        email: user.email,
        password: user.password,
        loginMethod: user.loginMethod,
        lastSignedIn: new Date(),
        role: user.openId === ENV.ownerOpenId ? 'admin' : user.role
      }
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
  }
}

export async function createUser(user: InsertUser): Promise<void> {
  await db.insert(users).values({
    ...user,
    password: user.password ? hashPassword(user.password) : undefined,
  });
}

export async function getUserByOpenId(openId: string) {
  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByEmail(email: string) {
  const result = await db.select().from(users).where(eq(users.email, email)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserByUsername(username: string) {
  const result = await db.select().from(users).where(eq(users.openId, username)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getUserById(id: number) {
  const result = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return result.length > 0 ? result[0] : undefined;
}

export async function getOrCreateWallet(userId: number) {
  const existing = await db.select().from(wallets).where(eq(wallets.userId, userId)).limit(1);
  if (existing.length > 0) return existing[0];
  await db.insert(wallets).values({ userId, balance: "0.00" });
  const created = await db.select().from(wallets).where(eq(wallets.userId, userId)).limit(1);
  return created[0];
}

export async function getWalletBalance(userId: number) {
  const wallet = await db.select().from(wallets).where(eq(wallets.userId, userId)).limit(1);
  return wallet.length > 0 ? wallet[0].balance : "0.00";
}

export async function updateWalletBalance(userId: number, newBalance: string) {
  await db.update(wallets).set({ balance: newBalance }).where(eq(wallets.userId, userId));
}

export async function createTransaction(data: InsertTransaction) {
  await db.insert(transactions).values(data);
}

export async function getTransactionHistory(userId: number, limit: number = 50) {
  return await db.select().from(transactions).where(eq(transactions.userId, userId)).limit(limit);
}

export async function getActiveProducts() {
  return await db.select().from(products).where(eq(products.active, 1));
}

export async function getProductById(id: number) {
  const result = await db.select().from(products).where(eq(products.id, id)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updateProduct(id: number, data: any) {
  await db.update(products).set(data).where(eq(products.id, id));
}

export async function getAllProducts() {
  return await db.select().from(products);
}

export async function createOrder(data: InsertOrder) {
  await db.insert(orders).values(data);
}

export async function getUserOrders(userId: number) {
  return await db.select().from(orders).where(eq(orders.userId, userId));
}

export async function getAllUsers() {
  return await db.select().from(users);
}

export async function getAllTransactions() {
  return await db.select().from(transactions);
}

export async function getAllOrders() {
  return await db.select().from(orders);
}

export async function getSettings() {
  return await db.select().from(settings);
}

export async function getSetting(key: string) {
  const result = await db.select().from(settings).where(eq(settings.key, key)).limit(1);
  return result.length > 0 ? result[0].value : null;
}

export async function updateSetting(key: string, value: string) {
  await db.insert(settings).values({ key, value }).onConflictDoUpdate({
    target: settings.key,
    set: { value }
  });
}