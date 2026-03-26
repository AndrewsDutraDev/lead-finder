import type { Company, RawCompany, SearchRequest } from "@/types/company";
import { cleanText } from "@/services/normalizer/clean-text";
import { normalizeAddress } from "@/services/normalizer/normalize-address";
import { normalizeEmail } from "@/services/normalizer/normalize-email";
import { normalizePhone } from "@/services/normalizer/normalize-phone";
import { normalizeUrl } from "@/services/normalizer/normalize-url";
import { createCompanyId } from "@/services/normalizer/utils";

export function normalizeCompany(rawCompany: RawCompany, query: SearchRequest): Company | null {
  const name = cleanText(rawCompany.name);
  if (!name) return null;

  const city = cleanText(rawCompany.city) ?? cleanText(query.city) ?? null;
  const state = cleanText(rawCompany.state) ?? cleanText(query.state) ?? null;
  const country = cleanText(rawCompany.country) ?? "Brasil";
  const niche = cleanText(rawCompany.niche) ?? query.niche;
  const websiteUrl = normalizeUrl(rawCompany.websiteUrl);
  const phone = normalizePhone(rawCompany.phone);
  const email = normalizeEmail(rawCompany.email);
  const address = normalizeAddress(rawCompany.address);

  return {
    id: createCompanyId(name, city, phone, websiteUrl),
    name,
    niche,
    score: 0,
    hasWebsite: Boolean(websiteUrl),
    websiteUrl,
    phone,
    email,
    address,
    city,
    state,
    country,
    source: rawCompany.source
  };
}
