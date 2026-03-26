import type { Company } from "@/types/company";
import { slugify } from "@/services/normalizer/utils";

function dedupeKey(company: Company) {
  const normalizedName = slugify(company.name);
  const normalizedCity = slugify(company.city ?? "");
  const normalizedPhone = company.phone?.replace(/\D/g, "") ?? "";
  const normalizedSite = company.websiteUrl ? slugify(company.websiteUrl) : "";

  return [
    `${normalizedName}:${normalizedCity}`,
    normalizedPhone ? `${normalizedName}:${normalizedPhone}` : "",
    normalizedSite ? `${normalizedName}:${normalizedSite}` : ""
  ].filter(Boolean);
}

export function dedupeResults(companies: Company[]) {
  const seen = new Set<string>();

  return companies.filter((company) => {
    const keys = dedupeKey(company);
    const isDuplicate = keys.some((key) => seen.has(key));

    if (!isDuplicate) {
      keys.forEach((key) => seen.add(key));
      return true;
    }

    return false;
  });
}
