type ExportCsvButtonProps = {
  disabled?: boolean;
  onClick: () => void;
};

export function ExportCsvButton({ disabled, onClick }: ExportCsvButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className="inline-flex h-11 items-center justify-center rounded-2xl border border-brand-200 bg-brand-50 px-4 text-sm font-semibold text-brand-700 transition hover:border-brand-500 hover:bg-brand-100 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-100 disabled:text-slate-400"
    >
      Exportar CSV
    </button>
  );
}
