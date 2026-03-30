"use client";

import { useMemo, useState } from "react";
import { AppHeader } from "@/components/app-header";
import { CompaniesTable } from "@/components/companies-table";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { ResultsToolbar } from "@/components/results-toolbar";
import { ScoreExplanation } from "@/components/score-explanation";
import { SearchFilters } from "@/components/search-filters";
import { companiesToCsv } from "@/lib/csv";
import { searchLeads } from "@/lib/search-api";
import type { Company, SearchRequest, SearchResponse } from "@/types/company";

const initialFilters: SearchRequest = {
  niche: "",
  country: "BR",
  state: null,
  city: null
};

export function LeadFinderShell() {
  const [filters, setFilters] = useState<SearchRequest>(initialFilters);
  const [results, setResults] = useState<Company[]>([]);
  const [meta, setMeta] = useState<SearchResponse["meta"] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [onlyWithWebsite, setOnlyWithWebsite] = useState(false);
  const [onlyWithEmail, setOnlyWithEmail] = useState(false);
  const [onlyWithPhone, setOnlyWithPhone] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const visibleResults = useMemo(() => {
    return results.filter((company) => {
      if (onlyWithWebsite && !company.websiteUrl) return false;
      if (onlyWithEmail && !company.email) return false;
      if (onlyWithPhone && !company.phone) return false;
      return true;
    });
  }, [onlyWithEmail, onlyWithPhone, onlyWithWebsite, results]);

  function handleReset() {
    setFilters(initialFilters);
    setResults([]);
    setMeta(null);
    setError(null);
    setHasSearched(false);
    setOnlyWithEmail(false);
    setOnlyWithPhone(false);
    setOnlyWithWebsite(false);
  }

  function handleExportCsv() {
    const csv = companiesToCsv(visibleResults);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "leads.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  function handleSearch() {
    if (!filters.niche.trim()) {
      setError("Informe um nicho para iniciar a busca.");
      return;
    }

    setError(null);
    setHasSearched(true);

    setResults([]);
    setMeta(null);
    setIsSearching(true);

    void searchLeads(
      {
        niche: filters.niche.trim(),
        country: filters.country,
        state: filters.state ?? null,
        city: filters.city ?? null
      },
      {
        onProgress(response) {
          setResults(response.results);
          setMeta(response.meta);
        }
      }
    )
      .catch((searchError) => {
        setError(searchError instanceof Error ? searchError.message : "Falha ao buscar resultados.");
      })
      .finally(() => {
        setIsSearching(false);
      });
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 md:px-8 md:py-10">
      <AppHeader />

      <ScoreExplanation />

      <SearchFilters value={filters} isLoading={isSearching} onChange={setFilters} onSubmit={handleSearch} onReset={handleReset} />

      {results.length > 0 ? (
        <ResultsToolbar
          total={visibleResults.length}
          onlyWithWebsite={onlyWithWebsite}
          onlyWithEmail={onlyWithEmail}
          onlyWithPhone={onlyWithPhone}
          onToggleWebsite={() => setOnlyWithWebsite((value) => !value)}
          onToggleEmail={() => setOnlyWithEmail((value) => !value)}
          onTogglePhone={() => setOnlyWithPhone((value) => !value)}
          onExportCsv={handleExportCsv}
        />
      ) : null}

      {isSearching ? <LoadingState /> : null}
      {!isSearching && error ? <ErrorState message={error} /> : null}
      {results.length > 0 ? <CompaniesTable companies={visibleResults} /> : null}
      {!isSearching && !error && results.length === 0 ? (
        <EmptyState hasSearched={hasSearched} diagnostics={meta?.diagnostics} />
      ) : null}
    </main>
  );
}
