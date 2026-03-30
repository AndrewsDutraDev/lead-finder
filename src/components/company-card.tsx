import { CompanyScoreBadge } from "@/components/company-score-badge";
import { formatEmailDisplay, formatPhoneDisplay, formatWebsiteDisplay } from "@/lib/formatters";
import type { Company } from "@/types/company";

type CompanyCardProps = {
  company: Company;
};

export function CompanyCard({ company }: CompanyCardProps) {
  return (
    <article className="rounded-[26px] border border-slate-200 bg-white/95 p-5 shadow-soft">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{company.name}</h3>
          <p className="mt-1 text-sm text-slate-500">
            {company.city ?? "Cidade não informada"}
            {company.state ? `, ${company.state}` : ""}
          </p>
        </div>
        <CompanyScoreBadge score={company.score} />
      </div>

      <dl className="mt-5 grid gap-3 text-sm">
        <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
          <dt className="text-slate-400">Nicho</dt>
          <dd className="mt-1 text-slate-700">{company.niche}</dd>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
          <dt className="text-slate-400">Categoria</dt>
          <dd className="mt-1 text-slate-700">{company.category ?? "Não informado"}</dd>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
          <dt className="text-slate-400">Site</dt>
          <dd className="mt-1 break-all text-slate-700">{formatWebsiteDisplay(company.websiteUrl)}</dd>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
          <dt className="text-slate-400">Telefone</dt>
          <dd className="mt-1 text-slate-700">{formatPhoneDisplay(company.phone)}</dd>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
          <dt className="text-slate-400">Email</dt>
          <dd className="mt-1 break-all text-slate-700">{formatEmailDisplay(company.email)}</dd>
        </div>
        <div className="rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
          <dt className="text-slate-400">Endereço</dt>
          <dd className="mt-1 text-slate-700">{company.address ?? "Não informado"}</dd>
        </div>
      </dl>
    </article>
  );
}
