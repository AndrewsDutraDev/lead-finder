import { cleanText } from "@/services/normalizer/clean-text";

export function normalizePhone(phone: string | null | undefined) {
  const cleaned = cleanText(phone);
  if (!cleaned) return null;

  const digits = cleaned.replace(/\D/g, "");

  if (digits.length === 10) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  }

  if (digits.length === 11) {
    return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
  }

  if (digits.length === 12 && digits.startsWith("55")) {
    const national = digits.slice(2);
    return normalizePhone(national);
  }

  return cleaned;
}
