import { LocationSelects } from "@/components/location-selects";
import type { SearchRequest } from "@/types/company";

type SearchFiltersProps = {
  value: SearchRequest;
  isLoading: boolean;
  onChange: (value: SearchRequest) => void;
  onSubmit: () => void;
  onReset: () => void;
};

const fieldClassName =
  "h-12 rounded-2xl border border-ink-200 bg-white px-4 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-mint-500 focus:ring-4 focus:ring-mint-100";

export function SearchFilters({ value, isLoading, onChange, onSubmit, onReset }: SearchFiltersProps) {
  return (
    <section className="rounded-[28px] border border-white/80 bg-white/80 p-6 shadow-soft backdrop-blur md:p-8">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold text-ink-900">Filtros da busca</h2>
          <p className="mt-1 text-sm text-ink-500">Busque por nicho, refine a região e execute o scraping no backend.</p>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1.3fr_1fr_1fr_1fr]">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-ink-700">Nicho</span>
          <input
            className={fieldClassName}
            value={value.niche}
            placeholder="Ex.: Escritório de contabilidade"
            onChange={(event) => onChange({ ...value, niche: event.target.value })}
          />
        </label>

        <LocationSelects
          country={value.country}
          state={value.state ?? ""}
          city={value.city ?? ""}
          onCountryChange={(country) => onChange({ ...value, country, state: null, city: null })}
          onStateChange={(state) => onChange({ ...value, state: state || null, city: null })}
          onCityChange={(city) => onChange({ ...value, city: city || null })}
        />
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={onSubmit}
          disabled={isLoading}
          className="inline-flex h-12 items-center justify-center rounded-2xl bg-ink-900 px-5 text-sm font-medium text-white transition hover:bg-ink-800 disabled:cursor-not-allowed disabled:bg-ink-400"
        >
          {isLoading ? "Buscando..." : "Buscar"}
        </button>
        <button
          type="button"
          onClick={onReset}
          disabled={isLoading}
          className="inline-flex h-12 items-center justify-center rounded-2xl border border-ink-200 bg-white px-5 text-sm font-medium text-ink-700 transition hover:border-ink-300 hover:bg-ink-50 disabled:cursor-not-allowed"
        >
          Limpar filtros
        </button>
      </div>
    </section>
  );
}
