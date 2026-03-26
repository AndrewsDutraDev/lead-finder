export type SearchRequest = {
  niche: string;
  country: string;
  state?: string | null;
  city?: string | null;
};

export type RawCompany = {
  source: string;
  name: string | null;
  niche: string | null;
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
  score: number;
  hasWebsite: boolean;
  websiteUrl: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  source: string;
};

export type SearchResponse = {
  results: Company[];
  meta: {
    total: number;
    durationMs: number;
    providers: string[];
    query: SearchRequest;
  };
};
