import React from "react";
import BalanceCard from "./cards/balance";
import Transactions from "./cards/transactions"; // Adjust the path based on your folder structure

export default function Dashboard() {
  return (
    <div style={{ padding: 16 }}>
      <BalanceCard />
      <div style={{ marginTop: 32 }}>
        <h3>Transactions</h3>
        <Transactions />
      </div>
    </div>
  );
}
