import type { SearchRequest, SearchResponse } from "@/types/company";

export async function searchLeads(input: SearchRequest) {
  const response = await fetch("/api/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  const payload = (await response.json()) as SearchResponse | { error?: string };

  if (!response.ok) {
    throw new Error("error" in payload && payload.error ? payload.error : "Falha ao buscar leads.");
  }

  return payload as SearchResponse;
}
