import type { ExpandedNiche } from "@/types/company";
import { nicheDictionary } from "@/services/niche/nicheDictionary";
import { normalizeNicheText, uniqueTerms } from "@/services/niche/utils";

function buildGenericVariants(normalizedNiche: string) {
  if (!normalizedNiche) {
    return [];
  }

  return [
    normalizedNiche,
    `empresa de ${normalizedNiche}`,
    `servicos de ${normalizedNiche}`,
    `consultoria em ${normalizedNiche}`
  ];
}

export function expandNiche(niche: string): ExpandedNiche {
  const normalized = normalizeNicheText(niche);

  const dictionaryEntry = Object.values(nicheDictionary).find((entry) =>
    entry.aliases.some((alias) => normalized.includes(normalizeNicheText(alias)))
  );

  const terms = uniqueTerms([
    normalized,
    ...(dictionaryEntry?.aliases ?? []),
    ...(dictionaryEntry?.relatedTerms ?? []),
    ...buildGenericVariants(normalized)
  ]);

  return {
    original: niche,
    normalized,
    terms
  };
}
