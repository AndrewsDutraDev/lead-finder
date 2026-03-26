import type { Company } from "@/types/company";

export function calculateCompanyScore(company: Omit<Company, "score">) {
  let score = 0;

  if (company.websiteUrl) score += 25;
  if (company.email) score += 20;
  if (company.phone) score += 20;
  if (company.address) score += 15;

  const completeness = [company.websiteUrl, company.email, company.phone, company.address, company.city, company.state].filter(Boolean)
    .length;

  if (completeness >= 5) {
    score += 20;
  } else if (completeness >= 3) {
    score += 10;
  }

  return Math.min(score, 100);
}
