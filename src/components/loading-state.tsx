export function LoadingState() {
  return (
    <div className="rounded-[28px] border border-white/80 bg-white/75 p-8 shadow-soft backdrop-blur">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-ink-100 border-t-mint-500" />
        <div>
          <h3 className="text-lg font-semibold text-ink-900">Coletando dados das fontes públicas</h3>
          <p className="mt-1 text-sm text-ink-500">
            O backend está navegando com Playwright, extraindo e processando os leads em tempo real.
          </p>
        </div>
      </div>
    </div>
  );
}
