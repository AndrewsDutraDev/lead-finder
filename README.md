# Local Lead Finder

Aplicação full stack em `Next.js + React + TypeScript` para buscar empresas por nicho e localização no Brasil com scraping server-side usando Playwright local ou Browserless remoto.

## Scripts

```bash
npm install
npm run dev
```

## Variáveis de ambiente

Crie um arquivo `.env.local`:

```bash
# Opcional no ambiente local. Se definido, usa Browserless em vez do Chromium local.
BROWSERLESS_TOKEN=

# Opcional. Se omitido, usa wss://production-sfo.browserless.io
BROWSERLESS_URL=

# Opcional. Tem prioridade sobre as variáveis acima.
# Exemplo: wss://production-sfo.browserless.io?token=seu-token
BROWSERLESS_WS_ENDPOINT=
```

## Browserless na Vercel

Na Vercel, configure:

- `BROWSERLESS_TOKEN` com o token do Browserless
- `PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1` para evitar download do Chromium no build

Opcionalmente, defina `BROWSERLESS_URL` se sua conta usar outro endpoint ou outra região.

## Arquitetura

- `src/app/api/search/route.ts`: rota `POST /api/search`
- `src/services/scraper`: pipeline de scraping e providers
- `src/services/normalizer`: limpeza e padronização dos dados
- `src/services/scoring`: cálculo do score
- `src/components`: UI reutilizável

## Observações

- O scraping roda somente no backend.
- Os resultados não são persistidos em banco.
- A exportação CSV usa apenas os dados atuais da sessão.
- Em deploy na Vercel, o scraping usa Browserless quando `BROWSERLESS_TOKEN` ou `BROWSERLESS_WS_ENDPOINT` estiver definido.
- Em ambiente local, sem Browserless configurado, execute `npx playwright install chromium` antes de usar o scraping.
