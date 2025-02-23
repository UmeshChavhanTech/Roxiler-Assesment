import React, { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, Legend, ResponsiveContainer } from "recharts";
import axios from "axios";

const BarChartComponent = ({ month }) => {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    let apiUrl = "http://localhost:5000/api/bar-chart";
    if (month) {
      apiUrl += `?month=${month}`;
    }

    axios
      .get(apiUrl)
      .then((response) => {
        setChartData(response.data);
      })
      .catch((error) => console.error("Error fetching bar chart data:", error));
  }, [month]);

  return (
    <div className="bg-gray-100 p-6 rounded-lg shadow-lg text-center mt-3">
      <h2 className="text-2xl font-semibold text-gray-700 mb-4">
        {month ? `Price Range Sales for ${month}` : "Overall Price Range Sales"}
      </h2>

      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="range" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="itemCount" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <p className="text-gray-500">No data available</p>
      )}
    </div>
  );
};

export default BarChartComponent;
