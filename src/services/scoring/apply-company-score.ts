import type { InternalCompany } from "@/types/company";
import { calculateCompanyScore } from "@/services/scoring/calculate-company-score";

export function applyCompanyScore(companies: InternalCompany[]) {
  return companies
    .map((company) => ({
      ...company,
      score: calculateCompanyScore(company)
    }))
    .sort((left, right) => {
      if (right.score !== left.score) {
        return right.score - left.score;
      }

      return left.name.localeCompare(right.name);
    });
}
