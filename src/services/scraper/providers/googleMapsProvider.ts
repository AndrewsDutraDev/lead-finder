import type { Browser, BrowserContext, Page } from "playwright-core";
import type { RawCompany, SearchRequest } from "@/types/company";
import type { ProviderContext, ScraperProvider } from "./baseProvider";
import { BRAZIL_COUNTRY_CODE, BRAZIL_COUNTRY_LABEL } from "@/lib/constants";
import { buildLocationLabel } from "@/services/scraper/utils/query";
import { delay } from "@/services/scraper/utils/delay";
import { createBrowserSession, createManagedContext, createManagedPage } from "@/services/scraper/browser";

const GOOGLE_MAPS_BASE_URL = "https://www.google.com/maps/search/";
const DEFAULT_MAX_RESULTS = 40;
const DEFAULT_RESULTS_PER_TERM = 8;
const EARLY_RETURN_TARGET = 12;
type GoogleMapsSnapshot = {
  name: string | null;
  category: string | null;
  description: string | null;
  websiteUrl: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
};

type BrowserRuntime = {
  browser: Browser;
  browserContext: BrowserContext;
  page: Page;
};

function buildGoogleMapsQuery(params: SearchRequest, searchTerm?: string) {
  const parts = [searchTerm ?? params.niche, buildLocationLabel(params), BRAZIL_COUNTRY_LABEL]
    .filter(Boolean)
    .filter((part, index, items) => items.findIndex((candidate) => candidate.toLowerCase() === part.toLowerCase()) === index);

  return parts.join(" ");
}

async function dismissConsent(page: Page) {
  const consentButton = page.getByRole("button", { name: /Aceitar tudo|Accept all/i });
  if (await consentButton.isVisible().catch(() => false)) {
    await consentButton.click().catch(() => null);
    await delay(500);
  }
}

async function collectPlaceLinks(page: Page, maxResults: number) {
  const feed = page.locator('[role="feed"]');
  const seen = new Set<string>();
  let stagnantAttempts = 0;
  const feedVisible = await feed
    .first()
    .isVisible({ timeout: 4000 })
    .catch(() => false);

  for (let attempt = 0; attempt < 14 && seen.size < maxResults && stagnantAttempts < 3; attempt += 1) {
    const previousSize = seen.size;
    const hrefs = feedVisible
      ? await feed.locator('a[href*="/maps/place/"]').evaluateAll((nodes) =>
          nodes
            .map((node) => (node as HTMLAnchorElement).href)
            .filter((href) => href.includes("/maps/place/"))
        )
      : await page.locator('a[href*="/maps/place/"]').evaluateAll((nodes) =>
          nodes
            .map((node) => (node as HTMLAnchorElement).href)
            .filter((href) => href.includes("/maps/place/"))
        );

    hrefs.forEach((href) => seen.add(href));

    if (feedVisible) {
      await feed.evaluate((element) => {
        element.scrollBy({ top: element.scrollHeight, behavior: "instant" });
      });
    } else {
      await page.evaluate(() => {
        window.scrollBy({ top: window.innerHeight * 1.5, behavior: "instant" });
      });
    }

    await delay(650);

    if (seen.size === previousSize) {
      stagnantAttempts += 1;
    } else {
      stagnantAttempts = 0;
    }
  }

  return Array.from(seen).slice(0, maxResults);
}

async function scrapePlaceLinksForTerm(page: Page, params: SearchRequest, searchTerm: string, maxResults: number) {
  const searchUrl = `${GOOGLE_MAPS_BASE_URL}${encodeURIComponent(buildGoogleMapsQuery(params, searchTerm))}`;
  console.info("[google-maps] searching term", {
    searchTerm,
    searchUrl,
    maxResults
  });
  await page.goto(searchUrl, { waitUntil: "domcontentloaded" });
  await dismissConsent(page);
  await delay(1800);

  return collectPlaceLinks(page, maxResults);
}

function parseCityAndState(address: string | null) {
  if (!address) {
    return {
      city: null,
      state: null
    };
  }

  const match = address.match(/,\s*([^,]+)\s*-\s*([A-Z]{2})(?:,|$)/);

  return {
    city: match?.[1]?.trim() ?? null,
    state: match?.[2]?.trim() ?? null
  };
}

async function scrapePlaceDetails(page: Page): Promise<GoogleMapsSnapshot> {
  await page.waitForLoadState("domcontentloaded");
  await delay(900);

  const contextSnapshot = await page.evaluate(() => {
    const text = document.body.innerText.replace(/\r/g, "");
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);
    const name = document.querySelector("h1")?.textContent?.trim() ?? null;
    const titleIndex = name ? lines.findIndex((line) => line === name) : -1;
    const nearbyLines = titleIndex >= 0 ? lines.slice(titleIndex + 1, titleIndex + 10) : [];
    const categoryLine =
      nearbyLines.find((line) => line.includes("·") && !/Visão geral|Sobre|Rotas|Salvar|Compartilhar/i.test(line)) ??
      null;

    return {
      name,
      category: categoryLine ? categoryLine.split("·")[0].trim() : null,
      description: nearbyLines.slice(0, 4).join(" | ") || null
    };
  });

  const address =
    (await page.locator('button[data-item-id="address"]').first().getAttribute("aria-label").catch(() => null))
      ?.replace(/^Endere.c?o:\s*/i, "")
      .trim() ?? null;

  const phone =
    (await page.locator('button[data-item-id^="phone:tel:"]').first().getAttribute("aria-label").catch(() => null))
      ?.replace(/^Telefone:\s*/i, "")
      .trim() ?? null;

  const websiteUrl =
    (await page.locator('a[data-item-id="authority"]').first().getAttribute("href").catch(() => null)) ?? null;

  const parsedLocation = parseCityAndState(address);

  return {
    name: contextSnapshot.name,
    category: contextSnapshot.category,
    description: contextSnapshot.description,
    websiteUrl,
    phone,
    address,
    city: parsedLocation.city,
    state: parsedLocation.state
  };
}

export class GoogleMapsProvider implements ScraperProvider {
  name = "google-maps";

  supports(params: SearchRequest) {
    return params.country === BRAZIL_COUNTRY_CODE;
  }

  async search(params: SearchRequest, context: ProviderContext = {}) {
    let searchRuntime: BrowserRuntime | null = null;
    let detailRuntime: BrowserRuntime | null = null;
    const collectedResults: RawCompany[] = [];

    const createRuntime = async () => {
      const session = await createBrowserSession();
      const browser = session.browser;
      const browserContext = await createManagedContext(browser, session.contextOptions);
      const page = await createManagedPage(browserContext);

      page.setDefaultTimeout(context.timeoutMs ?? 15000);
      page.setDefaultNavigationTimeout(context.timeoutMs ?? 15000);

      browser.on("disconnected", () => {
        console.error("[google-maps] browser disconnected unexpectedly");
      });

      return {
        browser,
        browserContext,
        page
      } satisfies BrowserRuntime;
    };

    const closeRuntime = async (runtime: BrowserRuntime | null) => {
      await runtime?.page.close().catch(() => null);
      await runtime?.browserContext.close().catch(() => null);
      await runtime?.browser.close().catch(() => null);
    };

    try {
      const searchTerms = (context.searchTerms?.filter(Boolean) ?? [context.searchTerm ?? params.niche]).slice(0, 4);
      const maxResults = context.maxResults ?? DEFAULT_MAX_RESULTS;
      const targetResults = Math.min(maxResults, EARLY_RETURN_TARGET);
      const seenLinks = new Set<string>();

      console.info("[google-maps] provider input", {
        niche: params.niche,
        country: params.country,
        state: params.state ?? null,
        city: params.city ?? null,
        searchTerms,
        maxResults,
        targetResults,
        maxResultsPerTerm: DEFAULT_RESULTS_PER_TERM
      });

      for (const searchTerm of searchTerms) {
        if (collectedResults.length >= targetResults) {
          break;
        }

        if (!searchRuntime) {
          searchRuntime = await createRuntime();
        }

        try {
          const remainingSlots = Math.max(1, targetResults - collectedResults.length);
          const maxResultsPerTerm = Math.min(DEFAULT_RESULTS_PER_TERM, remainingSlots * 2);
          const links = await scrapePlaceLinksForTerm(searchRuntime.page, params, searchTerm, maxResultsPerTerm);
          console.info("[google-maps] collected links", {
            searchTerm,
            count: links.length
          });

          const newLinks = links.filter((link) => {
            if (seenLinks.has(link)) {
              return false;
            }
            seenLinks.add(link);
            return true;
          });

          for (const link of newLinks) {
            if (collectedResults.length >= targetResults) {
              break;
            }

            if (!detailRuntime) {
              detailRuntime = await createRuntime();
            }

            try {
              await detailRuntime.page.goto(link, { waitUntil: "domcontentloaded" });
              const snapshot = await scrapePlaceDetails(detailRuntime.page);

              if (!snapshot.name) {
                continue;
              }

              const company = {
                source: this.name,
                name: snapshot.name,
                niche: params.niche,
                category: snapshot.category,
                description: snapshot.description,
                matchedSearchTerm: searchTerm,
                websiteUrl: snapshot.websiteUrl,
                phone: snapshot.phone,
                email: null,
                address: snapshot.address,
                city: snapshot.city ?? params.city ?? null,
                state: snapshot.state ?? params.state ?? null,
                country: BRAZIL_COUNTRY_LABEL
              } satisfies RawCompany;

              collectedResults.push(company);
              console.info("[google-maps] emitted result", {
                searchTerm,
                collectedResults: collectedResults.length,
                targetResults
              });
              await context.onResult?.(company);
            } catch (error) {
              console.error(`[${this.name}] failed to extract place`, { link, error });
              await closeRuntime(detailRuntime);
              detailRuntime = null;
            }
          }
        } catch (error) {
          console.error(`[${this.name}] failed to collect links for term`, {
            searchTerm,
            error
          });
          await closeRuntime(searchRuntime);
          searchRuntime = null;
        }
      }

      await closeRuntime(searchRuntime);
      searchRuntime = null;

      return collectedResults;
    } catch (error) {
      console.error(`[${this.name}] search failed`, error);
      return collectedResults;
    } finally {
      await closeRuntime(searchRuntime);
      await closeRuntime(detailRuntime);
    }
  }
}
