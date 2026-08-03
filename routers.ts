import { publicProcedure, router, protectedProcedure } from "./trpc";
import { z } from "zod";
import { 
  getOrCreateWallet, getWalletBalance, updateWalletBalance, createTransaction, 
  getTransactionHistory, getActiveProducts, getProductById, createOrder, 
  getUserOrders, getAllUsers, getAllTransactions, getAllOrders, 
  getSettings, getSetting, updateSetting, getAllProducts, updateProduct,
  getUserById
} from "./db";
import { TRPCError } from "@trpc/server";
import axios from "axios";

export const appRouter = router({
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      ctx.res.clearCookie("session", { path: "/", maxAge: -1 });
      return { success: true } as const;
    }),
  }),

  wallet: router({
    getBalance: protectedProcedure.query(async ({ ctx }) => {
      const balance = await getWalletBalance(ctx.user.id);
      return { balance };
    }),
    getHistory: protectedProcedure.query(async ({ ctx }) => {
      const transactions = await getTransactionHistory(ctx.user.id);
      return { transactions };
    }),
    deposit: protectedProcedure
      .input(z.object({
        amount: z.string(),
        paymentMethod: z.enum(["paystack", "mpesa", "pesapal"]),
        reference: z.string().optional(),
      }))
      .mutation(async ({ ctx, input }) => {
        await createTransaction({
          userId: ctx.user.id,
          type: "deposit",
          amount: input.amount as any,
          paymentMethod: input.paymentMethod,
          status: "pending",
          reference: input.reference,
          description: `Deposit via ${input.paymentMethod}`,
        });
        return { success: true, message: "Deposit initiated" };
      }),
    confirmDeposit: protectedProcedure
      .input(z.object({
        reference: z.string(),
        amount: z.string(),
      }))
      .mutation(async ({ ctx, input }) => {
        const conversionRate = parseFloat(await getSetting("conversion_rate") || "5");
        const amountInSD = (parseFloat(input.amount) / conversionRate).toFixed(2);
        const currentBalance = await getWalletBalance(ctx.user.id);
        const newBalance = (parseFloat(currentBalance) + parseFloat(amountInSD)).toFixed(2);
        await updateWalletBalance(ctx.user.id, newBalance);
        
        const { db } = await import("./db");
        const { transactions } = await import("./schema");
        const { eq } = await import("drizzle-orm");
        await db.update(transactions).set({ status: "completed", description: `Converted to ${amountInSD} SD` }).where(eq(transactions.reference, input.reference as string));
        
        return { success: true, newBalance };
      }),
  }),

  products: router({
    list: publicProcedure.query(async () => {
      const products = await getActiveProducts();
      return { products };
    }),
    getById: publicProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        const product = await getProductById(input.id);
        if (!product) throw new TRPCError({ code: "NOT_FOUND" });
        return { product };
      }),
  }),

  orders: router({
    create: protectedProcedure
      .input(z.object({
        productId: z.number(),
        quantity: z.number().default(1),
      }))
      .mutation(async ({ ctx, input }) => {
        const product = await getProductById(input.productId);
        if (!product) throw new TRPCError({ code: "NOT_FOUND" });
        
        const totalPrice = (parseFloat(product.price as any) * input.quantity).toFixed(2);
        const balance = await getWalletBalance(ctx.user.id);
        
        // Check if user has enough balance
        if (parseFloat(balance) < parseFloat(totalPrice)) {
          throw new TRPCError({ 
            code: "BAD_REQUEST", 
            message: `Insufficient balance. You need ${totalPrice} SD but have ${balance} SD` 
          });
        }

        let serviceId = null;
        let pteroDetails = null;

        // Create Pterodactyl server for panel products
        if (product.category === "panel" && product.eggId) {
          const pteroUrl = await getSetting("pterodactyl_url");
          const pteroKey = await getSetting("pterodactyl_api_key");
          
          if (pteroUrl && pteroKey) {
            try {
              const pteroClient = axios.create({
                baseURL: pteroUrl,
                headers: { 
                  'Authorization': `Bearer ${pteroKey}`, 
                  'Content-Type': 'application/json', 
                  'Accept': 'Application/vnd.pterodactyl.v1+json'
                }
              });

              // Get or create Pterodactyl user
              let pteroUser;
              const userEmail = ctx.user.email || `${ctx.user.openId}@ghostking.com`;
              
              try {
                const usersRes = await pteroClient.get(`/api/application/users?filter[email]=${userEmail}`);
                if (usersRes.data.data.length > 0) {
                  pteroUser = usersRes.data.data[0].attributes;
                }
              } catch (e) {
                console.log("User not found, creating new...");
              }

              if (!pteroUser) {
                const newUserRes = await pteroClient.post('/api/application/users', {
                  email: userEmail,
                  username: `user_${ctx.user.id}`,
                  first_name: ctx.user.name || "Client",
                  last_name: "GhostKing",
                });
                pteroUser = newUserRes.data.attributes;
              }

              // Create the server
              const serverRes = await pteroClient.post('/api/application/servers', {
                name: `${product.name} - ${ctx.user.name || ctx.user.openId}`,
                user: pteroUser.id,
                egg: product.eggId,
                nest: product.nestId || 1,
                pack: 0,
                docker_image: "ghcr.io/pterodactyl/yolks:debian",
                startup: "java -Xms128M -Xmx{{SERVER_MEMORY}}M -jar {{SERVER_JARFILE}}",
                limits: { 
                  memory: product.memory || 1024, 
                  swap: 0, 
                  disk: product.disk || 5120, 
                  io: 500, 
                  cpu: product.cpu || 100 
                },
                feature_limits: { 
                  databases: product.databases || 0, 
                  backups: product.backups || 0, 
                  allocations: product.allocations || 1 
                },
                deploy: { 
                  locations: [product.locationId || 1], 
                  dedicated_ip: false, 
                  port_range: [] 
                },
                environment: { 
                  SERVER_JARFILE: "server.jar",
                  VERSION: "latest"
                },
                start_on_completion: true,
              });

              serviceId = serverRes.data.attributes.uuid;
              pteroDetails = {
                id: serverRes.data.attributes.id,
                uuid: serverRes.data.attributes.uuid,
                name: serverRes.data.attributes.name,
                status: serverRes.data.attributes.status,
              };

              console.log("✅ Pterodactyl server created:", pteroDetails);

            } catch (err: any) {
              console.error("❌ Pterodactyl Error:", err.response?.data || err.message);
              // Still create order but mark as pending
              serviceId = null;
            }
          } else {
            console.warn("⚠️ Pterodactyl not configured - panel will be pending");
          }
        }

        // Deduct balance
        const newBalance = (parseFloat(balance) - parseFloat(totalPrice)).toFixed(2);
        await updateWalletBalance(ctx.user.id, newBalance);

        // Create order
        const orderResult = await createOrder({
          userId: ctx.user.id,
          productId: input.productId,
          quantity: input.quantity,
          totalPrice: totalPrice as any,
          status: serviceId ? "active" : "pending",
          serviceId: serviceId,
        });

        // Create transaction
        await createTransaction({
          userId: ctx.user.id,
          type: "purchase",
          amount: totalPrice as any,
          status: "completed",
          description: `Purchase: ${product.name}${serviceId ? ' (Deployed)' : ' (Pending)'}`,
        });

        return { 
          success: true, 
          newBalance,
          serviceId,
          pteroDetails,
          message: serviceId ? "Panel deployed successfully!" : "Order created, pending deployment"
        };
      }),
    list: protectedProcedure.query(async ({ ctx }) => {
      const orders = await getUserOrders(ctx.user.id);
      return { orders };
    }),
  }),

  admin: router({
    users: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return await getAllUsers();
    }),
    transactions: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return await getAllTransactions();
    }),
    orders: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return await getAllOrders();
    }),
    settings: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return await getSettings();
    }),
    updateSetting: protectedProcedure
      .input(z.object({ key: z.string(), value: z.string() }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        await updateSetting(input.key, input.value);
        return { success: true };
      }),
    products: protectedProcedure.query(async ({ ctx }) => {
      if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
      return await getAllProducts();
    }),
    updateProduct: protectedProcedure
      .input(z.object({ id: z.number(), data: z.record(z.any()) }))
      .mutation(async ({ ctx, input }) => {
        if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
        await updateProduct(input.id, input.data);
        return { success: true };
      }),
  }),
});

export type AppRouter = typeof appRouter;