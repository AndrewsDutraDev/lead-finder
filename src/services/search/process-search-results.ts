import type { SearchRequest } from "@/types/company";
import { normalizeCompany } from "@/services/normalizer/normalize-company";
import { dedupeResults } from "@/services/normalizer/dedupe-results";
import { applyCompanyScore } from "@/services/scoring/apply-company-score";
import { searchCompanies } from "@/services/scraper/searchCompanies";

export async function processSearchResults(query: SearchRequest) {
  const scrapeOutput = await searchCompanies(query);
  const normalized = scrapeOutput.results
    .map((company) => normalizeCompany(company, query))
    .filter((company): company is NonNullable<typeof company> => Boolean(company));

  const deduped = dedupeResults(normalized);
  const scored = applyCompanyScore(deduped);

  return {
    providers: scrapeOutput.providers,
    results: scored
  };
}
