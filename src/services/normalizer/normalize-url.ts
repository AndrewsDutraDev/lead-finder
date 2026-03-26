import { cleanText } from "@/services/normalizer/clean-text";

export function normalizeUrl(value: string | null | undefined) {
  const cleaned = cleanText(value);
  if (!cleaned) return null;

  const withProtocol = /^https?:\/\//i.test(cleaned) ? cleaned : `https://${cleaned}`;

  try {
    const parsed = new URL(withProtocol);
    return parsed.toString().replace(/\/$/, "");
  } catch {
    return null;
  }
}
