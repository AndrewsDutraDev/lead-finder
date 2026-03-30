import type { SearchRequest, SearchResponse, SearchStreamEvent } from "@/types/company";

type SearchLeadsOptions = {
  onProgress?: (payload: SearchResponse) => void;
};

export async function searchLeads(input: SearchRequest, options: SearchLeadsOptions = {}) {
  const response = await fetch("/api/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(input)
  });

  if (!response.ok) {
    const payload = (await response.json()) as { error?: string };
    throw new Error("error" in payload && payload.error ? payload.error : "Falha ao buscar leads.");
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error("A resposta do streaming não está disponível.");
  }

  const decoder = new TextDecoder();
  let buffer = "";
  let finalPayload: SearchResponse | null = null;

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }

    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() ?? "";

    for (const line of lines) {
      const trimmedLine = line.trim();
      if (!trimmedLine) {
        continue;
      }

      const event = JSON.parse(trimmedLine) as SearchStreamEvent;

      if (event.type === "progress") {
        const payload = {
          results: event.results,
          meta: event.meta
        } satisfies SearchResponse;
        options.onProgress?.(payload);
        continue;
      }

      if (event.type === "complete") {
        finalPayload = {
          results: event.results,
          meta: event.meta
        } satisfies SearchResponse;
        options.onProgress?.(finalPayload);
        continue;
      }

      if (event.type === "error") {
        throw new Error(event.error || "Falha ao buscar leads.");
      }
    }
  }

  if (!finalPayload) {
    throw new Error("A busca foi encerrada sem resposta final.");
  }

  return finalPayload;
}
