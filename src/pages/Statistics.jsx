import React, { useState } from "react";
import Navbar from "../components/Navbar";
import BalanceTrendChart from "../components/BalanceTrendChart";
import SpendingPieChart from "../components/SpendingPieChart";

const Statistics = () => {
  const [selectedMonth, setSelectedMonth] = useState("all");
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F9FBFF] text-slate-800">
      <Navbar />
      <main className="flex-1 w-full lg:ml-0 p-4 md:p-8 lg:p-10 mx-auto">
        <div>
          <BalanceTrendChart
            selectedMonth={selectedMonth}
            onMonthChange={setSelectedMonth}
          />
        </div>

        <SpendingPieChart selectedMonth={selectedMonth} />
      </main>
    </div>
  );
};

export default Statistics;
