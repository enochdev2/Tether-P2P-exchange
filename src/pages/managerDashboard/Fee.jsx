import React, { useState } from "react";
import { useTranslation } from "react-i18next";

const dummyData = [
  { referral: "QWET4", nickname: "User234", amount: 714.28, buyer: "User111", fee: 7.1428 },
  { referral: "QWET4", nickname: "User213", amount: 714.28, buyer: "User212", fee: 7.1428 },
  { referral: "QWET4", nickname: "User314", amount: 714.28, buyer: "User313", fee: 7.1428 },
  { referral: "QWET4", nickname: "User413", amount: 714.28, buyer: "User414", fee: 7.1428 },
  { referral: "QWET4", nickname: "User523", amount: 714.28, buyer: "User155", fee: 7.1428 },
  { referral: "QWET4", nickname: "User623", amount: 714.28, buyer: "User616", fee: 7.1428 },
  { referral: "QWET4", nickname: "User623", amount: 714.28, buyer: "User617", fee: 7.1428 },
  { referral: "QWET4", nickname: "User223", amount: 714.28, buyer: "User128", fee: 7.1428 },
  { referral: "QWET4", nickname: "User123", amount: 714.28, buyer: "User119", fee: 7.1428 },
  { referral: "QWET4", nickname: "User823", amount: 714.28, buyer: "User108", fee: 7.1428 },
  { referral: "QWET4", nickname: "User142", amount: 714.28, buyer: "User294", fee: 7.1428 },
  { referral: "QWET4", nickname: "User823", amount: 714.28, buyer: "User108", fee: 7.1428 },
  { referral: "QWET4", nickname: "User142", amount: 714.28, buyer: "User294", fee: 7.1428 },
  { referral: "QWET4", nickname: "User823", amount: 714.28, buyer: "User108", fee: 7.1428 },
  { referral: "QWET4", nickname: "User142", amount: 714.28, buyer: "User294", fee: 7.1428 },
  { referral: "QWET4", nickname: "User823", amount: 714.28, buyer: "User108", fee: 7.1428 },
  { referral: "QWET4", nickname: "User142", amount: 714.28, buyer: "User294", fee: 7.1428 },
  { referral: "QWET4", nickname: "User823", amount: 714.28, buyer: "User108", fee: 7.1428 },
  { referral: "QWET4", nickname: "User142", amount: 714.28, buyer: "User294", fee: 7.1428 },
  { referral: "QWET4", nickname: "User823", amount: 714.28, buyer: "User108", fee: 7.1428 },
  { referral: "QWET4", nickname: "User142", amount: 714.28, buyer: "User294", fee: 7.1428 },
  { referral: "QWET4", nickname: "User823", amount: 714.28, buyer: "User108", fee: 7.1428 },
  { referral: "QWET4", nickname: "User142", amount: 714.28, buyer: "User294", fee: 7.1428 },
];
export default function Fee() {
  const { t } = useTranslation();
  const [selected, setSelected] = useState("Total Tether sales volume");
  const [search, setSearch] = useState("");

  const totalUSDT = dummyData.reduce((acc, d) => acc + d.amount, 0);
  const totalFee = dummyData.reduce((acc, d) => acc + d.fee, 0);

  const filteredData = dummyData.filter((row) => {
    const term = search.toLowerCase();
    return (
      row.nickname.toLowerCase().includes(term) ||
      row.buyer.toLowerCase().includes(term) ||
      row.amount.toString().toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-4 bg-gray-100 min-h-screen flex justify-center">
      <div className="w-full max-w-7xl bg-white rounded-lg shadow p-4">
        {/* Selection Button */}
        <div className="relative flex justify-center w-[100%] mb-4">
          {/* <Down/> */}
          <select
            value={selected}
            onChange={(e) => setSelected(e.target.value)}
            className="bg-green-500 text-white px-4 py-2 w-[100%] rounded-md shadow text-center font-bold text-2xl hover:bg-green-700 outline-0 cursor-pointer"
          >
            <option>{t("managerfee.totalSales")}</option>
            <option>{t("managerfee.todaySales")}</option>
          </select>
        </div>

        {/* Total Section */}
        <div className="grid grid-cols-2 border rounded mb-4 text-center">
          <div className="p-4 border-r">
            <p className="font-semibold">{t("managerfee.totalUSDT")}</p>
            <p className="text-xl font-bold">{totalUSDT.toLocaleString()}</p>
          </div>
          <div className="p-4">
            <p className="font-semibold">{t("managerfee.totalFee")}</p>
            <p className="text-xl font-bold">{totalFee.toFixed(2)}</p>
          </div>
        </div>

        {/* Table */}
        <div className="border rounded overflow-x-auto overflow-y-auto h-[60vh]">
          <table className="w-full text-left border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="border px-2 py-2">{t("managerfee.referral")}</th>
                <th className="border px-2 py-2">{t("managerfee.nickname")}</th>
                <th className="border px-2 py-2">{t("managerfee.amount")}</th>
                <th className="border px-2 py-2">{t("managerfee.buyer")}</th>
                <th className="border px-2 py-2">{t("managerfee.fee")}</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((row, idx) => (
                <tr key={idx} className="hover:bg-gray-50">
                  <td className="border px-2 py-2">{row.referral}</td>
                  <td className="border px-2 py-2">{row.nickname}</td>
                  <td className="border px-2 py-2">{row.amount}</td>
                  <td className="border px-2 py-2">{row.buyer}</td>
                  <td className="border px-2 py-2">{row.fee.toFixed(4)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Search bar */}
        <div className="mt-3">
          <input
            type="text"
            placeholder="Search by nickname, amount or buyer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="border rounded px-3 py-1 md:w-[40%] "
          />
        </div>
      </div>
    </div>
  );
}
