import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const CustomBarChart = ({ title, data, xDataKey, bars }) => (
  <div className="bg-white p-4 rounded-lg shadow-md">
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    {data.length > 0 ? (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <XAxis dataKey={xDataKey} />
          <YAxis />
          <Tooltip />
          {bars.map((bar, index) => (
            <Bar key={index} dataKey={bar.dataKey} fill={bar.fill} name={bar.name} />
          ))}
        </BarChart>
      </ResponsiveContainer>
    ) : (
      <p className="text-gray-500">No data available</p>
    )}
  </div>
);
export default CustomBarChart;
