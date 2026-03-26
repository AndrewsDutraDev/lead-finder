import type { Company } from "@/types/company";
import { calculateCompanyScore } from "@/services/scoring/calculate-company-score";
import { calculateNicheRelevance } from "@/services/scoring/calculate-niche-relevance";
import type { ExpandedNiche } from "@/types/company";

export function applyCompanyScore(companies: Company[], expandedNiche: ExpandedNiche) {
  return companies
    .map((company) => ({
      ...company,
      nicheRelevanceScore: calculateNicheRelevance(company, expandedNiche),
      score: calculateCompanyScore(company)
    }))
    .sort((left, right) => {
      if (right.nicheRelevanceScore !== left.nicheRelevanceScore) {
        return right.nicheRelevanceScore - left.nicheRelevanceScore;
      }

      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.name.localeCompare(right.name);
    });
}
