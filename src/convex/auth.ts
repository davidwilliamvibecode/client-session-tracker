import { convexAuth } from "@convex-dev/auth/server";
import { assistedVerification } from "./manualVerification";
import { Password } from "@convex-dev/auth/providers/Password";

// Fotoflow is independent of Freebuff. Passwords are hashed by Convex Auth.
export const { auth, signIn, signOut, store, isAuthenticated } = convexAuth({
  providers: [Password({
    verify: assistedVerification,
    profile(params) {
      const email = String(params.email ?? "").trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254) {
        throw new Error("Informe um e-mail válido.");
      }
      if (params.flow === "signUp") {
        if (params.acceptedTerms !== "true") throw new Error("Aceite dos termos obrigatório.");
      }
      // The profile is persisted on signUp; on signIn these fields are ignored.
      return { email, termsAcceptedAt: Date.now(), termsVersion: "2026-10" };
    },
    validatePasswordRequirements(password) {
      if (password.length < 8 || password.length > 128) {
        throw new Error("Use uma senha de 8 a 128 caracteres.");
      }
    },
  })],
});
