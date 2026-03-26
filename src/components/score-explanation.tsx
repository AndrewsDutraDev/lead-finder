const scoreItems = [
  { label: "Website", points: "+25", description: "empresa com site válido" },
  { label: "Email", points: "+20", description: "contato comercial identificado" },
  { label: "Telefone", points: "+20", description: "telefone disponível para prospecção" },
  { label: "Endereço", points: "+15", description: "endereço preenchido" },
  { label: "Completude", points: "+10 a +20", description: "mais campos preenchidos elevam a nota final" }
];

export function ScoreExplanation() {
  return (
    <section className="rounded-[28px] border border-white/80 bg-white/80 p-6 shadow-soft backdrop-blur md:p-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-xl font-semibold text-ink-900">Como o score é calculado</h2>
          <p className="mt-1 max-w-3xl text-sm leading-7 text-ink-500">
            O score vai de 0 a 100 e mede a qualidade do lead com base na completude dos dados encontrados durante o scraping.
          </p>
        </div>
        <span className="inline-flex w-fit rounded-full bg-ink-50 px-3 py-1 text-xs font-medium uppercase tracking-[0.18em] text-ink-500">
          Score máximo: 100
        </span>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        {scoreItems.map((item) => (
          <article key={item.label} className="rounded-2xl border border-ink-100 bg-ink-50/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-ink-900">{item.label}</h3>
              <span className="rounded-full bg-mint-100 px-2.5 py-1 text-xs font-semibold text-mint-600">
                {item.points}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-ink-600">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
