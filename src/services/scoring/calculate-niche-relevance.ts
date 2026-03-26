import type { Company, ExpandedNiche } from "@/types/company";
import { normalizeNicheText } from "@/services/niche/utils";

function scoreTextMatch(text: string | null, terms: string[], weight: number) {
  if (!text) return 0;

  const normalizedText = normalizeNicheText(text);
  if (!normalizedText) return 0;

  let bestScore = 0;

  terms.forEach((term) => {
    if (normalizedText === term) {
      bestScore = Math.max(bestScore, weight);
      return;
    }

    if (normalizedText.includes(term)) {
      bestScore = Math.max(bestScore, Math.round(weight * 0.8));
      return;
    }

    const termTokens = term.split(" ").filter(Boolean);
    const matchedTokens = termTokens.filter((token) => normalizedText.includes(token)).length;

    if (termTokens.length > 0 && matchedTokens > 0) {
      const partialScore = Math.round((matchedTokens / termTokens.length) * (weight * 0.65));
      bestScore = Math.max(bestScore, partialScore);
    }
  });

  return bestScore;
}

export function calculateNicheRelevance(
  company: Pick<Company, "name" | "category" | "description" | "matchedSearchTerm">,
  expandedNiche: ExpandedNiche
) {
  const terms = expandedNiche.terms;

  const categoryScore = scoreTextMatch(company.category, terms, 55);
  const descriptionScore = scoreTextMatch(company.description, terms, 30);
  const nameScore = scoreTextMatch(company.name, terms, 22);
  const matchedTermScore = scoreTextMatch(company.matchedSearchTerm, terms, 18);

  const combined = categoryScore + descriptionScore + nameScore + matchedTermScore;

  return Math.min(combined, 100);
}
