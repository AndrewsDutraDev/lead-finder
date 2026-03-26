type EmptyStateProps = {
  hasSearched?: boolean;
};

export function EmptyState({ hasSearched = false }: EmptyStateProps) {
  return (
    <div className="rounded-[28px] border border-dashed border-ink-200 bg-white/60 p-10 text-center shadow-soft backdrop-blur">
      <h3 className="text-xl font-semibold text-ink-900">
        {hasSearched ? "Nenhum lead encontrado" : "Pronto para buscar empresas"}
      </h3>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-7 text-ink-500">
        {hasSearched
          ? "Amplie a região, ajuste o nicho ou tente novamente. O sistema só exibe os resultados da sessão atual."
          : "Escolha um nicho, defina o local e execute a busca para iniciar o scraping no backend e visualizar leads qualificados."}
      </p>
    </div>
  );
}
