import React from 'react';

const TransactionDetails = () => {
    return (
        <div className="bg-gray-100 min-h-screen p-8">
            <h1 className="text-3xl font-bold mb-6">Transaction Details</h1>
            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Transaction ID: TX12345</h2>
                <div className="space-y-4">
                    <div>
                        <strong>Buyer:</strong> Buyer1
                    </div>
                    <div>
                        <strong>Seller:</strong> Seller1
                    </div>
                    <div>
                        <strong>Amount:</strong> 350 USDT
                    </div>
                    <div>
                        <strong>Status:</strong> Completed
                    </div>
                    <div>
                        <strong>Timestamp:</strong> 2025-05-09 12:34:56
                    </div>
                    <div>
                        <strong>Commission:</strong> 3.5 USDT (1% fee)
                    </div>
                    <button className="text-green-600 hover:underline">Approve Refund</button>
                </div>
            </div>
        </div>
    );
};

export default TransactionDetails;
