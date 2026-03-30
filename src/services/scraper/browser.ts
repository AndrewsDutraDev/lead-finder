import { chromium, type Browser, type BrowserContext, type BrowserContextOptions, type Page } from "playwright-core";

const DEFAULT_USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36";

type BrowserSession = {
  browser: Browser;
  contextOptions: BrowserContextOptions;
};

function normalizeBrowserlessEndpoint(value: string) {
  if (value.startsWith("ws://") || value.startsWith("wss://")) {
    return value;
  }

  if (value.startsWith("http://")) {
    return `ws://${value.slice("http://".length)}`;
  }

  if (value.startsWith("https://")) {
    return `wss://${value.slice("https://".length)}`;
  }

  return `wss://${value}`;
}

function buildBrowserlessWSEndpoint() {
  const explicitEndpoint = process.env.BROWSERLESS_WS_ENDPOINT?.trim();
  if (explicitEndpoint) {
    return normalizeBrowserlessEndpoint(explicitEndpoint);
  }

  const token = process.env.BROWSERLESS_TOKEN?.trim() || process.env.BROWSERLESS_API_KEY?.trim();
  if (!token) {
    return null;
  }

  const baseUrl = normalizeBrowserlessEndpoint(
    process.env.BROWSERLESS_URL?.trim() || "wss://production-sfo.browserless.io"
  );
  const url = new URL(baseUrl);
  url.pathname = "/chromium/playwright";

  if (!url.searchParams.has("token")) {
    url.searchParams.set("token", token);
  }

  return url.toString();
}

export async function createBrowserSession(): Promise<BrowserSession> {
  const browserlessWSEndpoint = buildBrowserlessWSEndpoint();
  const envSnapshot = {
    hasBrowserlessToken: Boolean(process.env.BROWSERLESS_TOKEN?.trim()),
    hasBrowserlessApiKey: Boolean(process.env.BROWSERLESS_API_KEY?.trim()),
    hasBrowserlessWSEndpoint: Boolean(process.env.BROWSERLESS_WS_ENDPOINT?.trim()),
    browserlessUrl: process.env.BROWSERLESS_URL?.trim() || null,
    vercel: process.env.VERCEL === "1"
  };

  console.info("[browser] runtime env", envSnapshot);

  if (!browserlessWSEndpoint) {
    throw new Error(
      "Browserless é obrigatório neste projeto. Configure BROWSERLESS_TOKEN, BROWSERLESS_API_KEY ou BROWSERLESS_WS_ENDPOINT."
    );
  }

  const endpoint = new URL(browserlessWSEndpoint);
  console.info("[browser] using browserless", {
    host: endpoint.host,
    protocol: endpoint.protocol
  });

  const browser = await chromium.connect(browserlessWSEndpoint);

  return {
    browser,
    contextOptions: {
      locale: "pt-BR",
      userAgent: DEFAULT_USER_AGENT
    }
  };
}

export async function createManagedContext(browser: Browser, contextOptions: BrowserContextOptions): Promise<BrowserContext> {
  console.info("[browser] creating browserless context");
  return browser.newContext(contextOptions);
}

export async function createManagedPage(context: BrowserContext): Promise<Page> {
  console.info("[browser] creating browserless page");
  return context.newPage();
}
