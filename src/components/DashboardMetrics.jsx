import React from "react";

export default function DashboardMetrics({
  users,
  totalSales,
  totalBuys,
  totalFees,
}) {
  const fmt = (value) =>
    typeof value === "number" ? new Intl.NumberFormat().format(value) : value;

  const metrics = [
    { title: "Users", value: users },
    { title: "Total Sales", value: totalSales },
    { title: "Total Buys", value: totalBuys },
    { title: "Fees", value: totalFees },
  ];

  return (
    <div className="w-full px-4 py-4 bg-gray-50">
      {/* Horizontal scroll wrapper */}
      <div className="overflow-x-auto">
        {/* Inline-flex ensures horizontal scrolling works */}
        <div className="inline-flex gap-4 md:grid md:grid-cols-2 lg:grid-cols-3 w-max md:w-full">
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="min-w-[250px] bg-white rounded-lg shadow p-5 flex-shrink-0 flex flex-col"
            >
              <span className="text-sm md:text-lg font-bold text-gray-900">
                {metric.title}
              </span>
              <span className="mt-2 text-2xl font-semibold text-gray-900">
                {fmt(metric.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
