import type { ExpandedNiche, GeneratedSearchQuery, SearchRequest } from "@/types/company";
import { buildLocationLabel } from "@/services/scraper/utils/query";

const MAX_SEARCH_TERMS = 6;

export function buildSearchQueries(query: SearchRequest, expandedNiche: ExpandedNiche): GeneratedSearchQuery[] {
  const location = buildLocationLabel(query);

  return expandedNiche.terms.slice(0, MAX_SEARCH_TERMS).map((term) => ({
    term,
    text: `${term} em ${location}`
  }));
}
