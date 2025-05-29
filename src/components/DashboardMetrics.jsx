import React from "react";

export default function DashboardMetrics({
  users,
  totalSales,
  totalBuys,
  totalFees,
}) {
  // Optional: format numbers with commas
  const fmt = (value) =>
    typeof value === "number" ? new Intl.NumberFormat().format(value) : value;

  return (
    <div className="p-6 bg-gray-100 min-h-screen md:px-20 mx-auto">
      {/* Cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-6">
        {/* Users */}
        <div className="bg-white rounded-lg shadow p-5 flex flex-col">
          <span className="text-sm md:text-lg  font-bold text-gray-900">
            Users
          </span>
          <span className="mt-2 text-2xl font-semibold text-gray-900">
            {fmt(users)}
          </span>
        </div>

        {/* Total Sales */}
        <div className="bg-white rounded-lg shadow p-5 flex flex-col">
          <span className="text-sm md:text-lg  font-bold text-gray-900">
            Total Sales
          </span>
          <span className="mt-2 text-2xl font-semibold text-gray-900">
            {fmt(totalSales)}
          </span>
        </div>

        {/* Total Buys */}
        <div className="bg-white rounded-lg shadow p-5 flex flex-col">
          <span className="text-sm font-bold text-gray-900 md:text-lg">
            Total Buys
          </span>
          <span className="mt-2 text-2xl font-semibold text-gray-900">
            {fmt(totalBuys)}
          </span>
        </div>

        {/* Fees */}
        <div className="bg-white rounded-lg shadow p-5 flex flex-col">
          <span className="text-sm md:text-lg font-bold text-gray-900">
            Fees
          </span>
          <span className="mt-2 text-2xl font-semibold text-gray-900">
            {fmt(totalFees)}
          </span>
        </div>
      </div>
    </div>
  );
}
