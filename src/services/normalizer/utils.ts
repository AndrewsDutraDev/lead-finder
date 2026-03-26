export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function createCompanyId(
  name: string,
  city: string | null | undefined,
  phone: string | null | undefined,
  websiteUrl: string | null | undefined
) {
  return (
    [name, city, phone, websiteUrl]
      .filter((value): value is string => Boolean(value))
      .map(slugify)
      .join("-") || slugify(name)
  );
}
