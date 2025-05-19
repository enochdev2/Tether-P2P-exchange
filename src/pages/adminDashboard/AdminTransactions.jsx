import React from "react";
import { Link } from "react-router-dom";

const AdminTransactions = () => {
  return (
    <div className="bg-gray-100 min-h-screen p-8">
      <h1 className="text-3xl font-bold mb-6">Transaction Management</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold">All Transactions</h2>
        <table className="min-w-full mt-4 table-auto">
          <thead>
            <tr>
              <th className="px-4 py-2 border-b">Transaction ID</th>
              <th className="px-4 py-2 border-b">Buyer</th>
              <th className="px-4 py-2 border-b">Seller</th>
              <th className="px-4 py-2 border-b">Amount</th>
              <th className="px-4 py-2 border-b">Status</th>
              <th className="px-4 py-2 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="px-4 py-2 border-b">TX12345</td>
              <td className="px-4 py-2 border-b">Buyer1</td>
              <td className="px-4 py-2 border-b">Seller1</td>
              <td className="px-4 py-2 border-b">350 USDT</td>
              <td className="px-4 py-2 border-b text-green-600">Completed</td>
              <td className="px-4 py-2 border-b">
                <button className="text-blue-600 hover:underline">
                  View Details
                </button>
              </td>
            </tr>
            <tr>
              <td className="px-4 py-2 border-b">TX12346</td>
              <td className="px-4 py-2 border-b">Buyer2</td>
              <td className="px-4 py-2 border-b">Seller2</td>
              <td className="px-4 py-2 border-b">500,000 KRW</td>
              <td className="px-4 py-2 border-b text-yellow-600">Pending</td>
              <td className="px-4 py-2 border-b">
                <button className="text-blue-600 hover:underline">
                  <Link
                    to="/admin/transaction/1"
                    className="block text-white hover:bg-blue-700 p-2 rounded-md"
                  >
                    View Details
                  </Link>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminTransactions;
