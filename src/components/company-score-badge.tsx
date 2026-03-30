type CompanyScoreBadgeProps = {
  score: number;
};

export function CompanyScoreBadge({ score }: CompanyScoreBadgeProps) {
  const tone =
    score >= 80
      ? "border-success-200 bg-success-100 text-success-600"
      : score >= 55
        ? "border-warning-100 bg-warning-100 text-warning-600"
        : "border-danger-100 bg-danger-100 text-danger-600";

  return <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${tone}`}>{score}/100</span>;
}
