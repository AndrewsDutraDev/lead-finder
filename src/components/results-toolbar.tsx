import { ExportCsvButton } from "@/components/export-csv-button";

type ResultsToolbarProps = {
  total: number;
  onlyWithWebsite: boolean;
  onlyWithEmail: boolean;
  onToggleWebsite: () => void;
  onToggleEmail: () => void;
  onExportCsv: () => void;
};

export function ResultsToolbar({
  total,
  onlyWithWebsite,
  onlyWithEmail,
  onToggleWebsite,
  onToggleEmail,
  onExportCsv
}: ResultsToolbarProps) {
  const pillClassName =
    "inline-flex h-11 items-center rounded-2xl border px-4 text-sm font-medium transition";

  return (
    <div className="flex flex-col gap-4 rounded-[28px] border border-white/80 bg-white/80 p-5 shadow-soft backdrop-blur lg:flex-row lg:items-center lg:justify-between">
      <div>
        <p className="text-sm uppercase tracking-[0.2em] text-ink-400">Resultados</p>
        <div className="mt-1 flex items-center gap-3">
          <h3 className="text-2xl font-semibold text-ink-900">{total}</h3>
          <span className="rounded-full bg-ink-50 px-3 py-1 text-xs font-medium text-ink-500">Ordenado por score</span>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onToggleWebsite}
          className={`${pillClassName} ${onlyWithWebsite ? "border-mint-500 bg-mint-100 text-mint-600" : "border-ink-200 bg-white text-ink-700 hover:bg-ink-50"}`}
        >
          Apenas com site
        </button>
        <button
          type="button"
          onClick={onToggleEmail}
          className={`${pillClassName} ${onlyWithEmail ? "border-mint-500 bg-mint-100 text-mint-600" : "border-ink-200 bg-white text-ink-700 hover:bg-ink-50"}`}
        >
          Apenas com email
        </button>
        <ExportCsvButton disabled={total === 0} onClick={onExportCsv} />
      </div>
    </div>
  );
}
