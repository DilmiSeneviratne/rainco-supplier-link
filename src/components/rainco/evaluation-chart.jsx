import { useState } from "react";
import { CartesianGrid, ResponsiveContainer, Scatter, ScatterChart, Tooltip, XAxis, YAxis, ZAxis, } from "recharts";
import { AccessNotice, PageHeading, useWorkspace } from "./workspace";
import { Field } from "./registration";
function EvaluationBubbleChartCanvas({ chartData }) {
    return (<div className="rounded-lg border border-neutral-700 p-4 pt-6 pb-4 shadow-inner" style={{
            background: "radial-gradient(circle at 50% 45%, #4b4b4b 0%, #2b2b2b 100%)",
        }}>
      <div className="h-[440px] w-full">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={{ top: 28, right: 44, bottom: 38, left: 28 }}>
            <defs>
              <radialGradient id="bubbleGradA" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#bef264"/>
                <stop offset="55%" stopColor="#4d7c0f"/>
                <stop offset="100%" stopColor="#1a2e05"/>
              </radialGradient>
              <radialGradient id="bubbleGradB" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#d9f99d"/>
                <stop offset="55%" stopColor="#65a30d"/>
                <stop offset="100%" stopColor="#365314"/>
              </radialGradient>
              <radialGradient id="bubbleGradC" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#fef08a"/>
                <stop offset="55%" stopColor="#ca8a04"/>
                <stop offset="100%" stopColor="#713f12"/>
              </radialGradient>
              <radialGradient id="bubbleGradD" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#fca5a5"/>
                <stop offset="55%" stopColor="#dc2626"/>
                <stop offset="100%" stopColor="#7f1d1d"/>
              </radialGradient>
              <radialGradient id="bubbleGradE" cx="35%" cy="30%" r="65%">
                <stop offset="0%" stopColor="#9ca3af"/>
                <stop offset="55%" stopColor="#374151"/>
                <stop offset="100%" stopColor="#111827"/>
              </radialGradient>
              <filter id="bubbleShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="4" floodOpacity="0.55"/>
              </filter>
            </defs>

            <CartesianGrid stroke="#6b7280" strokeOpacity={0.45}/>

            <XAxis type="number" dataKey="desirabilityScore" name="Desirability Score" domain={[0, 100]} tickCount={8} stroke="#9ca3af" tick={{ fill: "#d1d5db", fontSize: 11 }} label={{
            value: "DESIRABILITY SCORE",
            position: "bottom",
            offset: 14,
            fill: "#d1d5db",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.06em",
        }}/>

            <YAxis type="number" dataKey="feasibilityScore" name="Feasibility Score" domain={[0, 100]} tickCount={7} stroke="#9ca3af" tick={{ fill: "#d1d5db", fontSize: 11 }} label={{
            value: "FEASIBILITY SCORE",
            angle: -90,
            position: "insideLeft",
            offset: 4,
            fill: "#d1d5db",
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: "0.06em",
        }}/>

            <ZAxis type="number" dataKey="bubbleSize" range={[2200, 6500]} name="Rating"/>

            <Tooltip cursor={{ strokeDasharray: "3 3", stroke: "#9ca3af" }} content={({ active, payload }) => {
            if (!active || !payload || payload.length === 0)
                return null;
            const item = payload[0].payload;
            return (<div className="rounded-md border border-neutral-600 bg-neutral-900/95 text-neutral-100 p-3 shadow-xl text-xs space-y-1">
                    <div className="font-semibold text-white">
                      <span className="font-mono text-lime-400">{item.supplierCode}</span> ·{" "}
                      {item.supplierName}
                    </div>
                    <div className="font-mono text-neutral-300">
                      Desirability Score:{" "}
                      <strong className="text-white">{item.desirabilityScore}%</strong>
                    </div>
                    <div className="font-mono text-neutral-300">
                      Feasibility Score:{" "}
                      <strong className="text-white">{item.feasibilityScore}%</strong>
                    </div>
                    <div className="font-mono text-neutral-300">
                      Evaluation Results:{" "}
                      <strong className="text-white">{item.evaluationResults}</strong>
                    </div>
                    <div className="font-mono text-neutral-300">
                      Overall Rating:{" "}
                      <strong className="text-lime-400">
                        {item.rating}% (Grade {item.grade})
                      </strong>
                    </div>
                  </div>);
        }}/>

            <Scatter name="Suppliers" data={chartData} shape={(props) => {
            const p = props;
            const cx = p.cx ?? 0;
            const cy = p.cy ?? 0;
            const payload = p.payload;
            if (!payload)
                return <g />;
            const radius = Math.max(28, Math.min(54, Math.round(payload.rating * 0.56)));
            return (<g className="cursor-pointer transition-transform hover:scale-105">
                    <circle cx={cx} cy={cy} r={radius} fill={payload.gradId} stroke="rgba(255,255,255,0.28)" strokeWidth={1.2} filter="url(#bubbleShadow)"/>
                    <text x={cx} y={cy} textAnchor="middle" dominantBaseline="central" fill="#ffffff" fontSize={10} fontWeight={700} style={{
                    textShadow: "0 1px 3px rgba(0,0,0,0.85)",
                    pointerEvents: "none",
                }}>
                      {payload.shortLabel}
                    </text>
                  </g>);
        }}/>
          </ScatterChart>
        </ResponsiveContainer>
      </div>

      <div className="flex items-center justify-center gap-5 pt-2 pb-1 text-xs font-semibold text-neutral-200">
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full inline-block shadow" style={{ background: "radial-gradient(circle at 35% 30%, #bef264, #15803d)" }}/>
          A (&ge;85%)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full inline-block shadow" style={{ background: "radial-gradient(circle at 35% 30%, #d9f99d, #65a30d)" }}/>
          B (70–84%)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full inline-block shadow" style={{ background: "radial-gradient(circle at 35% 30%, #fef08a, #ca8a04)" }}/>
          C (55–69%)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full inline-block shadow" style={{ background: "radial-gradient(circle at 35% 30%, #fca5a5, #dc2626)" }}/>
          D (40–54%)
        </span>
        <span className="inline-flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-full inline-block shadow border border-neutral-500" style={{ background: "radial-gradient(circle at 35% 30%, #6b7280, #111827)" }}/>
          E (&lt;40%)
        </span>
      </div>
    </div>);
}
export function EvaluationChartPage() {
    const { role, suppliersList, evaluations } = useWorkspace();
    const [filterSupplier, setFilterSupplier] = useState("ALL");
    if (role !== "rainco")
        return <AccessNotice audience="rainco"/>;
    const getGradeInfo = (rating) => {
        if (rating >= 85) {
            return { grade: "A", gradId: "url(#bubbleGradA)", color: "#16a34a" };
        }
        if (rating >= 70) {
            return { grade: "B", gradId: "url(#bubbleGradB)", color: "#84cc16" };
        }
        if (rating >= 55) {
            return { grade: "C", gradId: "url(#bubbleGradC)", color: "#eab308" };
        }
        if (rating >= 40) {
            return { grade: "D", gradId: "url(#bubbleGradD)", color: "#ef4444" };
        }
        return { grade: "E", gradId: "url(#bubbleGradE)", color: "#1f2937" };
    };
    const chartData = suppliersList
        .filter((s) => (filterSupplier === "ALL" ? true : s.name === filterSupplier))
        .map((s) => {
        const latestEval = evaluations.find((ev) => ev.supplierName === s.name);
        const feasibility = s.feasibilityScore ?? latestEval?.feasibilityScore ?? s.evaluationPercentage ?? 0;
        const desirability = s.desirabilityScore ?? latestEval?.desirabilityScore ?? s.evaluationPercentage ?? 0;
        const overallRating = s.evaluationPercentage ?? latestEval?.percentage ?? 0;
        const evalResults = s.evaluationMarks !== undefined && s.evaluationScore !== undefined
            ? `${s.evaluationMarks} / ${s.evaluationScore}`
            : latestEval
                ? `${latestEval.totalMarks} / ${latestEval.totalScore}`
                : "Not Evaluated";
        const gradeInfo = getGradeInfo(overallRating);
        const shortName = s.name.length > 18
            ? s.name.split(" ").slice(0, 2).join(" ").toUpperCase()
            : s.name.toUpperCase();
        return {
            supplierCode: s.sapPartnerId,
            supplierName: s.name,
            shortLabel: shortName,
            feasibilityScore: feasibility,
            desirabilityScore: desirability,
            rating: overallRating,
            bubbleSize: Math.max(35, overallRating),
            grade: gradeInfo.grade,
            gradId: gradeInfo.gradId,
            color: gradeInfo.color,
            evaluationResults: evalResults,
        };
    });
    return (<>
      <PageHeading eyebrow="RAINCO PROCUREMENT" title="Evaluation Chart"/>

      <div className="rounded-lg border border-border bg-card p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-3 border-b border-border">
          <div>
            <h2 className="text-sm font-semibold text-foreground">Supplier Evaluation Chart</h2>
          </div>
          <div className="w-full sm:w-72">
            <Field label="Filter by Supplier">
              <select value={filterSupplier} onChange={(e) => setFilterSupplier(e.target.value)}>
                <option value="ALL">All Suppliers</option>
                {suppliersList.map((s) => (<option key={s.sapPartnerId} value={s.name}>
                    {s.sapPartnerId} · {s.name}
                  </option>))}
              </select>
            </Field>
          </div>
        </div>

        <EvaluationBubbleChartCanvas chartData={chartData}/>
      </div>
    </>);
}
