# Local Lead Finder

Aplicação full stack em `Next.js + React + TypeScript` para buscar empresas por nicho e localização no Brasil com scraping server-side usando Playwright.

## Scripts

```bash
npm install
npm run dev
```

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
- Se o navegador do Playwright ainda não estiver instalado, execute `npx playwright install chromium`.
