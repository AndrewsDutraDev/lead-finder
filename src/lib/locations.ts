import { brazilLocations } from "@/data/br-locations";

export function getCountries() {
  return [brazilLocations];
}

export function getStatesByCountry(country: string) {
  return getCountries().find((item) => item.value === country)?.states ?? [];
}

export function getCitiesByState(country: string, state: string) {
  return getStatesByCountry(country).find((item) => item.value === state)?.cities ?? [];
}

export function resolveStateLabel(country: string, state: string | null | undefined) {
  if (!state) return null;
  return getStatesByCountry(country).find((item) => item.value === state)?.label ?? state;
}
