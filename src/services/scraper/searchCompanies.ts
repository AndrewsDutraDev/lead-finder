import type { GeneratedSearchQuery, RawCompany, SearchRequest } from "@/types/company";
import { GoogleMapsProvider } from "@/services/scraper/providers/googleMapsProvider";
import type { ScraperProvider } from "@/services/scraper/providers/baseProvider";

const providers: ScraperProvider[] = [new GoogleMapsProvider()];

export async function searchCompanies(params: SearchRequest, searchQueries: GeneratedSearchQuery[]) {
  const activeProviders = providers.filter((provider) => provider.supports(params));
  const results: RawCompany[] = [];
  const providerNames = new Set<string>();

  for (const provider of activeProviders) {
    try {
      const providerResults = await provider.search(params, {
        searchTerms: searchQueries.map((query) => query.term),
        maxResults: 100,
        timeoutMs: 15000
      });

      if (providerResults.length > 0) {
        providerNames.add(provider.name);
        results.push(...providerResults);
      }
    } catch (error) {
      console.error(`[scraper] provider ${provider.name} failed`, error);
    }
  }

  return {
    providers: Array.from(providerNames),
    results
  };
}
