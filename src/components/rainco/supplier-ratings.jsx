import { AccessNotice, PageHeading, useWorkspace } from "./workspace";
const evaluationCriteriaRows = [
  {
    criteria: "Cost — Competitive Price",
    indication: "≤10%",
    score: 10,
    marks: 6,
  },
  {
    criteria: "Cost — Credit Period",
    indication: "120 days",
    score: 10,
    marks: 10,
  },
  {
    criteria: "Quality — Damage %- Incoming Inspection",
    indication: "≤1.5%",
    score: 10,
    marks: 6,
  },
  {
    criteria: "Quality — RM Stores Return Rate %- During the Process",
    indication: "≤0.5%",
    score: 10,
    marks: 10,
  },
  {
    criteria: "Quality — Corrective Actions",
    indication: "1",
    score: 10,
    marks: 8,
  },
  {
    criteria: "Supply — Supply on time (ETD Delay)",
    indication: "3-4 days",
    score: 10,
    marks: 6,
  },
  {
    criteria: "Supply — Ontime quantity (PO vs Delivery)",
    indication: "≤2%",
    score: 10,
    marks: 10,
  },
  {
    criteria: "Supply — Ordering to delivery lead time",
    indication: "L+5",
    score: 10,
    marks: 8,
  },
  {
    criteria: "Supply — Flexiblity to availability",
    indication: "<60%",
    score: 10,
    marks: 0,
  },
  {
    criteria: "Supply — MOQ",
    indication: "M",
    score: 10,
    marks: 10,
  },
];
function SupplierEvaluationScoreBanner({ percentage, totalMarks, totalScore }) {
  return (
    <div className="score-strip">
      <div className="big-score">
        {percentage}
        <small>%</small>
      </div>
      <div>
        <h2>
          Total Performance Score: {totalMarks} / {totalScore} ({percentage}%)
        </h2>
        <p>Performance Scorecard · Date Modified: 30-Apr-2023</p>
      </div>
      <span className="badge ml-auto">Published</span>
    </div>
  );
}
function SupplierEvaluationBreakdownTable({ rows, totalScore, totalMarks }) {
  return (
    <div className="master-table">
      <table className="data-table">
        <thead>
          <tr>
            <th>Criteria &amp; Indication</th>
            <th>Score (Condition)</th>
            <th>Max Weight</th>
            <th>Points (%)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.criteria}>
              <td className="font-medium text-foreground">{row.criteria}</td>
              <td className="font-mono text-xs">{row.indication}</td>
              <td className="font-mono tabular-nums">{row.score}%</td>
              <td className="font-mono tabular-nums text-primary font-semibold">{row.marks}%</td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t-2 border-border bg-muted/40 font-semibold">
            <td className="text-foreground" colSpan={2}>
              Total Performance Score
            </td>
            <td className="font-mono tabular-nums text-foreground">{totalScore}%</td>
            <td className="font-mono tabular-nums text-primary font-bold">{totalMarks}%</td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
export function Ratings() {
  const { role } = useWorkspace();
  if (role !== "supplier") return <AccessNotice audience="supplier" />;
  const totalScore = evaluationCriteriaRows.reduce((acc, r) => acc + r.score, 0);
  const totalMarks = evaluationCriteriaRows.reduce((acc, r) => acc + r.marks, 0);
  const percentage = totalScore > 0 ? Math.round((totalMarks / totalScore) * 100) : 0;
  return (
    <>
      <PageHeading eyebrow="SUPPLIER PORTAL" title="My Evaluation" />
      <SupplierEvaluationScoreBanner
        percentage={percentage}
        totalMarks={totalMarks}
        totalScore={totalScore}
      />
      <SupplierEvaluationBreakdownTable
        rows={evaluationCriteriaRows}
        totalScore={totalScore}
        totalMarks={totalMarks}
      />
    </>
  );
}
