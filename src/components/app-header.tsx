type AppHeaderProps = {
  hasSearched: boolean;
  isSearching: boolean;
  totalResults: number;
  totalCollected: number;
  durationMs: number | null;
  providers: string[];
};

const formatter = new Intl.NumberFormat("pt-BR");

function formatDuration(durationMs: number | null) {
  if (!durationMs) {
    return "--";
  }

  return `${(durationMs / 1000).toFixed(durationMs >= 10_000 ? 0 : 1)}s`;
}

export function AppHeader({
  hasSearched,
  isSearching,
  totalResults,
  totalCollected,
  durationMs,
  providers
}: AppHeaderProps) {
  const statusLabel = isSearching ? "Buscando agora" : hasSearched ? "Última execução" : "Pronto para nova busca";

  const stats = [
    {
      label: "Leads visíveis",
      value: formatter.format(totalResults),
      valueClassName: "text-brand-900",
      tone: "border-brand-200 bg-brand-50"
    },
    {
      label: "Leads coletados",
      value: formatter.format(totalCollected),
      valueClassName: "text-success-600",
      tone: "border-success-200 bg-success-100"
    },
    {
      label: "Tempo de resposta",
      value: formatDuration(durationMs),
      valueClassName: "text-slate-900",
      tone: "border-slate-200 bg-slate-50"
    }
  ];

  return (
    <header className="relative overflow-hidden rounded-[36px] border border-white/80 bg-white/85 px-6 py-7 shadow-panel backdrop-blur md:px-10 md:py-10">
      <div className="absolute inset-0 bg-dashboard-grid bg-[size:34px_34px] opacity-40" />
      <div className="absolute -right-16 top-0 h-56 w-56 rounded-full bg-brand-100 blur-3xl" />
      <div className="absolute bottom-0 right-12 h-44 w-44 rounded-full bg-success-100/80 blur-3xl" />
      <div className="absolute inset-y-0 right-0 hidden w-[44%] bg-hero-grid md:block" />

      <div className="relative grid gap-8 lg:grid-cols-[minmax(0,1.35fr)_minmax(280px,0.9fr)] lg:items-end">
        <div className="max-w-3xl">
          <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-brand-800">
            Prospecção Inteligente
          </span>
          <h1 className="mt-5 font-display text-4xl font-semibold tracking-tight text-slate-900 md:text-6xl">
            Local Lead Finder
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
            Uma experiência mais limpa para encontrar empresas por nicho, avaliar qualidade do lead e exportar listas prontas para operação comercial.
          </p>
          <div className="mt-8 flex flex-wrap gap-3 text-sm text-slate-600">
            <div className="rounded-2xl border border-white/90 bg-white/70 px-4 py-3 shadow-soft">
              Busca orientada por nicho e localização
            </div>
            <div className="rounded-2xl border border-white/90 bg-white/70 px-4 py-3 shadow-soft">
              Score visual com foco em oportunidade
            </div>
            <div className="rounded-2xl border border-white/90 bg-white/70 px-4 py-3 shadow-soft">
              Exportação CSV da sessão atual
            </div>
          </div>
        </div>

        <div className="relative rounded-[28px] border border-slate-200/80 bg-slate-900 p-5 text-white shadow-glow">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-brand-200">Painel</p>
              <h2 className="mt-2 font-display text-2xl font-semibold">Visão rápida</h2>
            </div>
            <span className="rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-medium text-slate-100">
              {statusLabel}
            </span>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className={`rounded-2xl border px-4 py-4 ${stat.tone}`}>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">{stat.label}</p>
                <p className={`mt-3 text-2xl font-semibold ${stat.valueClassName}`}>{stat.value}</p>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 px-4 py-4">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-300">Providers ativos</p>
            <p className="mt-2 text-sm leading-6 text-slate-100">
              {providers.length > 0 ? providers.join(", ") : "Definidos automaticamente ao iniciar a próxima busca."}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
