"use client";

import { useMemo, useState, useTransition } from "react";
import { AppHeader } from "@/components/app-header";
import { CompaniesTable } from "@/components/companies-table";
import { EmptyState } from "@/components/empty-state";
import { ErrorState } from "@/components/error-state";
import { LoadingState } from "@/components/loading-state";
import { ResultsToolbar } from "@/components/results-toolbar";
import { SearchFilters } from "@/components/search-filters";
import { companiesToCsv } from "@/lib/csv";
import { searchLeads } from "@/lib/search-api";
import type { Company, SearchRequest } from "@/types/company";

const initialFilters: SearchRequest = {
  niche: "",
  country: "BR",
  state: null,
  city: null
};

export function LeadFinderShell() {
  const [filters, setFilters] = useState<SearchRequest>(initialFilters);
  const [results, setResults] = useState<Company[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [onlyWithWebsite, setOnlyWithWebsite] = useState(false);
  const [onlyWithEmail, setOnlyWithEmail] = useState(false);
  const [isPending, startTransition] = useTransition();

  const visibleResults = useMemo(() => {
    return results.filter((company) => {
      if (onlyWithWebsite && !company.websiteUrl) return false;
      if (onlyWithEmail && !company.email) return false;
      return true;
    });
  }, [onlyWithEmail, onlyWithWebsite, results]);

  function handleReset() {
    setFilters(initialFilters);
    setResults([]);
    setError(null);
    setHasSearched(false);
    setOnlyWithEmail(false);
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

    startTransition(async () => {
      try {
        const response = await searchLeads({
          niche: filters.niche.trim(),
          country: filters.country,
          state: filters.state ?? null,
          city: filters.city ?? null
        });

        setResults(response.results);
      } catch (searchError) {
        setResults([]);
        setError(searchError instanceof Error ? searchError.message : "Falha ao buscar resultados.");
      }
    });
  }

  return (
    <main className="mx-auto flex min-h-screen w-full max-w-7xl flex-col gap-8 px-4 py-6 md:px-8 md:py-10">
      <AppHeader />

      <SearchFilters value={filters} isLoading={isPending} onChange={setFilters} onSubmit={handleSearch} onReset={handleReset} />

      {results.length > 0 && !isPending ? (
        <ResultsToolbar
          total={visibleResults.length}
          onlyWithWebsite={onlyWithWebsite}
          onlyWithEmail={onlyWithEmail}
          onToggleWebsite={() => setOnlyWithWebsite((value) => !value)}
          onToggleEmail={() => setOnlyWithEmail((value) => !value)}
          onExportCsv={handleExportCsv}
        />
      ) : null}

      {isPending ? <LoadingState /> : null}
      {!isPending && error ? <ErrorState message={error} /> : null}
      {!isPending && !error && results.length > 0 ? <CompaniesTable companies={visibleResults} /> : null}
      {!isPending && !error && results.length === 0 ? <EmptyState hasSearched={hasSearched} /> : null}
    </main>
  );
}
