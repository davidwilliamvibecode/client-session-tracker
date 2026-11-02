import { Email } from "@convex-dev/auth/providers/Email";
import { makeFunctionReference, type GenericActionCtx } from "convex/server";
import { v } from "convex/values";
import { internalMutation, internalQuery } from "./_generated/server";
import type { DataModel } from "./_generated/dataModel";

const LIFETIME = 15 * 60_000;
const normalize = (email: string) => email.trim().toLowerCase();

// Available only to the operator in the Convex dashboard, never to public clients.
export const enqueue = internalMutation({
  args: { email: v.string(), token: v.string() },
  handler: async (ctx, { email, token }) => {
    email = normalize(email);
    if (!/^\d{8}$/.test(token)) throw new Error("Código inválido.");
    const now = Date.now();
    const key = `verification:${email}`;
    const counter = await ctx.db.query("otpSendRateLimits").withIndex("by_key", q => q.eq("key", key)).unique();
    if (counter && now - counter.windowStart < LIFETIME && counter.count >= 3) {
      throw new Error("Aguarde 15 minutos antes de solicitar outro código.");
    }
    if (counter) await ctx.db.patch(counter._id, now - counter.windowStart < LIFETIME
      ? { count: counter.count + 1 } : { count: 1, windowStart: now });
    else await ctx.db.insert("otpSendRateLimits", { key, count: 1, windowStart: now });
    const old = await ctx.db.query("manualAuthCodes").withIndex("by_email", q => q.eq("email", email)).collect();
    for (const row of old) await ctx.db.delete(row._id);
    const expired = await ctx.db.query("manualAuthCodes").withIndex("by_expires", q => q.lt("expiresAt", now)).take(50);
    for (const row of expired) await ctx.db.delete(row._id);
    await ctx.db.insert("manualAuthCodes", { email, token, createdAt: now, expiresAt: now + LIFETIME });
  },
});

export const pending = internalQuery({
  args: { email: v.string() },
  handler: async (ctx, { email }) => {
    const rows = await ctx.db.query("manualAuthCodes").withIndex("by_email", q => q.eq("email", normalize(email))).collect();
    return rows.filter(row => row.expiresAt > Date.now()).map(row => ({ token: row.token, expiresAt: row.expiresAt }));
  },
});

export const assistedVerification = Email({
  id: "fotoflow-password-verification",
  maxAge: 15 * 60,
  async generateVerificationToken() {
    let code = "";
    while (code.length < 8) {
      const bytes = crypto.getRandomValues(new Uint8Array(16));
      for (const byte of bytes) if (byte < 250 && code.length < 8) code += String(byte % 10);
    }
    return code;
  },
  async sendVerificationRequest({ identifier, token }, ...context: unknown[]) {
    const ctx = context[0] as GenericActionCtx<DataModel>;
    await ctx.runMutation(makeFunctionReference<"mutation">("manualVerification:enqueue"), { email: identifier, token });
  },
});
