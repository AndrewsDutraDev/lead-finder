import type { RawCompany, SearchRequest, SearchResponse } from "@/types/company";
import { buildSearchQueries } from "@/services/niche/buildSearchQueries";
import { expandNiche } from "@/services/niche/expandNiche";
import { normalizeCompany } from "@/services/normalizer/normalize-company";
import { dedupeResults } from "@/services/normalizer/dedupe-results";
import { applyCompanyScore } from "@/services/scoring/apply-company-score";
import { searchCompanies } from "@/services/scraper/searchCompanies";

type ProcessSearchOptions = {
  onProgress?: (payload: SearchResponse) => Promise<void> | void;
};

export async function processSearchResults(query: SearchRequest, options: ProcessSearchOptions = {}) {
  const MAX_RETURNED_RESULTS = 100;
  const expandedNiche = expandNiche(query.niche);
  const searchQueries = buildSearchQueries(query, expandedNiche);
  const streamedResults: RawCompany[] = [];

  const buildPayload = (scrapeOutput: Awaited<ReturnType<typeof searchCompanies>>) => {
    const normalized = streamedResults
      .map((company) => normalizeCompany(company, query))
      .filter((company): company is NonNullable<typeof company> => Boolean(company));

    const deduped = dedupeResults(normalized);
    const scored = applyCompanyScore(deduped)
      .slice(0, MAX_RETURNED_RESULTS)
      .map(({ source: _source, ...company }) => company);

    return {
      results: scored,
      meta: {
        total: scored.length,
        durationMs: 0,
        providers: scrapeOutput.providers,
        expandedTerms: expandedNiche.terms,
        searchQueries: searchQueries.map((item) => item.text),
        query,
        diagnostics: {
          activeProviders: scrapeOutput.activeProviders,
          providerDiagnostics: scrapeOutput.providerDiagnostics,
          rawResultCount: streamedResults.length,
          normalizedCount: normalized.length,
          dedupedCount: deduped.length,
          scoredCount: scored.length
        }
      }
    } satisfies SearchResponse;
  };

  const scrapeOutput = await searchCompanies(query, searchQueries, {
    onResult: async (company) => {
      streamedResults.push(company);
      const payload = buildPayload({
        activeProviders: [],
        providerDiagnostics: [],
        providers: [],
        results: streamedResults
      });
      await options.onProgress?.(payload);
    }
  });

  const normalized = scrapeOutput.results
    .map((company) => normalizeCompany(company, query))
    .filter((company): company is NonNullable<typeof company> => Boolean(company));

  const deduped = dedupeResults(normalized);
  const scored = applyCompanyScore(deduped)
    .slice(0, MAX_RETURNED_RESULTS)
    .map(({ source: _source, ...company }) => company);

  return {
    results: scored,
    meta: {
      total: scored.length,
      durationMs: 0,
      providers: scrapeOutput.providers,
      expandedTerms: expandedNiche.terms,
      searchQueries: searchQueries.map((item) => item.text),
      query,
      diagnostics: {
        activeProviders: scrapeOutput.activeProviders,
        providerDiagnostics: scrapeOutput.providerDiagnostics,
        rawResultCount: scrapeOutput.results.length,
        normalizedCount: normalized.length,
        dedupedCount: deduped.length,
        scoredCount: scored.length
      }
    }
  } satisfies SearchResponse;
}
