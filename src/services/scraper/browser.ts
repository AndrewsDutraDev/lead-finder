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

  const token = process.env.BROWSERLESS_TOKEN?.trim();
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

export async function createBrowserSession(headless = true): Promise<BrowserSession> {
  const browserlessWSEndpoint = buildBrowserlessWSEndpoint();

  if (browserlessWSEndpoint) {
    const browser = await chromium.connect(browserlessWSEndpoint);

    return {
      browser,
      contextOptions: {
        locale: "pt-BR",
        userAgent: DEFAULT_USER_AGENT
      }
    };
  }

  const browser = await chromium.launch({ headless });

  return {
    browser,
    contextOptions: {
      locale: "pt-BR",
      userAgent: DEFAULT_USER_AGENT
    }
  };
}
