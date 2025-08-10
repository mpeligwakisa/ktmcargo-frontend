import {Line, LineChart, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const CustomLineChart = ({ title, data, xDataKey, lines }) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    {data.length > 0 ? (
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey={xDataKey} />
          <YAxis />
          <Tooltip />
          {lines.map((line, index) => (
            <Line key={index} type="monotone" dataKey={line.dataKey} stroke={line.stroke} name={line.name} />
          ))}
        </LineChart>
      </ResponsiveContainer>
    ) : (
      <p className="text-gray-500">No data available</p>
    )}
  </div>
);
export default CustomLineChart;
