import { z } from "zod";

/**
 * Shared, production-grade input validation.
 *
 * These schemas are UX-level guards only. Every rule enforced here is also
 * enforced in the database (CHECK constraints, RLS policies, SECURITY DEFINER
 * RPCs) — the browser is never the authority.
 */

/* ------------------------------ passwords ------------------------------ */

export const PASSWORD_RULES =
  "At least 10 characters, with an uppercase letter, a lowercase letter and a number.";

export const passwordSchema = z
  .string()
  .min(10, "Use at least 10 characters")
  .max(72, "Too long")
  .regex(/[a-z]/, "Add a lowercase letter")
  .regex(/[A-Z]/, "Add an uppercase letter")
  .regex(/[0-9]/, "Add a number");

/** 0-4 strength score for the meter in the signup UI. */
export function passwordStrength(value: string): number {
  let score = 0;
  if (value.length >= 10) score += 1;
  if (value.length >= 14) score += 1;
  if (/[a-z]/.test(value) && /[A-Z]/.test(value)) score += 1;
  if (/[0-9]/.test(value) && /[^A-Za-z0-9]/.test(value)) score += 1;
  return Math.min(4, score);
}

/* -------------------------------- text --------------------------------- */

export const nameSchema = z.string().trim().min(2, "Too short").max(120);
export const emailSchema = z.string().trim().toLowerCase().email("Enter a valid email").max(255);
export const phoneSchema = z
  .string()
  .trim()
  .max(30)
  .regex(/^[0-9+()\-\s]*$/, "Digits and + - ( ) only");

/* --------------------------------- URLs -------------------------------- */

const SAFE_PROTOCOLS = new Set(["http:", "https:"]);

/** Rejects javascript:, data:, vbscript: and other non-web schemes. */
export function isSafeHttpUrl(value: string): boolean {
  try {
    const url = new URL(value.trim());
    return SAFE_PROTOCOLS.has(url.protocol);
  } catch {
    return false;
  }
}

export const safeUrlSchema = z
  .string()
  .trim()
  .max(1000)
  .refine((v) => v === "" || isSafeHttpUrl(v), "Enter a valid http(s) URL");

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "www.youtube.com",
  "m.youtube.com",
  "youtu.be",
  "www.youtu.be",
]);

/** Returns the 11-char video id for a trusted YouTube URL, else null. */
export function parseYouTubeId(value: string): string | null {
  try {
    const url = new URL(value.trim());
    if (!SAFE_PROTOCOLS.has(url.protocol)) return null;
    if (!YOUTUBE_HOSTS.has(url.hostname)) return null;
    const id =
      url.hostname.endsWith("youtu.be")
        ? url.pathname.slice(1)
        : (url.searchParams.get("v") ?? url.pathname.split("/").pop() ?? "");
    return /^[A-Za-z0-9_-]{11}$/.test(id) ? id : null;
  } catch {
    return null;
  }
}

export const youtubeUrlSchema = z
  .string()
  .trim()
  .max(500)
  .refine((v) => v === "" || parseYouTubeId(v) !== null, "Enter a valid YouTube link");

/* ------------------------------- numbers -------------------------------- */

export const moneySchema = (max = 1_000_000) =>
  z.coerce.number().finite().min(0, "Cannot be negative").max(max, "Too large");

export const seatCountSchema = z.coerce
  .number()
  .int("Whole seats only")
  .min(1, "At least 1 seat")
  .max(10, "Maximum 10 seats per booking");

export const contributionAmountSchema = z.coerce
  .number()
  .finite()
  .min(50, "Minimum contribution is 50")
  .max(1_000_000, "Maximum contribution is 1,000,000");

/* --------------------------------- ids ---------------------------------- */

export const uuidSchema = z.string().uuid("Invalid identifier");
