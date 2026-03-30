type ErrorStateProps = {
  message: string;
};

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="rounded-[30px] border border-danger-100 bg-white p-8 shadow-soft">
      <div className="inline-flex rounded-full border border-danger-100 bg-danger-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-danger-600">
        Problema na execução
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">Falha ao executar a busca</h3>
      <p className="mt-2 text-sm leading-7 text-slate-600">{message}</p>
    </div>
  );
}
