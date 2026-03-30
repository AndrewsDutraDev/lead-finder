import { chromium, type Browser, type BrowserContextOptions } from "playwright";

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

  if (!url.searchParams.has("token")) {
    url.searchParams.set("token", token);
  }

  return url.toString();
}

function isRemoteBrowserExpected() {
  return (
    Boolean(process.env.BROWSERLESS_TOKEN?.trim()) ||
    Boolean(process.env.BROWSERLESS_API_KEY?.trim()) ||
    Boolean(process.env.BROWSERLESS_WS_ENDPOINT?.trim()) ||
    process.env.PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD === "1" ||
    process.env.VERCEL === "1"
  );
}

export async function createBrowserSession(headless = true): Promise<BrowserSession> {
  const browserlessWSEndpoint = buildBrowserlessWSEndpoint();
  const envSnapshot = {
    hasBrowserlessToken: Boolean(process.env.BROWSERLESS_TOKEN?.trim()),
    hasBrowserlessApiKey: Boolean(process.env.BROWSERLESS_API_KEY?.trim()),
    hasBrowserlessWSEndpoint: Boolean(process.env.BROWSERLESS_WS_ENDPOINT?.trim()),
    browserlessUrl: process.env.BROWSERLESS_URL?.trim() || null,
    skipBrowserDownload: process.env.PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD === "1",
    vercel: process.env.VERCEL === "1"
  };

  console.info("[browser] runtime env", envSnapshot);

  if (browserlessWSEndpoint) {
    const endpoint = new URL(browserlessWSEndpoint);
    console.info("[browser] using browserless", {
      host: endpoint.host,
      protocol: endpoint.protocol
    });

    const browser = await chromium.connectOverCDP(browserlessWSEndpoint);

    return {
      browser,
      contextOptions: {
        locale: "pt-BR",
        userAgent: DEFAULT_USER_AGENT
      }
    };
  }

  if (isRemoteBrowserExpected()) {
    throw new Error(
      "Browserless era esperado neste ambiente, mas nenhuma credencial válida foi carregada em runtime. Configure BROWSERLESS_TOKEN ou BROWSERLESS_WS_ENDPOINT."
    );
  }

  console.info("[browser] using local chromium fallback", {
    headless
  });

  const browser = await chromium.launch({ headless });

  return {
    browser,
    contextOptions: {
      locale: "pt-BR",
      userAgent: DEFAULT_USER_AGENT
    }
  };
}
