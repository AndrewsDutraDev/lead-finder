import { cleanText } from "@/services/normalizer/clean-text";

export function normalizeAddress(value: string | null | undefined) {
  const cleaned = cleanText(value);
  return cleaned?.replace(/\s+,/g, ",") ?? null;
}
