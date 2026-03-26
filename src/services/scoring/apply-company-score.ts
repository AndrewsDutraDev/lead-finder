import type { Company } from "@/types/company";
import { calculateCompanyScore } from "@/services/scoring/calculate-company-score";

export function applyCompanyScore(companies: Company[]) {
  return companies
    .map((company) => ({
      ...company,
      score: calculateCompanyScore(company)
    }))
    .sort((left, right) => right.score - left.score);
}
