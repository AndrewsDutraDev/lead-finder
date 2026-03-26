import type { SearchRequest } from "@/types/company";
import { resolveStateLabel } from "@/lib/locations";

export function buildLocationLabel(params: SearchRequest) {
  if (params.city && params.state) {
    return `${params.city}, ${params.state}`;
  }

  if (params.state) {
    return resolveStateLabel(params.country, params.state) ?? params.state;
  }

  return "Brasil";
}

export function buildSearchSummary(params: SearchRequest) {
  const parts = [params.niche, buildLocationLabel(params)];
  return parts.filter(Boolean).join(" em ");
}
