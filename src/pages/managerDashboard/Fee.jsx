import React from "react";
import AdminTransactions from "../adminDashboard/AdminTransactions";
// interface Transaction {
//   id: string;
//   user: string;
//   referralCode: string;
//   tetherAmount: number; // in USDT
// }
// interface FeeCategoryProps {
//   transactions: Transaction[];
// }
const users = [
  {
    id: "u1",
    name: "Alice",
    referralCode: "QWET4",
    trades: [
      { id: "t1", type: "buy", amount: 2000 },
      { id: "t2", type: "sell", amount: 3000 },
    ],
  },
  {
    id: "u2",
    name: "Bob",
    referralCode: "QWET4",
    trades: [{ id: "t3", type: "sell", amount: 1500 }],
  },
  {
    id: "u3",
    name: "Charlie",
    referralCode: "XYZ99",
    trades: [{ id: "t4", type: "buy", amount: 5000 }],
  },
];

const Fee = () => {
  const managerCode = "QWET4";

  // Get only users under this manager
  const referredUsers = users.filter((user) => user.referralCode === managerCode);

  // Calculate totals
  const totalManagerFee = referredUsers.reduce((sum, user) => {
    return sum + user.trades.reduce((tSum, trade) => tSum + trade.amount * 0.01, 0);
  }, 0);

  return (
    <div className="bg-white shadow-lg rounded-xl p-6 max-w-3xl w-full mx-auto border border-gray-200">
      {referredUsers.length === 0 ? (
        <p className="text-gray-500">No users registered with this referral code.</p>
      ) : (
        <div className="space-y-8">
          {referredUsers.map((user) => {
            const userFeeTotal = user.trades.reduce((sum, trade) => sum + trade.amount * 0.01, 0);

            return (
              <div key={user.id} className="border rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {user.name} <span className="text-sm text-gray-500">(User ID: {user.id})</span>
                </h3>
                <table className="w-full mt-3 border-collapse">
                  <thead>
                    <tr className="text-left text-gray-600 border-b">
                      <th className="p-2">Trade Type</th>
                      <th className="p-2">Amount (USDT)</th>
                      <th className="p-2">Fee (1%)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {user.trades.map((trade) => (
                      <tr key={trade.id} className="border-b last:border-0">
                        <td className="p-2 capitalize">{trade.type}</td>
                        <td className="p-2">{trade.amount.toLocaleString()}</td>
                        <td className="p-2 text-green-600">
                          {(trade.amount * 0.01).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-semibold border-t">
                      <td className="p-2" colSpan={2}>
                        Total Fee for {user.name}
                      </td>
                      <td className="p-2 text-green-700">{userFeeTotal.toLocaleString()} USDT</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            );
          })}

          {/* Manager's total fee from all referred users */}
          <div className="bg-gray-100 p-4 rounded-lg">
            <p className="text-lg font-bold text-gray-800">
              Total Manager Fee:{" "}
              <span className="text-green-700">{totalManagerFee.toLocaleString()} USDT</span>
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Fee;
