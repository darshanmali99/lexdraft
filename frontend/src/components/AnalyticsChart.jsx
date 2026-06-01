import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from "recharts";

const data = [
  { name: "Mon", documents: 12 },
  { name: "Tue", documents: 19 },
  { name: "Wed", documents: 15 },
  { name: "Thu", documents: 27 },
  { name: "Fri", documents: 22 },
  { name: "Sat", documents: 30 },
  { name: "Sun", documents: 18 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div
        style={{
          background: "rgba(13,17,23,0.95)",
          border: "1px solid rgba(79,140,255,0.25)",
          borderRadius: "12px",
          padding: "10px 14px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
        }}
      >
        <p style={{ fontSize: "11px", color: "#8b9ab3", marginBottom: "4px", fontWeight: "600" }}>
          {label}
        </p>
        <p style={{ fontSize: "18px", fontWeight: "800", color: "#4f8cff", letterSpacing: "-0.03em" }}>
          {payload[0].value}
        </p>
        <p style={{ fontSize: "10px", color: "#4b5a72", marginTop: "2px" }}>documents</p>
      </div>
    );
  }
  return null;
};

function AnalyticsChart() {
  return (
    <div style={{ width: "100%", height: "280px" }}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 5, right: 5, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="accentGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4f8cff" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#4f8cff" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid
            stroke="rgba(255,255,255,0.04)"
            strokeDasharray="0"
            vertical={false}
          />
          <XAxis
            dataKey="name"
            stroke="#4b5a72"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fontFamily: "Inter" }}
          />
          <YAxis
            stroke="#4b5a72"
            tickLine={false}
            axisLine={false}
            tick={{ fontSize: 12, fontFamily: "Inter" }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ stroke: "rgba(79,140,255,0.2)", strokeWidth: 1 }} />
          <Area
            type="monotone"
            dataKey="documents"
            stroke="#4f8cff"
            strokeWidth={2.5}
            fill="url(#accentGrad)"
            dot={false}
            activeDot={{ r: 5, fill: "#4f8cff", strokeWidth: 2, stroke: "#fff" }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}

export default AnalyticsChart;