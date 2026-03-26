import { chromium, type Browser, type BrowserContext, type Page } from "playwright";
import type { RawCompany, SearchRequest } from "@/types/company";
import type { ProviderContext, ScraperProvider } from "./baseProvider";
import { BRAZIL_COUNTRY_CODE, BRAZIL_COUNTRY_LABEL } from "@/lib/constants";
import { buildLocationLabel } from "@/services/scraper/utils/query";
import { delay } from "@/services/scraper/utils/delay";

const GOOGLE_MAPS_BASE_URL = "https://www.google.com/maps/search/";
const DEFAULT_MAX_RESULTS = 8;

type GoogleMapsSnapshot = {
  name: string | null;
  websiteUrl: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
};

function buildGoogleMapsQuery(params: SearchRequest) {
  return [params.niche, buildLocationLabel(params), BRAZIL_COUNTRY_LABEL].filter(Boolean).join(" ");
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
  await feed.waitFor({ state: "visible", timeout: 15000 });

  const seen = new Set<string>();

  for (let attempt = 0; attempt < 8 && seen.size < maxResults; attempt += 1) {
    const hrefs = await feed.locator('a[href*="/maps/place/"]').evaluateAll((nodes) =>
      nodes
        .map((node) => (node as HTMLAnchorElement).href)
        .filter((href) => href.includes("/maps/place/"))
    );

    hrefs.forEach((href) => seen.add(href));

    await feed.evaluate((element) => {
      element.scrollBy({ top: element.scrollHeight, behavior: "instant" });
    });
    await delay(900);
  }

  return Array.from(seen).slice(0, maxResults);
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
  await delay(1800);

  const name = (await page.locator("h1").first().textContent().catch(() => null))?.trim() ?? null;

  const address =
    (await page.locator('button[data-item-id="address"]').first().getAttribute("aria-label").catch(() => null))
      ?.replace(/^Endereço:\s*/i, "")
      .trim() ?? null;

  const phone =
    (await page.locator('button[data-item-id^="phone:tel:"]').first().getAttribute("aria-label").catch(() => null))
      ?.replace(/^Telefone:\s*/i, "")
      .trim() ?? null;

  const websiteUrl =
    (await page.locator('a[data-item-id="authority"]').first().getAttribute("href").catch(() => null)) ?? null;

  const parsedLocation = parseCityAndState(address);

  return {
    name,
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

      const searchUrl = `${GOOGLE_MAPS_BASE_URL}${encodeURIComponent(buildGoogleMapsQuery(params))}`;

      await page.goto(searchUrl, { waitUntil: "domcontentloaded" });
      await dismissConsent(page);
      await delay(2500);

      const placeLinks = await collectPlaceLinks(page, context.maxResults ?? DEFAULT_MAX_RESULTS);
      const results: RawCompany[] = [];

      for (const link of placeLinks) {
        const detailPage = await browserContext.newPage();

        try {
          await detailPage.goto(link, { waitUntil: "domcontentloaded" });
          const snapshot = await scrapePlaceDetails(detailPage);

          results.push({
            source: this.name,
            name: snapshot.name,
            niche: params.niche,
            websiteUrl: snapshot.websiteUrl,
            phone: snapshot.phone,
            email: null,
            address: snapshot.address,
            city: snapshot.city ?? params.city ?? null,
            state: snapshot.state ?? params.state ?? null,
            country: BRAZIL_COUNTRY_LABEL
          });
        } catch (error) {
          console.error(`[${this.name}] failed to extract place`, { link, error });
        } finally {
          await detailPage.close().catch(() => null);
          await delay(350);
        }
      }

      return results;
    } catch (error) {
      console.error(`[${this.name}] search failed`, error);
      return [];
    } finally {
      await browserContext?.close().catch(() => null);
      await browser?.close().catch(() => null);
    }
  }
}
