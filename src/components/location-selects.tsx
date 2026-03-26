import { getCitiesByState, getStatesByCountry } from "@/lib/locations";

type LocationSelectsProps = {
  country: string;
  state: string;
  city: string;
  onCountryChange: (value: string) => void;
  onStateChange: (value: string) => void;
  onCityChange: (value: string) => void;
};

const fieldClassName =
  "h-12 rounded-2xl border border-ink-200 bg-white px-4 text-sm text-ink-900 outline-none transition placeholder:text-ink-400 focus:border-mint-500 focus:ring-4 focus:ring-mint-100 disabled:bg-ink-50 disabled:text-ink-400";

export function LocationSelects({
  country,
  state,
  city,
  onCountryChange,
  onStateChange,
  onCityChange
}: LocationSelectsProps) {
  const states = getStatesByCountry(country);
  const cities = getCitiesByState(country, state);

  return (
    <>
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink-700">País</span>
        <select className={fieldClassName} value={country} onChange={(event) => onCountryChange(event.target.value)}>
          <option value="">Selecione</option>
          <option value="BR">Brasil</option>
        </select>
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink-700">Estado</span>
        <select
          className={fieldClassName}
          value={state}
          disabled={!country}
          onChange={(event) => onStateChange(event.target.value)}
        >
          <option value="">Todos</option>
          {states.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
      <label className="flex flex-col gap-2">
        <span className="text-sm font-medium text-ink-700">Cidade</span>
        <select
          className={fieldClassName}
          value={city}
          disabled={!state}
          onChange={(event) => onCityChange(event.target.value)}
        >
          <option value="">Todas</option>
          {cities.map((item) => (
            <option key={item.value} value={item.value}>
              {item.label}
            </option>
          ))}
        </select>
      </label>
    </>
  );
}
