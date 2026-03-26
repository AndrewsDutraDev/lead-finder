export type SearchRequest = {
  niche: string;
  country: string;
  state?: string | null;
  city?: string | null;
};

export type ExpandedNiche = {
  original: string;
  normalized: string;
  terms: string[];
};

export type GeneratedSearchQuery = {
  term: string;
  text: string;
};

export type RawCompany = {
  source: string;
  name: string | null;
  niche: string | null;
  category?: string | null;
  description?: string | null;
  matchedSearchTerm?: string | null;
  websiteUrl: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
};

export type Company = {
  id: string;
  name: string;
  niche: string;
  category: string | null;
  description: string | null;
  matchedSearchTerm: string | null;
  score: number;
  hasWebsite: boolean;
  websiteUrl: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
};

export type InternalCompany = Company & {
  source: string;
};

export type SearchResponse = {
  results: Company[];
  meta: {
    total: number;
    durationMs: number;
    providers: string[];
    expandedTerms?: string[];
    searchQueries?: string[];
    query: SearchRequest;
  };
};
