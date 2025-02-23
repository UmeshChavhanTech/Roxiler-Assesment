import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaShoppingCart, FaBoxOpen, FaChartLine } from "react-icons/fa";


const Statistics = ({ month }) => {
  const [stats, setStats] = useState({
    totalSales: 0,
    soldItems: 0,
    notSoldItems: 0,
  });



  useEffect(() => {
    axios.get(`http://localhost:5000/api/statistics?month=${month}`)
      .then((response) => {
        setStats(response.data);
      })
      .catch((error) => console.error("Error fetching statistics:", error));
  }, [month]);







  return (

     
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">

    
      {/* Total Sales */}
      <div className="p-6 bg-gradient-to-r from-green-400 to-green-600 text-white rounded-xl shadow-md flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Total Sales</h2>
          <p className="text-2xl font-bold">₨ {stats.totalSales} ₹</p>
        </div>
        <FaChartLine className="text-4xl opacity-75" />
      </div>

      {/* Sold Items */}
      <div className="p-6 bg-gradient-to-r from-blue-400 to-blue-600 text-white rounded-xl shadow-md flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Sold Items</h2>
          <p className="text-2xl font-bold">{stats.soldItems}</p>
        </div>
        <FaShoppingCart className="text-4xl opacity-75" />
      </div>

      {/* Not Sold Items */}
      <div className="p-6 bg-gradient-to-r from-red-400 to-red-600 text-white rounded-xl shadow-md flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold">Not Sold Items</h2>
          <p className="text-2xl font-bold">{stats.notSoldItems}</p>
        </div>
        <FaBoxOpen className="text-4xl opacity-75" />
      </div>
      </div>

    
  );
};

export default Statistics;
