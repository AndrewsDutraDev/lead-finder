export function cleanText(value: string | null | undefined) {
  const cleaned = value?.replace(/\s+/g, " ").trim() ?? "";
  return cleaned.length > 0 ? cleaned : null;
}
