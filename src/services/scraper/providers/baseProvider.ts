import type { RawCompany, SearchRequest } from "@/types/company";

export type ProviderContext = {
  headless?: boolean;
  maxResults?: number;
  timeoutMs?: number;
};

export interface ScraperProvider {
  name: string;
  supports(params: SearchRequest): boolean;
  search(params: SearchRequest, context?: ProviderContext): Promise<RawCompany[]>;
}
