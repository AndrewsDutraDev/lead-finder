import type { ExpandedNiche, InternalCompany } from "@/types/company";
import { calculateCompanyScore } from "@/services/scoring/calculate-company-score";
import { calculateNicheRelevance } from "@/services/scoring/calculate-niche-relevance";

export function applyCompanyScore(companies: InternalCompany[], expandedNiche: ExpandedNiche) {
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
