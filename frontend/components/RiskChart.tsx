import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";

type Props = {
  risks: string[];
};

const RISK_BUCKETS: { id: string; label: string; keywords: string[] }[] = [
  {
    id: "privacy",
    label: "Privacy & Surveillance",
    keywords: ["privacy", "surveillance", "data", "tracking", "monitoring"]
  },
  {
    id: "civil",
    label: "Civil Liberties",
    keywords: ["speech", "expression", "assembly", "censorship", "ban"]
  },
  {
    id: "due_process",
    label: "Due Process",
    keywords: ["detention", "warrant", "appeal", "trial", "court"]
  },
  {
    id: "discrimination",
    label: "Discrimination",
    keywords: ["protected", "race", "religion", "gender", "minority"]
  },
  {
    id: "powers",
    label: "Powers & Oversight",
    keywords: ["emergency", "executive", "agency", "regulator", "national security"]
  }
];

export function RiskChart({ risks }: Props) {
  const data = RISK_BUCKETS.map((bucket) => {
    const count = risks.reduce((acc, risk) => {
      const lower = risk.toLowerCase();
      if (bucket.keywords.some((k) => lower.includes(k))) {
        return acc + 1;
      }
      return acc;
    }, 0);
    return { name: bucket.label, value: count };
  });

  const max = data.reduce((m, d) => Math.max(m, d.value), 0);
  const hasSignal = max > 0;

  return (
    <div className="h-60">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(255,255,255,0.08)"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 10 }}
          />
          <YAxis
            allowDecimals={false}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "rgba(255,255,255,0.6)", fontSize: 10 }}
          />
          <Tooltip
            cursor={{ fill: "rgba(255,255,255,0.04)" }}
            contentStyle={{
              backgroundColor: "rgba(10,10,10,0.96)",
              borderRadius: 12,
              border: "1px solid rgba(255,255,255,0.12)",
              padding: "8px 10px"
            }}
            labelStyle={{ color: "rgba(255,255,255,0.8)", fontSize: 11 }}
            itemStyle={{ color: "rgba(255,255,255,0.8)", fontSize: 11 }}
          />
          <Bar
            dataKey="value"
            radius={[6, 6, 0, 0]}
            fill={hasSignal ? "#E10600" : "rgba(255,255,255,0.26)"}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

