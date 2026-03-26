export function formatField(value: string | null | undefined, fallback: string) {
  return value?.trim() ? value : fallback;
}

export function formatPhoneDisplay(phone: string | null | undefined) {
  return formatField(phone, "Não informado");
}

export function formatWebsiteDisplay(websiteUrl: string | null | undefined) {
  return formatField(websiteUrl, "Não possui");
}

export function formatEmailDisplay(email: string | null | undefined) {
  return formatField(email, "Não informado");
}
