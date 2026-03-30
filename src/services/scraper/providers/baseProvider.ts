import type { RawCompany, SearchRequest } from "@/types/company";

export type ProviderContext = {
  headless?: boolean;
  maxResults?: number;
  timeoutMs?: number;
  searchTerm?: string;
  searchTerms?: string[];
  searchQuery?: string;
  onResult?: (company: RawCompany) => Promise<void> | void;
};

export interface ScraperProvider {
  name: string;
  supports(params: SearchRequest): boolean;
  search(params: SearchRequest, context?: ProviderContext): Promise<RawCompany[]>;
}
