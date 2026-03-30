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
  "h-12 rounded-2xl border border-slate-200 bg-white px-4 text-sm text-slate-900 outline-none transition duration-200 placeholder:text-slate-400 focus:border-brand-500 focus:ring-4 focus:ring-brand-100";

export function SearchFilters({ value, isLoading, onChange, onSubmit, onReset }: SearchFiltersProps) {
  return (
    <section className="relative overflow-hidden rounded-[30px] border border-white/80 bg-white/90 p-6 shadow-soft backdrop-blur md:p-8">
      <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand-600 via-brand-400 to-success-500" />

      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            Busca
          </span>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900">Defina o mercado que você quer prospectar</h2>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-slate-500">
            Busque por nicho, refine a região e execute o scraping no backend com uma interface focada em dados.
          </p>
        </div>
        <div className="rounded-2xl border border-brand-100 bg-brand-50 px-4 py-3 text-sm text-brand-800">
          Nomes mais específicos tendem a gerar leads com melhor score.
        </div>
      </div>

      <div className="mt-7 grid gap-5 lg:grid-cols-[1.35fr_1fr_1fr_1fr]">
        <label className="flex flex-col gap-2">
          <span className="text-sm font-medium text-slate-700">Nicho</span>
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
          className="inline-flex h-12 items-center justify-center rounded-2xl bg-brand-600 px-5 text-sm font-semibold text-white shadow-glow transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-slate-400 disabled:shadow-none"
        >
          {isLoading ? "Buscando..." : "Buscar"}
        </button>
        <button
          type="button"
          onClick={onReset}
          disabled={isLoading}
          className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 px-5 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-white disabled:cursor-not-allowed"
        >
          Limpar filtros
        </button>
      </div>
    </section>
  );
}
