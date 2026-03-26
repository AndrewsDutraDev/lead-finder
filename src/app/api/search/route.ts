import { NextResponse } from "next/server";
import { z } from "zod";
import { processSearchResults } from "@/services/search/process-search-results";
import { BRAZIL_COUNTRY_CODE } from "@/lib/constants";

const searchSchema = z.object({
  niche: z.string().trim().min(2, "Informe um nicho com pelo menos 2 caracteres."),
  country: z.literal(BRAZIL_COUNTRY_CODE),
  state: z.string().trim().min(2).optional().nullable(),
  city: z.string().trim().min(2).optional().nullable()
});

export async function POST(request: Request) {
  const startedAt = Date.now();

  try {
    const body = await request.json();
    const parsed = searchSchema.parse(body);
    const data = await processSearchResults(parsed);

    return NextResponse.json({
      results: data.results,
      meta: {
        total: data.results.length,
        durationMs: Date.now() - startedAt,
        providers: data.providers,
        query: parsed
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
