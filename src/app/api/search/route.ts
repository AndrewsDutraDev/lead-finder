import { NextResponse } from "next/server";
import { z } from "zod";
import { processSearchResults } from "@/services/search/process-search-results";
import { BRAZIL_COUNTRY_CODE } from "@/lib/constants";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const searchSchema = z.object({
  niche: z.string().trim().min(2, "Informe um nicho com pelo menos 2 caracteres."),
  country: z.literal(BRAZIL_COUNTRY_CODE),
  state: z.string().trim().min(2).optional().nullable(),
  city: z.string().trim().min(2).optional().nullable()
});

export async function POST(request: Request) {
  const startedAt = Date.now();

  try {
    console.info("[api/search] request received", {
      hasBrowserlessToken: Boolean(process.env.BROWSERLESS_TOKEN?.trim()),
      hasBrowserlessApiKey: Boolean(process.env.BROWSERLESS_API_KEY?.trim()),
      hasBrowserlessWSEndpoint: Boolean(process.env.BROWSERLESS_WS_ENDPOINT?.trim()),
      browserlessUrl: process.env.BROWSERLESS_URL?.trim() || null,
      skipBrowserDownload: process.env.PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD === "1",
      vercel: process.env.VERCEL === "1"
    });

    const body = await request.json();
    const parsed = searchSchema.parse(body);
    const data = await processSearchResults(parsed);

    return NextResponse.json({
      results: data.results,
      meta: {
        total: data.results.length,
        durationMs: Date.now() - startedAt,
        providers: data.providers,
        expandedTerms: data.expandedTerms,
        searchQueries: data.searchQueries,
        query: parsed,
        diagnostics: data.diagnostics
      }
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          error: error.issues[0]?.message ?? "Os filtros informados são inválidos."
        },
        { status: 400 }
      );
    }

    console.error("[api/search] unexpected error", error);

    return NextResponse.json(
      {
        error: "Não foi possível concluir o scraping no momento. Tente novamente em instantes."
      },
      { status: 500 }
    );
  }
}
