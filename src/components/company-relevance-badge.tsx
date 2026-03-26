type CompanyRelevanceBadgeProps = {
  score: number;
};

export function CompanyRelevanceBadge({ score }: CompanyRelevanceBadgeProps) {
  const tone =
    score >= 75
      ? "bg-mint-100 text-mint-600"
      : score >= 45
        ? "bg-amber-100 text-amber-600"
        : "bg-coral-100 text-coral-600";

  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>
      Aderência {score}/100
    </span>
  );
}
