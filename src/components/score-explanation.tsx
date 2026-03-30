const scoreItems = [
  { label: "Website", points: "+25", description: "empresa com site válido" },
  { label: "Email", points: "+20", description: "contato comercial identificado" },
  { label: "Telefone", points: "+20", description: "telefone disponível para prospecção" },
  { label: "Endereço", points: "+15", description: "endereço preenchido" },
  { label: "Completude", points: "+10 a +20", description: "mais campos preenchidos elevam a nota final" }
];

export function ScoreExplanation() {
  return (
    <section className="rounded-[30px] border border-white/80 bg-white/85 p-6 shadow-soft backdrop-blur md:p-8">
      <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
        <div>
          <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-slate-600">
            Score
          </span>
          <h2 className="mt-4 text-2xl font-semibold text-slate-900">Como o score é calculado</h2>
          <p className="mt-2 max-w-3xl text-sm leading-7 text-slate-500">
            O score vai de 0 a 100 e mede a qualidade do lead com base na completude dos dados encontrados durante o scraping.
          </p>
        </div>
        <span className="inline-flex w-fit rounded-full border border-success-200 bg-success-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-success-600">
          Score máximo: 100
        </span>
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-5">
        {scoreItems.map((item) => (
          <article key={item.label} className="rounded-[24px] border border-slate-200 bg-gradient-to-b from-white to-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-semibold text-slate-900">{item.label}</h3>
              <span className="rounded-full border border-brand-100 bg-brand-50 px-2.5 py-1 text-xs font-semibold text-brand-700">
                {item.points}
              </span>
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-600">{item.description}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
