export function LoadingState() {
  return (
    <div className="rounded-[30px] border border-white/80 bg-white/85 p-8 shadow-soft backdrop-blur">
      <div className="flex items-center gap-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-brand-600" />
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Coletando dados das fontes públicas</h3>
          <p className="mt-1 text-sm text-slate-500">
            O backend está navegando com Browserless, extraindo e processando os leads em tempo real.
          </p>
        </div>
      </div>
    </div>
  );
}
