import type { RawCompany, SearchRequest } from "@/types/company";
import { ExampleDirectoryProvider } from "@/services/scraper/providers/exampleDirectoryProvider";
import { GoogleMapsProvider } from "@/services/scraper/providers/googleMapsProvider";
import type { ScraperProvider } from "@/services/scraper/providers/baseProvider";

const providers: ScraperProvider[] = [new GoogleMapsProvider(), new ExampleDirectoryProvider()];

export async function searchCompanies(params: SearchRequest) {
  const activeProviders = providers.filter((provider) => provider.supports(params));
  const settled = await Promise.allSettled(activeProviders.map((provider) => provider.search(params)));

  const results: RawCompany[] = [];
  const providerNames: string[] = [];

  settled.forEach((entry, index) => {
    const provider = activeProviders[index];

    if (entry.status === "fulfilled") {
      providerNames.push(provider.name);
      results.push(...entry.value);
      return;
    }

    console.error(`[scraper] provider ${provider.name} failed`, entry.reason);
  });

  return {
    providers: providerNames,
    results
  };
}
