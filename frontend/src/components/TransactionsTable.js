import React, { useState } from "react";

const TransactionsTable = ({ transactions, totalPages, onPageChange }) => {
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
      onPageChange(newPage);
    }
  };

  return (
    <div className=" p-8 rounded-lg shadow-2xl mt-3">
      <h2 className="text-3xl font-extrabold text-white text-center mb-6 tracking-wide">
        Transactions Table
      </h2>
      <hr/>
      <div className="overflow-x-auto mt-2 bg-white">
        <table className="w-full text-sm text-dark rounded-lg shadow-lg border border-dark-500">
          <thead className="bg-gray-800 text-white">
            <tr>
              <th className="p-3">ID</th>
              <th className="p-3 w-12 h-12">Image</th>
              <th className="p-3">Title</th>
              <th className="p-3">Category</th>
              <th className="p-3">Price</th>
              <th className="p-3">Description</th>
              <th className="p-3">Sold</th>
              <th className="p-3">Date of Sale</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <tr
                  key={index}
                  className="text-center transition duration-300 ease-in-out hover:bg-gray-300 border border-dark-400"
                >
                  <td className="p-3">{transaction.id}</td>
                  <td className="p-2 w-13 h-12">
                    <img
                      src={transaction.image}
                      alt={transaction.title}
                      className="object-cover mx-auto rounded-lg shadow"
                    />
                  </td>
                  <td className="p-3">{transaction.title}</td>
                  <td className="p-3">{transaction.category}</td>
                  <td className="p-3 text-green-400 font-semibold">
                    ${transaction.price.toFixed(2)}
                  </td>
                  <td className="p-3 text-dark-300">{transaction.description}</td>
                  <td
                    className={`p-3 font-semibold ${
                      transaction.sold ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {transaction.sold ? "✅ Sold" : "❌ Not Sold"}
                  </td>
                  <td className="p-3">
                    {new Date(transaction.dateOfSale).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-center text-gray-500 p-4 border border-dark-500">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex justify-between items-center mt-6">
        <button
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:bg-gradient-to-l transition duration-300"
          disabled={currentPage === 1}
          onClick={() => handlePageChange(currentPage - 1)}
        >
          ⬅ Previous
        </button>
        <span className="text-lg font-semibold text-white">
          Page {currentPage} of {totalPages}
        </span>
        <button
          className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:bg-gradient-to-l transition duration-300"
          disabled={currentPage === totalPages}
          onClick={() => handlePageChange(currentPage + 1)}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default TransactionsTable;
