import type { Browser, BrowserContext, Page } from "playwright";
import type { RawCompany, SearchRequest } from "@/types/company";
import type { ProviderContext, ScraperProvider } from "./baseProvider";
import { delay } from "@/services/scraper/utils/delay";
import { buildLocationLabel } from "@/services/scraper/utils/query";
import { BRAZIL_COUNTRY_CODE } from "@/lib/constants";
import { createBrowserSession } from "@/services/scraper/browser";

const SEARCH_URL = "https://paginaamarela.com.br/";
const MAX_COMPANIES = 24;

type DetailSnapshot = {
  name: string | null;
  category: string | null;
  description: string | null;
  phone: string | null;
  websiteUrl: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
};

async function dismissCookies(page: Page) {
  const continueButton = page.getByText("CONTINUAR", { exact: true });
  if (await continueButton.isVisible().catch(() => false)) {
    await continueButton.click().catch(() => null);
    await delay(250);
  }
}

async function collectCompanyLinks(page: Page, maxResults: number) {
  const seen = new Set<string>();

  for (let attempt = 0; attempt < 8 && seen.size < maxResults; attempt += 1) {
    await page.waitForLoadState("domcontentloaded");
    await page.waitForTimeout(900);

    const hrefs = await page.$$eval('a[href*="/empresa/"]', (anchors) =>
      Array.from(new Set(anchors.map((anchor) => (anchor as HTMLAnchorElement).href))).filter(Boolean)
    );

    hrefs.forEach((href) => seen.add(href));
    if (seen.size >= maxResults) {
      break;
    }

    const nextHref = await page
      .evaluate(() => {
        const links = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]'));
        return (
          links.find((link) =>
            /pr[oó]xima|avancar|seguir|next/i.test((link.textContent || "").trim()) ||
            link.getAttribute("rel") === "next"
          )?.href ?? null
        );
      })
      .catch(() => null);

    if (!nextHref || nextHref === page.url()) {
      break;
    }

    await page.goto(nextHref, { waitUntil: "domcontentloaded" });
    await delay(900);
  }

  return Array.from(seen).slice(0, maxResults);
}

async function ensureSearchForm(page: Page) {
  const keywordInput = page.locator('input[name="q"]');
  if (await keywordInput.count()) return;

  const searchTrigger = page.locator("button.campo_busca");
  if (await searchTrigger.isVisible().catch(() => false)) {
    await searchTrigger.click();
    await page.waitForTimeout(800);
  }
}

async function resolveWebsiteUrl(page: Page) {
  const rawHref = await page
    .evaluate(() => {
      const links = Array.from(document.querySelectorAll<HTMLAnchorElement>("a[href]"));
      return links.find((link) => link.textContent?.trim().toLowerCase() === "site")?.href ?? null;
    })
    .catch(() => null);

  if (!rawHref) return null;
  if (!rawHref.includes("/redirecionar/")) return rawHref;

  const websitePage = await page.context().newPage();

  try {
    await websitePage.goto(rawHref, {
      waitUntil: "domcontentloaded",
      timeout: 10000
    });
    await websitePage.waitForTimeout(1000);
    const finalUrl = websitePage.url();
    return finalUrl.includes("paginaamarela.com.br") ? null : finalUrl;
  } catch {
    return null;
  } finally {
    await websitePage.close().catch(() => null);
  }
}

async function scrapeDetails(page: Page) {
  await page.waitForLoadState("domcontentloaded");
  await page.waitForTimeout(700);

  const snapshot = await page.evaluate<DetailSnapshot>(() => {
    const text = document.body.innerText.replace(/\r/g, "");
    const lines = text
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean);

    const getEmail = () => {
      const mailto = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href^="mailto:"]'))[0];
      if (mailto) {
        return mailto.href.replace("mailto:", "").trim() || null;
      }

      return text.match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/i)?.[0] ?? null;
    };

    const phoneMatch =
      text.match(/(\(?\d{2}\)?\s?\d{4,5}-?\d{4})/) ??
      text.match(/(0800\s?\d{3}\s?\d{4})/) ??
      null;

    const addressStart = lines.findIndex((line) => /Endere.c?os e Telefones/i.test(line));
    const addressLines =
      addressStart >= 0
        ? lines
            .slice(addressStart + 1, addressStart + 8)
            .filter(
              (line) =>
                !/Ver empresa no mapa|Acessar o CEP|Acessar o endere.o|Ramos de atividade|Outros contatos|Compartilhar/i.test(
                  line
                )
            )
        : [];

    const activityStart = lines.findIndex((line) => /Ramos de atividade/i.test(line));
    const category = activityStart >= 0 ? lines[activityStart + 1] ?? null : null;
    const description = lines.slice(0, 40).join(" | ") || null;
    const title = document.querySelector("h1")?.textContent?.trim() ?? null;
    const subtitleLine = lines.find((line) => /^[\p{L}\s.'-]+,\s?[A-Z]{2}$/u.test(line)) ?? null;
    const stateMatch = subtitleLine?.match(/,\s?([A-Z]{2})$/);
    const city = subtitleLine ? subtitleLine.replace(/,\s?[A-Z]{2}$/, "").trim() : null;

    return {
      name: title,
      category,
      description,
      phone: phoneMatch?.[0] ?? null,
      websiteUrl: null,
      email: getEmail(),
      address: addressLines.length > 0 ? addressLines.join(", ") : null,
      city,
      state: stateMatch?.[1] ?? null
    };
  });

  return {
    ...snapshot,
    websiteUrl: await resolveWebsiteUrl(page)
  };
}

export class ExampleDirectoryProvider implements ScraperProvider {
  name = "pagina-amarela";

  supports(params: SearchRequest) {
    return params.country === BRAZIL_COUNTRY_CODE;
  }

  async search(params: SearchRequest, context: ProviderContext = {}) {
    let browser: Browser | null = null;
    let browserContext: BrowserContext | null = null;

    try {
      const session = await createBrowserSession(context.headless ?? true);
      browser = session.browser;
      browserContext = await browser.newContext(session.contextOptions);

      const page = await browserContext.newPage();
      page.setDefaultTimeout(context.timeoutMs ?? 15000);

      await page.goto(SEARCH_URL, { waitUntil: "domcontentloaded" });
      await dismissCookies(page);
      await ensureSearchForm(page);
      await page.locator('input[name="q"]').fill(context.searchTerm ?? params.niche);
      await delay(300);

      const locationInput = page.locator('input[name="l"]');
      await locationInput.fill(buildLocationLabel(params));
      await delay(300);

      await page.locator('button[type="submit"]').click();
      await page.waitForURL(/\/empresas\//, { timeout: context.timeoutMs ?? 15000 });
      await delay(1200);

      const links = await collectCompanyLinks(page, context.maxResults ?? MAX_COMPANIES);
      const companies: RawCompany[] = [];

      for (const link of links) {
        const detailPage = await browserContext.newPage();

        try {
          await detailPage.goto(link, { waitUntil: "domcontentloaded" });
          const snapshot = await scrapeDetails(detailPage);

          companies.push({
            source: this.name,
            name: snapshot.name,
            niche: params.niche,
            category: snapshot.category,
            description: snapshot.description,
            matchedSearchTerm: context.searchTerm ?? null,
            websiteUrl: snapshot.websiteUrl,
            phone: snapshot.phone,
            email: snapshot.email,
            address: snapshot.address,
            city: snapshot.city ?? params.city ?? null,
            state: snapshot.state ?? params.state ?? null,
            country: "Brasil"
          });
        } catch (error) {
          console.error(`[${this.name}] failed to extract detail page`, { link, error });
        } finally {
          await detailPage.close().catch(() => null);
          await delay(250);
        }
      }

      return companies;
    } catch (error) {
      console.error(`[${this.name}] search failed`, error);
      return [];
    } finally {
      await browserContext?.close().catch(() => null);
      await browser?.close().catch(() => null);
    }
  }
}
