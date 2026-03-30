import { NextResponse } from "next/server";
import { z } from "zod";
import { processSearchResults } from "@/services/search/process-search-results";
import { BRAZIL_COUNTRY_CODE } from "@/lib/constants";
import type { SearchMeta, SearchResponse, SearchStreamEvent } from "@/types/company";

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
      vercel: process.env.VERCEL === "1"
    });

    const body = await request.json();
    const parsed = searchSchema.parse(body);
    const encoder = new TextEncoder();

    const stream = new ReadableStream({
      start(controller) {
        const send = (event: SearchStreamEvent) => {
          controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));
        };

        const withDuration = (meta: SearchMeta): SearchMeta => ({
          ...meta,
          durationMs: Date.now() - startedAt
        });

        void (async () => {
          try {
            const data = await processSearchResults(parsed, {
              onProgress(payload) {
                send({
                  type: "progress",
                  results: payload.results,
                  meta: withDuration(payload.meta)
                });
              }
            });

            send({
              type: "complete",
              results: data.results,
              meta: withDuration(data.meta)
            });
          } catch (error) {
            const message =
              error instanceof Error
                ? error.message
                : "Não foi possível concluir o scraping no momento. Tente novamente em instantes.";

            send({
              type: "error",
              error: message
            });
          } finally {
            controller.close();
          }
        })();
      }
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive"
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
