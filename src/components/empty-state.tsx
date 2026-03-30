import type { SearchResponse } from "@/types/company";

type EmptyStateProps = {
  hasSearched?: boolean;
  diagnostics?: SearchResponse["meta"]["diagnostics"];
};

export function EmptyState({ hasSearched = false, diagnostics }: EmptyStateProps) {
  return (
    <div className="rounded-[30px] border border-dashed border-slate-300 bg-white/70 p-10 text-center shadow-soft backdrop-blur">
      <h3 className="text-xl font-semibold text-slate-900">
        {hasSearched ? "Nenhum lead encontrado" : "Pronto para buscar empresas"}
      </h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-slate-500">
        {hasSearched
          ? "Amplie a região, ajuste o nicho ou tente novamente. O sistema só exibe os resultados da sessão atual."
          : "Escolha um nicho, defina o local e execute a busca para iniciar o scraping no backend e visualizar leads qualificados."}
      </p>
      {hasSearched && diagnostics ? (
        <div className="mx-auto mt-6 max-w-3xl rounded-[24px] border border-slate-200 bg-slate-50 p-5 text-left shadow-soft">
          <h4 className="text-sm font-semibold text-slate-900">Diagnóstico da última busca</h4>
          <p className="mt-2 text-sm text-slate-600">
            Providers ativos: {diagnostics.activeProviders.join(", ") || "nenhum"} | Resultados brutos:{" "}
            {diagnostics.rawResultCount} | Após normalização: {diagnostics.normalizedCount} | Após deduplicação:{" "}
            {diagnostics.dedupedCount}
          </p>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            {diagnostics.providerDiagnostics.map((item) => (
              <div key={item.provider} className="rounded-xl border border-slate-200 bg-white px-3 py-2">
                <strong className="text-slate-900">{item.provider}</strong>: {item.resultCount} resultados
                {item.error ? ` | erro: ${item.error}` : ""}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
