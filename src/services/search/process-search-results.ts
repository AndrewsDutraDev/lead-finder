import type { SearchRequest } from "@/types/company";
import { buildSearchQueries } from "@/services/niche/buildSearchQueries";
import { expandNiche } from "@/services/niche/expandNiche";
import { normalizeCompany } from "@/services/normalizer/normalize-company";
import { dedupeResults } from "@/services/normalizer/dedupe-results";
import { applyCompanyScore } from "@/services/scoring/apply-company-score";
import { searchCompanies } from "@/services/scraper/searchCompanies";

export async function processSearchResults(query: SearchRequest) {
  const MAX_RETURNED_RESULTS = 100;
  const expandedNiche = expandNiche(query.niche);
  const searchQueries = buildSearchQueries(query, expandedNiche);
  const scrapeOutput = await searchCompanies(query, searchQueries);
  const normalized = scrapeOutput.results
    .map((company) => normalizeCompany(company, query))
    .filter((company): company is NonNullable<typeof company> => Boolean(company));

  const deduped = dedupeResults(normalized);
  const scored = applyCompanyScore(deduped, expandedNiche)
    .slice(0, MAX_RETURNED_RESULTS)
    .map(({ nicheRelevanceScore: _nicheRelevanceScore, source: _source, ...company }) => company);

  return {
    providers: scrapeOutput.providers,
    expandedTerms: expandedNiche.terms,
    searchQueries: searchQueries.map((item) => item.text),
    results: scored
  };
}
