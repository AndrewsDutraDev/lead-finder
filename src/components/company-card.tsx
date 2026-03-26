import { CompanyScoreBadge } from "@/components/company-score-badge";
import { formatEmailDisplay, formatPhoneDisplay, formatWebsiteDisplay } from "@/lib/formatters";
import type { Company } from "@/types/company";

type CompanyCardProps = {
  company: Company;
};

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <article className="rounded-[24px] border border-ink-100 bg-white p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-ink-900">{company.name}</h3>
          <p className="mt-1 text-sm text-ink-500">
            {company.city ?? "Cidade não informada"}
            {company.state ? `, ${company.state}` : ""}
          </p>
          <p className="mt-2 text-xs uppercase tracking-[0.18em] text-ink-400">{company.source}</p>
        </div>
        <CompanyScoreBadge score={company.score} />
      </div>

      <dl className="mt-4 grid gap-3 text-sm">
        <div>
          <dt className="text-ink-400">Nicho</dt>
          <dd className="mt-1 text-ink-700">{company.niche}</dd>
        </div>
        <div>
          <dt className="text-ink-400">Site</dt>
          <dd className="mt-1 break-all text-ink-700">{formatWebsiteDisplay(company.websiteUrl)}</dd>
        </div>
        <div>
          <dt className="text-ink-400">Telefone</dt>
          <dd className="mt-1 text-ink-700">{formatPhoneDisplay(company.phone)}</dd>
        </div>
        <div>
          <dt className="text-ink-400">Email</dt>
          <dd className="mt-1 break-all text-ink-700">{formatEmailDisplay(company.email)}</dd>
        </div>
        <div>
          <dt className="text-ink-400">Endereço</dt>
          <dd className="mt-1 text-ink-700">{company.address ?? "Não informado"}</dd>
        </div>
      </dl>
    </article>
  );
}
