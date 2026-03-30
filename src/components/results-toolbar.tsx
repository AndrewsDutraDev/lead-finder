import { ExportCsvButton } from "@/components/export-csv-button";

type ResultsToolbarProps = {
  total: number;
  collected: number;
  durationMs: number | null;
  onlyWithWebsite: boolean;
  onlyWithEmail: boolean;
  onlyWithPhone: boolean;
  onToggleWebsite: () => void;
  onToggleEmail: () => void;
  onTogglePhone: () => void;
  onExportCsv: () => void;
};

export function ResultsToolbar({
  total,
  collected,
  durationMs,
  onlyWithWebsite,
  onlyWithEmail,
  onlyWithPhone,
  onToggleWebsite,
  onToggleEmail,
  onTogglePhone,
  onExportCsv
}: ResultsToolbarProps) {
  const pillClassName = "inline-flex h-11 items-center rounded-2xl border px-4 text-sm font-semibold transition";

  const summary = [
    { label: "Visíveis", value: total },
    { label: "Coletados", value: collected },
    { label: "Tempo", value: durationMs ? `${(durationMs / 1000).toFixed(durationMs >= 10_000 ? 0 : 1)}s` : "--" }
  ];

  return (
    <div className="flex flex-col gap-5 rounded-[30px] border border-white/80 bg-white/90 p-5 shadow-soft backdrop-blur xl:flex-row xl:items-center xl:justify-between">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-6">
        <div>
          <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Resultados</p>
          <div className="mt-2 flex items-center gap-3">
            <h3 className="text-3xl font-semibold text-slate-900">{total}</h3>
            <span className="rounded-full border border-brand-100 bg-brand-50 px-3 py-1 text-xs font-semibold text-brand-700">
              Ordenado por score
            </span>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-3">
          {summary.map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">{item.label}</p>
              <p className="mt-2 text-lg font-semibold text-slate-900">{item.value}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap xl:justify-end">
        <button
          type="button"
          onClick={onToggleWebsite}
          className={`${pillClassName} ${onlyWithWebsite ? "border-success-500 bg-success-100 text-success-600" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}
        >
          Apenas com site
        </button>
        <button
          type="button"
          onClick={onToggleEmail}
          className={`${pillClassName} ${onlyWithEmail ? "border-success-500 bg-success-100 text-success-600" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}
        >
          Apenas com email
        </button>
        <button
          type="button"
          onClick={onTogglePhone}
          className={`${pillClassName} ${onlyWithPhone ? "border-success-500 bg-success-100 text-success-600" : "border-slate-200 bg-white text-slate-700 hover:bg-slate-50"}`}
        >
          Apenas com telefone
        </button>
        <ExportCsvButton disabled={total === 0} onClick={onExportCsv} />
      </div>
    </div>
  );
}
