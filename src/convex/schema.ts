import { authTables } from "@convex-dev/auth/server";
import { defineSchema, defineTable } from "convex/server";
import { Infer, v } from "convex/values";

// default user roles. can add / remove based on the project as needed
export const ROLES = {
  ADMIN: "admin",
  USER: "user",
  MEMBER: "member",
} as const;

export const roleValidator = v.union(
  v.literal(ROLES.ADMIN),
  v.literal(ROLES.USER),
  v.literal(ROLES.MEMBER),
);
export type Role = Infer<typeof roleValidator>;

export const SESSION_STATUSES = [
  "orcamento",
  "agendada",
  "realizada",
  "cancelada",
] as const;

export const sessionStatusValidator = v.union(
  ...SESSION_STATUSES.map((s) => v.literal(s)),
);

export type SessionStatus = Infer<typeof sessionStatusValidator>;

const schema = defineSchema(
  {
    // default auth tables using convex auth.
    ...authTables, // do not remove or modify

    // the users table is the default users table that is brought in by the authTables
    users: defineTable({
      name: v.optional(v.string()), // name of the user. do not remove
      image: v.optional(v.string()), // image of the user. do not remove
      email: v.optional(v.string()), // email of the user. do not remove
      emailVerificationTime: v.optional(v.number()), // email verification time. do not remove
      // Phone fields are declared by @convex-dev/auth's own users table. The
      // template dropped them, which is harmless while schemaValidation is off
      // but makes any user document carrying them unreadable once it is on.
      phone: v.optional(v.string()),
      phoneVerificationTime: v.optional(v.number()),
      isAnonymous: v.optional(v.boolean()), // legacy users
      termsAcceptedAt: v.optional(v.number()),
      termsVersion: v.optional(v.string()),

      // Deliberately a plain string, not roleValidator: nothing in this app
      // writes `role`, so the only writer is the platform. With schema
      // validation on, a platform value outside admin|user|member would make
      // every read of `users` throw — and with it, sign-in. ROLES/roleValidator
      // stay exported as the intended vocabulary for app code that needs it.
      role: v.optional(v.string()), // role of the user. do not remove
    })
      .index("email", ["email"]) // index for the email. do not remove or modify
      .index("phone", ["phone"]),

    manualAuthCodes: defineTable({
      email: v.string(),
      token: v.string(),
      createdAt: v.number(),
      expiresAt: v.number(),
    }).index("by_email", ["email"]).index("by_expires", ["expiresAt"]),

    // Google Calendar OAuth tokens (one connected account per photographer).
    googleTokens: defineTable({
      userId: v.id("users"),
      accessToken: v.string(),
      refreshToken: v.optional(v.string()),
      expiresAt: v.number(), // access token expiry (ms)
      calendarId: v.optional(v.string()), // user-selected target calendar
      reminderMinutes: v.optional(v.number()), // Google pop-up alert before each session

      // Fuso IANA escolhido para os eventos do Google Calendar.
      timeZone: v.optional(v.string()),

      connectedAt: v.number(),
    }).index("by_user", ["userId"]),

    // Short-lived state values for the OAuth CSRF check (bound to the user
    // that started the flow, since Google's redirect carries no session).
    // by_user lets startConnect keep a single in-flight state per user, so the
    // table cannot be flooded by repeated calls.
    googleAuthStates: defineTable({
      state: v.string(),
      userId: v.id("users"),
      createdAt: v.number(),
    })
      .index("by_state", ["state"])
      .index("by_user", ["userId"]),

    // Fixed-window send counters for the OTP email provider (see
    // convex/otpRateLimit.ts). Keys are `email:<addr>` and `global`.
    otpSendRateLimits: defineTable({
      key: v.string(),
      windowStart: v.number(),
      count: v.number(),
    })
      .index("by_key", ["key"])
      .index("by_window", ["windowStart"]),

    // Who changed what, written in the same transaction as the change.
    auditLogs: defineTable({
      userId: v.id("users"),
      action: v.string(), // e.g. "client.create", "session.delete"
      entity: v.string(), // "clients" | "sessions"
      entityId: v.string(),
      summary: v.optional(v.string()), // name/title at time of change
      at: v.number(),
    }).index("by_user", ["userId"]),

    clients: defineTable({
      userId: v.id("users"),
      name: v.string(),
      email: v.optional(v.string()),
      phone: v.optional(v.string()),
      notes: v.optional(v.string()),
      createdAt: v.number(),
    }).index("by_user", ["userId"]),

    sessions: defineTable({
      userId: v.id("users"),
      clientId: v.id("clients"),
      title: v.string(),
      type: v.optional(v.string()),
      date: v.number(), // timestamp (ms)
      time: v.optional(v.string()), // "HH:mm"
      location: v.optional(v.string()),
      price: v.number(),
      paid: v.number(),
      status: sessionStatusValidator,
      notes: v.optional(v.string()),
      googleEventId: v.optional(v.string()), // linked Google Calendar event
      notifyClient: v.optional(v.boolean()), // flag to alert the client about this session
      createdAt: v.number(),
    })
      .index("by_user", ["userId"])
      .index("by_client", ["clientId"]),
  },
  {
    schemaValidation: true,
  },
);

export default schema;
