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
      className="inline-flex h-11 items-center justify-center rounded-2xl border border-mint-200 bg-mint-100 px-4 text-sm font-medium text-mint-600 transition hover:border-mint-500 hover:bg-mint-200 disabled:cursor-not-allowed disabled:border-ink-100 disabled:bg-ink-50 disabled:text-ink-400"
    >
      Exportar CSV
    </button>
  );
}
