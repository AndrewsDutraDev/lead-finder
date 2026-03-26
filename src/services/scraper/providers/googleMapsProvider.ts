import { chromium, type Browser, type BrowserContext, type Page } from "playwright";
import type { RawCompany, SearchRequest } from "@/types/company";
import type { ProviderContext, ScraperProvider } from "./baseProvider";
import { BRAZIL_COUNTRY_CODE, BRAZIL_COUNTRY_LABEL } from "@/lib/constants";
import { buildLocationLabel } from "@/services/scraper/utils/query";
import { delay } from "@/services/scraper/utils/delay";

const GOOGLE_MAPS_BASE_URL = "https://www.google.com/maps/search/";
const DEFAULT_MAX_RESULTS = 100;
const DEFAULT_RESULTS_PER_TERM = 18;
const DETAIL_CONCURRENCY = 4;

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

function buildGoogleMapsQuery(params: SearchRequest, searchTerm?: string) {
  return [searchTerm ?? params.niche, buildLocationLabel(params), BRAZIL_COUNTRY_LABEL].filter(Boolean).join(" ");
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

async function mapWithConcurrency<TInput, TOutput>(
  items: TInput[],
  concurrency: number,
  mapper: (item: TInput, index: number) => Promise<TOutput>
) {
  const results: TOutput[] = new Array(items.length);
  let cursor = 0;

  async function worker() {
    while (cursor < items.length) {
      const currentIndex = cursor;
      cursor += 1;
      results[currentIndex] = await mapper(items[currentIndex], currentIndex);
    }
  }

  await Promise.all(Array.from({ length: Math.min(concurrency, items.length) }, () => worker()));
  return results;
}

export class GoogleMapsProvider implements ScraperProvider {
  name = "google-maps";

  supports(params: SearchRequest) {
    return params.country === BRAZIL_COUNTRY_CODE;
  }

  async search(params: SearchRequest, context: ProviderContext = {}) {
    let browser: Browser | null = null;
    let browserContext: BrowserContext | null = null;

    try {
      browser = await chromium.launch({
        headless: context.headless ?? true
      });

      browserContext = await browser.newContext({
        locale: "pt-BR",
        userAgent:
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
      });

      const page = await browserContext.newPage();
      page.setDefaultTimeout(context.timeoutMs ?? 15000);

      const searchTerms = (context.searchTerms?.filter(Boolean) ?? [context.searchTerm ?? params.niche]).slice(0, 6);
      const maxResults = context.maxResults ?? DEFAULT_MAX_RESULTS;
      const maxResultsPerTerm = Math.max(10, Math.min(DEFAULT_RESULTS_PER_TERM, maxResults));
      const linkToTerm = new Map<string, string>();

      for (const searchTerm of searchTerms) {
        const links = await scrapePlaceLinksForTerm(page, params, searchTerm, maxResultsPerTerm);

        links.forEach((link) => {
          if (!linkToTerm.has(link) && linkToTerm.size < maxResults) {
            linkToTerm.set(link, searchTerm);
          }
        });

        if (linkToTerm.size >= maxResults) {
          break;
        }
      }

      await page.close().catch(() => null);

      const placeEntries = Array.from(linkToTerm.entries()).slice(0, maxResults);
      const hydratedResults = await mapWithConcurrency<[string, string], RawCompany | null>(
        placeEntries,
        DETAIL_CONCURRENCY,
        async ([link, searchTerm]) => {
          const detailPage = await browserContext!.newPage();
        detailPage.setDefaultTimeout(context.timeoutMs ?? 15000);

        try {
          await detailPage.goto(link, { waitUntil: "domcontentloaded" });
          const snapshot = await scrapePlaceDetails(detailPage);

          if (!snapshot.name) {
            return null;
          }

          return {
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
        } catch (error) {
          console.error(`[${this.name}] failed to extract place`, { link, error });
          return null;
        } finally {
          await detailPage.close().catch(() => null);
        }
        }
      );

      return hydratedResults.filter((item): item is RawCompany => Boolean(item));
    } catch (error) {
      console.error(`[${this.name}] search failed`, error);
      return [];
    } finally {
      await browserContext?.close().catch(() => null);
      await browser?.close().catch(() => null);
    }
  }
}
