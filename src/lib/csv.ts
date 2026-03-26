import type { Company } from "@/types/company";

const columns = [
  "Nome da empresa",
  "Aderencia ao nicho",
  "Score",
  "Possui site",
  "Link do site",
  "Categoria",
  "Telefone",
  "Email",
  "Endereço",
  "Cidade",
  "Estado",
  "País",
  "Nicho"
];

function escapeCsv(value: string | number | boolean | null | undefined) {
  const normalized = value == null ? "" : String(value);
  return `"${normalized.replace(/"/g, '""')}"`;
}

export function companiesToCsv(companies: Company[]) {
  const rows = companies.map((company) =>
    [
      company.name,
      company.nicheRelevanceScore,
      company.score,
      company.hasWebsite ? "Sim" : "Não",
      company.websiteUrl ?? "",
      company.category ?? "",
      company.phone ?? "",
      company.email ?? "",
      company.address ?? "",
      company.city ?? "",
      company.state ?? "",
      company.country,
      company.niche
    ]
      .map(escapeCsv)
      .join(",")
  );

  return [columns.map(escapeCsv).join(","), ...rows].join("\n");
}
