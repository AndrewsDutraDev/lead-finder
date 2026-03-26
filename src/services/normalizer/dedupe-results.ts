import type { Company } from "@/types/company";
import { slugify } from "@/services/normalizer/utils";

function dedupeKey(company: Company) {
  const normalizedName = slugify(company.name);
  const normalizedCity = slugify(company.city ?? "");
  const normalizedPhone = company.phone?.replace(/\D/g, "") ?? "";
  const normalizedSite = company.websiteUrl ? slugify(company.websiteUrl) : "";
  const normalizedAddress = company.address ? slugify(company.address) : "";

  return [
    `${normalizedName}:${normalizedCity}`,
    normalizedPhone ? `${normalizedName}:${normalizedPhone}` : "",
    normalizedSite ? `${normalizedName}:${normalizedSite}` : "",
    normalizedAddress ? `${normalizedName}:${normalizedAddress}` : ""
  ].filter(Boolean);
}

function pickPreferredValue(current: string | null, incoming: string | null) {
  if (!current) return incoming;
  if (!incoming) return current;

  return incoming.length > current.length ? incoming : current;
}

function mergeCompanies(current: Company, incoming: Company): Company {
  const mergedWebsite = current.websiteUrl ?? incoming.websiteUrl;
  const mergedSource = Array.from(
    new Set(
      `${current.source},${incoming.source}`
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    )
  ).join(", ");

  return {
    ...current,
    id: current.id,
    category: pickPreferredValue(current.category, incoming.category),
    description: pickPreferredValue(current.description, incoming.description),
    matchedSearchTerm: pickPreferredValue(current.matchedSearchTerm, incoming.matchedSearchTerm),
    websiteUrl: mergedWebsite,
    hasWebsite: Boolean(mergedWebsite),
    phone: pickPreferredValue(current.phone, incoming.phone),
    email: pickPreferredValue(current.email, incoming.email),
    address: pickPreferredValue(current.address, incoming.address),
    city: pickPreferredValue(current.city, incoming.city),
    state: pickPreferredValue(current.state, incoming.state),
    country: pickPreferredValue(current.country, incoming.country) ?? current.country,
    source: mergedSource
  };
}

export function dedupeResults(companies: Company[]) {
  const mergedResults: Company[] = [];
  const lookup = new Map<string, Company>();

  companies.forEach((company) => {
    const keys = dedupeKey(company);
    const existing = keys.map((key) => lookup.get(key)).find(Boolean);

    if (!existing) {
      mergedResults.push(company);
      keys.forEach((key) => lookup.set(key, company));
      return;
    }

    const merged = mergeCompanies(existing, company);
    Object.assign(existing, merged);
    dedupeKey(existing).forEach((key) => lookup.set(key, existing));
  });

  return mergedResults;
}
