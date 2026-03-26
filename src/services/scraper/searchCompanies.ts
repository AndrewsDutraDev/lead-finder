import type { GeneratedSearchQuery, RawCompany, SearchRequest } from "@/types/company";
import { ExampleDirectoryProvider } from "@/services/scraper/providers/exampleDirectoryProvider";
import { GoogleMapsProvider } from "@/services/scraper/providers/googleMapsProvider";
import type { ScraperProvider } from "@/services/scraper/providers/baseProvider";

const providers: ScraperProvider[] = [new GoogleMapsProvider(), new ExampleDirectoryProvider()];

export async function searchCompanies(params: SearchRequest, searchQueries: GeneratedSearchQuery[]) {
  const activeProviders = providers.filter((provider) => provider.supports(params));
  const providerRuns = activeProviders.flatMap((provider) =>
    searchQueries.map((searchQuery) => ({
      provider,
      searchQuery,
      promise: provider.search(params, {
        searchTerm: searchQuery.term,
        searchQuery: searchQuery.text,
        maxResults: provider.name === "google-maps" ? 4 : 6
      })
    }))
  );

  const settled = await Promise.allSettled(providerRuns.map((run) => run.promise));

  const results: RawCompany[] = [];
  const providerNames = new Set<string>();

  settled.forEach((entry, index) => {
    const { provider } = providerRuns[index];

    if (entry.status === "fulfilled") {
      providerNames.add(provider.name);
      results.push(...entry.value);
      return;
    }

    console.error(`[scraper] provider ${provider.name} failed`, entry.reason);
  });

  return {
    providers: Array.from(providerNames),
    results
  };
}
