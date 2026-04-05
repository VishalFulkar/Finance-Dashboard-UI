import React from "react";
import SummaryCard from "../components/SummaryCard";
import TransactionTable from "../components/TransactionTable";
import Insights from "../components/Insights";
import Navbar from "../components/Navbar";
import SwitchUser from "../components/SwitchUser";

const TransactionSection = () => {
  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-[#F9FBFF] text-slate-800">
      <Navbar />
      <main className="flex-1 w-full lg:ml-0 p-4 md:p-8 lg:p-10 mx-auto">
        <SummaryCard />
        <div className="w-41 ml-5">
          <SwitchUser />
        </div>
        <TransactionTable />
        <Insights />
      </main>
    </div>
  );
};

export default TransactionSection;
