import { cleanText } from "@/services/normalizer/clean-text";

export function normalizeEmail(value: string | null | undefined) {
  const cleaned = cleanText(value)?.toLowerCase() ?? null;
  if (!cleaned) return null;

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleaned) ? cleaned : null;
}
