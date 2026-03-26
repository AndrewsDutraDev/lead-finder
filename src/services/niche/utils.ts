export function normalizeNicheText(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function uniqueTerms(terms: Array<string | null | undefined>) {
  const seen = new Set<string>();

  return terms
    .map((term) => normalizeNicheText(term ?? ""))
    .filter(Boolean)
    .filter((term) => {
      if (seen.has(term)) {
        return false;
      }

      seen.add(term);
      return true;
    });
}
