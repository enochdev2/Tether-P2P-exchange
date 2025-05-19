import React from 'react';

function TransactionOverview() {
  return (
    <div>
      <h3 className="text-xl font-semibold">Transaction Overview</h3>
      <div className="mt-4">
        <h4 className="text-lg font-medium">Active Transactions</h4>
        <p>Transaction 1: Pending</p>
        <p>Transaction 2: In Progress</p>

        <h4 className="text-lg font-medium mt-6">Completed Transactions</h4>
        <p>Transaction 1: Completed</p>
      </div>
    </div>
  );
}

export default TransactionOverview;
