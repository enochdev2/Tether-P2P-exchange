import React, { useEffect, useState } from "react";
import { Bar, Pie } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement } from "chart.js";

// Register chart.js components
ChartJS.register(ArcElement, Tooltip, Legend, CategoryScale, LinearScale, BarElement);

export default function DashboardMetrics({
  users,
  totalSales,
  totalBuys,
  totalFees,
}) {
  const fmt = (value) =>
    typeof value === "number" ? new Intl.NumberFormat().format(value) : value;

  // Metrics Data
  const metrics = [
    { title: "Users", value: users, type: "pie", color: "#26a17b" },
    { title: "Total Sales", value: totalSales, type: "bar", color: "#26a17b" },
    { title: "Total Buys", value: totalBuys, type: "bar", color: "#26a17b" },
    { title: "Fees", value: totalFees, type: "pie", color: "#e74c3c" },
  ];

  // Pie chart data for Users and Fees
  const pieData = (value, color) => ({
    labels: [metrics.title],
    datasets: [
      {
        data: [value, 80000 - value], // The total for users is 2000
        backgroundColor: [color, "#e0e0e0"], // Color and grey background for the remaining part
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  });

  // Bar chart data for Total Sales, Buys, and Fees
  const barData = (value, color) => ({
    labels: ["Metric"],
    datasets: [
      {
        label: "Value",
        data: [value],
        backgroundColor: color,
        borderColor: "#fff",
        borderWidth: 2,
      },
    ],
  });

  // Dynamically animate bar chart
  const barOptions = {
    responsive: true,
    animation: {
      duration: 1500, // Duration for the animation in milliseconds
      easing: "easeOutBounce", // Easing function to make the chart look more dynamic
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 10000, // Adjust step size to scale with your values
        },
      },
    },
  };

  return (
    <div className="w-full  px-4 py-4 bg-white">
      <div className="overflow-x-auto">
        <div className="inline-flex lg:gap-28 md:grid md:grid-cols-2 lg:grid-cols-4 w-max md:w-full">
          {/* Metric Cards with charts */}
          {metrics.map((metric, index) => (
            <div
              key={index}
              className="min-w-[250px] overflow-y-hidden bg-white rounded-lg shadow-lg p-5 flex-shrink-0 flex flex-col items-center text-center hover:scale-105 cursor-pointer transition-all duration-300"
            >
              <span className="text-sm md:text-lg font-bold text-gray-700">
                {metric.title}
              </span>

              {/* Chart Rendering */}
              <div className="mt-4 w-full h-[200px]">
                {metric.type === "pie" ? (
                  <Pie data={pieData(metric.value, metric.color)} options={{ responsive: true }} />
                ) : (
                  <Bar data={barData(metric.value, metric.color)} options={barOptions} />
                )}
              </div>

              {/* Display Number Value */}
              <span className="mt-2 text-3xl font-semibold text-gray-700">
                {fmt(metric.value)}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
