type ErrorStateProps = {
  message: string;
};

export function ErrorState({ message }: ErrorStateProps) {
  return (
    <div className="rounded-[28px] border border-coral-100 bg-white p-8 shadow-soft">
      <h3 className="text-lg font-semibold text-ink-900">Falha ao executar a busca</h3>
      <p className="mt-2 text-sm leading-7 text-ink-600">{message}</p>
    </div>
  );
}
