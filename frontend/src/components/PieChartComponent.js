import React, { useEffect, useState } from "react";
import { PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#AF19FF", "#FF3333", "#FF5733", "#C70039", "#900C3F", "#581845"];

const PieChartComponent = ({ month }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    let apiUrl = "http://localhost:5000/api/pie-chart";
    if (month) {
      apiUrl += `?month=${month}`;
    }

    axios
      .get(apiUrl)
      .then((response) => {
        setChartData(response.data);
      })
      .catch((error) => console.error("Error fetching pie chart data:", error));
  }, [month]);

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-xl mt-6 text-center">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        {month ? `📊 Category-wise Sales for ${month}` : "📊 Overall Category Sales"}
      </h2>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={450}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="itemCount"
              nameKey="category"
              cx="50%" // Center horizontally
              cy="50%" // Center vertically
              outerRadius={150} // Increase size for better spacing
              label={({ name, value }) => `${name}: ${value}`}
              labelLine={false} // Removes connecting lines to labels
              textAnchor="middle"
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
            <Legend layout="horizontal" align="center" verticalAlign="bottom" />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500">No data available</p>
      )}
    </div>
  );
};

export default PieChartComponent;
