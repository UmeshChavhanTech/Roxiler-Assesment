import React, { useEffect, useState } from "react";
import axios from "axios";
import TransactionsTable from "./components/TransactionsTable";
import Statistics from "./components/Statistics";
import PieChartComponent from "./components/PieChartComponent";
import BarChartComponent from "./components/BarChartComponent";

const App = () => {
  const [transactions, setTransactions] = useState([]);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedMonth, setSelectedMonth] = useState("");
  const [showPieChart, setShowPieChart] = useState(false);
  const [showBarChart, setShowBarChart] = useState(false);

  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    if (selectedMonth) {
      axios
        .get(`http://localhost:5000/api/transactions?month=${selectedMonth}`)
        .then((response) => {
          setTransactions(response.data.transactions);
        })
        .catch((error) => console.error("Error fetching data:", error));
    }
  }, [selectedMonth]);

  useEffect(() => {
    axios
      .get(
        `http://localhost:5000/api/transactions?page=${currentPage}&perPage=5`
      )
      .then((response) => {
        setTransactions(response.data.transactions); // Make sure your backend returns { transactions, total }
        setTotalPages(Math.ceil(response.data.total / 5)); // Calculate total pages
      })
      .catch((error) => console.error("Error fetching transactions:", error));
  }, [currentPage]);

  return (
    <div className="container mx-auto p-4 bg-gradient-to-r from-blue-500 to-teal-500">
      <h1 className="text-4xl font-extrabold text-white my-3 tracking-wide p-4 rounded-lg shadow-lg bg-gradient-to-r from-purple-600 via-pink-500 to-red-500">
        Transactions Dashboard
      </h1>

      <div className="mb-6">
        <label className="block text-lg font-semibold text-white mb-2">
          Choose month-wise data:
        </label>
        <select
          className="p-3 bg-gray-800 text-white border border-gray-400 rounded-lg shadow-md focus:outline-none focus:ring-2 focus:ring-indigo-600"
          onChange={(e) => setSelectedMonth(e.target.value)}
          value={selectedMonth}
        >
          <option value="" className="text-gray-400">
            Select Month
          </option>
          {months.map((month) => (
            <option key={month} value={month} className="bg-gray-700">
              {month}
            </option>
          ))}
        </select>
      </div>

      <Statistics month={selectedMonth} />

      {/* Styled Toggle Buttons */}
      <div className="flex justify-center space-x-4 mt-4 mb-6 bg-white p-4 border border-black">
        <button
          onClick={() => setShowPieChart(!showPieChart)}
          className={`px-6 py-2 rounded-lg font-semibold text-white transition ${
            showPieChart
              ? "bg-red-500 hover:bg-red-600"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
        >
          {showPieChart ? "Hide Pie Chart" : "Show Pie Chart"}
        </button>

        <button
          onClick={() => setShowBarChart(!showBarChart)}
          className={`px-6 py-2 rounded-lg font-semibold text-white transition ${
            showBarChart
              ? "bg-red-500 hover:bg-red-600"
              : "bg-green-500 hover:bg-green-600"
          }`}
        >
          {showBarChart ? "Hide Bar Chart" : "Show Bar Chart"}
        </button>
      </div>
      {/* Conditionally Render Pie Chart */}
      {showPieChart && <PieChartComponent month={selectedMonth} />}

      {/* Conditionally Render Bar Chart */}
      {showBarChart && <BarChartComponent month={selectedMonth} />}
      <TransactionsTable
        transactions={transactions}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
};

export default App;
