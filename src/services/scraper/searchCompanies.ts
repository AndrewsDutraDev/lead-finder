import type { GeneratedSearchQuery, ProviderDiagnostic, RawCompany, SearchRequest } from "@/types/company";
import { GoogleMapsProvider } from "@/services/scraper/providers/googleMapsProvider";
import type { ScraperProvider } from "@/services/scraper/providers/baseProvider";

const providers: ScraperProvider[] = [new GoogleMapsProvider()];
const MAX_PAGES_PER_SEARCH_TERM = 4;
const MAX_RESULTS_PER_PAGE = 20;

type SearchCompaniesOptions = {
  onResult?: (company: RawCompany) => Promise<void> | void;
};

export async function searchCompanies(
  params: SearchRequest,
  searchQueries: GeneratedSearchQuery[],
  options: SearchCompaniesOptions = {}
) {
  const activeProviders = providers.filter((provider) => provider.supports(params));
  const results: RawCompany[] = [];
  const providerNames = new Set<string>();
  const providerDiagnostics: ProviderDiagnostic[] = [];

  for (const provider of activeProviders) {
    let streamedResultCount = 0;

    try {
      const providerResults = await provider.search(params, {
        searchTerms: searchQueries.map((query) => query.term),
        maxResults: Math.max(20, searchQueries.length * MAX_PAGES_PER_SEARCH_TERM * MAX_RESULTS_PER_PAGE),
        maxPagesPerSearchTerm: MAX_PAGES_PER_SEARCH_TERM,
        timeoutMs: 12000,
        onResult: async (company) => {
          streamedResultCount += 1;
          providerNames.add(provider.name);
          await options.onResult?.(company);
        }
      });

      providerDiagnostics.push({
        provider: provider.name,
        resultCount: streamedResultCount || providerResults.length,
        error: null
      });

      console.info(`[scraper] provider ${provider.name} finished`, {
        resultCount: streamedResultCount || providerResults.length,
        searchTerms: searchQueries.map((query) => query.term)
      });

      if (providerResults.length > 0) {
        providerNames.add(provider.name);
        results.push(...providerResults);
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : "Unknown provider error";
      providerDiagnostics.push({
        provider: provider.name,
        resultCount: streamedResultCount,
        error: message
      });
      console.error(`[scraper] provider ${provider.name} failed`, error);
    }
  }

  return {
    activeProviders: activeProviders.map((provider) => provider.name),
    providerDiagnostics,
    providers: Array.from(providerNames),
    results
  };
}
