import { CompanyCard } from "@/components/company-card";
import { CompanyScoreBadge } from "@/components/company-score-badge";
import { formatEmailDisplay, formatPhoneDisplay, formatWebsiteDisplay } from "@/lib/formatters";
import type { Company } from "@/types/company";

type CompaniesTableProps = {
  companies: Company[];
};

export function CompaniesTable({ companies }: CompaniesTableProps) {
  return (
    <>
      <div className="hidden overflow-hidden rounded-[28px] border border-white/80 bg-white/85 shadow-soft backdrop-blur lg:block">
        <table className="min-w-full border-collapse text-left">
          <thead className="bg-ink-50/80">
            <tr className="text-xs uppercase tracking-[0.18em] text-ink-500">
              <th className="px-5 py-4 font-medium">Empresa</th>
              <th className="px-5 py-4 font-medium">Score</th>
              <th className="px-5 py-4 font-medium">Categoria</th>
              <th className="px-5 py-4 font-medium">Site</th>
              <th className="px-5 py-4 font-medium">Telefone</th>
              <th className="px-5 py-4 font-medium">Email</th>
              <th className="px-5 py-4 font-medium">Endereço</th>
              <th className="px-5 py-4 font-medium">Local</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((company) => (
              <tr key={company.id} className="border-t border-ink-100 align-top text-sm text-ink-700">
                <td className="px-5 py-4">
                  <div className="min-w-[220px]">
                    <p className="font-semibold text-ink-900">{company.name}</p>
                    <p className="mt-1 text-xs text-ink-400">{company.niche}</p>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <CompanyScoreBadge score={company.score} />
                </td>
                <td className="px-5 py-4">{company.category ?? "Não informado"}</td>
                <td className="px-5 py-4">
                  {company.websiteUrl ? (
                    <a className="break-all text-mint-600 underline-offset-4 hover:underline" href={company.websiteUrl} target="_blank" rel="noreferrer">
                      {company.websiteUrl}
                    </a>
                  ) : (
                    <span>{formatWebsiteDisplay(company.websiteUrl)}</span>
                  )}
                </td>
                <td className="px-5 py-4">{formatPhoneDisplay(company.phone)}</td>
                <td className="px-5 py-4">{formatEmailDisplay(company.email)}</td>
                <td className="px-5 py-4">{company.address ?? "Não informado"}</td>
                <td className="px-5 py-4">
                  {[company.city, company.state, company.country].filter(Boolean).join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-4 lg:hidden">
        {companies.map((company) => (
          <CompanyCard key={company.id} company={company} />
        ))}
      </div>
    </>
  );
}
