type CompanyScoreBadgeProps = {
  score: number;
};

export function CompanyScoreBadge({ score }: CompanyScoreBadgeProps) {
  const tone =
    score >= 80
      ? "bg-mint-100 text-mint-600"
      : score >= 55
        ? "bg-amber-100 text-amber-600"
        : "bg-coral-100 text-coral-600";

  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${tone}`}>{score}/100</span>;
}
