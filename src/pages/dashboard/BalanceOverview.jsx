import React from 'react';

function BalanceOverview() {
  return (
    <div>
      <h3 className="text-xl font-semibold">Balance Overview</h3>
      <div className="mt-4">
        <p><strong>Current USDT Balance:</strong> 1000 USDT</p>
        <p><strong>KRW Balance:</strong> ₩1,200,000</p>
        <button className="mt-4 bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600">Deposit</button>
        <button className="mt-4 ml-4 bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600">Withdraw</button>
      </div>
    </div>
  );
}

export default BalanceOverview;
