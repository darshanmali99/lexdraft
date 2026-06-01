import {
  LineChart,
  Line,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";


const data = [

  {
    name: "Mon",
    documents: 12,
  },

  {
    name: "Tue",
    documents: 19,
  },

  {
    name: "Wed",
    documents: 15,
  },

  {
    name: "Thu",
    documents: 27,
  },

  {
    name: "Fri",
    documents: 22,
  },

  {
    name: "Sat",
    documents: 30,
  },

  {
    name: "Sun",
    documents: 18,
  },

];


function AnalyticsChart() {

  return (

    <div className="w-full h-[320px]">

      <ResponsiveContainer
        width="100%"
        height="100%"
      >

        <LineChart data={data}>

          <XAxis
            dataKey="name"
            stroke="#64748b"
            tickLine={false}
            axisLine={false}
          />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="documents"
            stroke="#4f8cff"
            strokeWidth={3}
            dot={false}
          />

        </LineChart>

      </ResponsiveContainer>

    </div>
  );
}

export default AnalyticsChart;  