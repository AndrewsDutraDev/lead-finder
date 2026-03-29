import type { GeneratedSearchQuery, ProviderDiagnostic, RawCompany, SearchRequest } from "@/types/company";
import { GoogleMapsProvider } from "@/services/scraper/providers/googleMapsProvider";
import type { ScraperProvider } from "@/services/scraper/providers/baseProvider";

const providers: ScraperProvider[] = [new GoogleMapsProvider()];

export async function searchCompanies(params: SearchRequest, searchQueries: GeneratedSearchQuery[]) {
  const activeProviders = providers.filter((provider) => provider.supports(params));
  const results: RawCompany[] = [];
  const providerNames = new Set<string>();
  const providerDiagnostics: ProviderDiagnostic[] = [];

  for (const provider of activeProviders) {
    try {
      const providerResults = await provider.search(params, {
        searchTerms: searchQueries.map((query) => query.term),
        maxResults: 100,
        timeoutMs: 15000
      });

      providerDiagnostics.push({
        provider: provider.name,
        resultCount: providerResults.length,
        error: null
      });

      console.info(`[scraper] provider ${provider.name} finished`, {
        resultCount: providerResults.length,
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
        resultCount: 0,
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
