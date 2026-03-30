export function AppHeader() {
  return (
    <header className="relative overflow-hidden rounded-[32px] border border-white/70 bg-white/75 px-6 py-8 shadow-panel backdrop-blur md:px-10 md:py-10">
      <div className="absolute inset-y-0 right-0 hidden w-1/2 bg-hero-grid md:block" />
      <div className="relative max-w-3xl">
        <span className="inline-flex items-center rounded-full border border-ink-200 bg-ink-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] text-ink-600">
          Prospecção Inteligente
        </span>
        <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-ink-900 md:text-6xl">
          Local Lead Finder
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-7 text-ink-600 md:text-lg">
          Encontre empresas por nicho e localização e exporte leads em CSV.
        </p>
        <div className="mt-8 grid gap-3 text-sm text-ink-600 sm:grid-cols-3">
          <div className="rounded-2xl border border-ink-100 bg-ink-50/70 px-4 py-3">
            Scraping server-side com Browserless
          </div>
          <div className="rounded-2xl border border-ink-100 bg-ink-50/70 px-4 py-3">
            Score e deduplicação em tempo real
          </div>
          <div className="rounded-2xl border border-ink-100 bg-ink-50/70 px-4 py-3">
            Exportação CSV da sessão atual
          </div>
        </div>
      </div>
    </header>
  );
}
