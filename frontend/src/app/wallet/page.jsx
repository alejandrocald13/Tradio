"use client";
import { useState } from "react";
import "./wallet.css";
import SidebarNav from "../components/SidebarNav-Auth";
import DataTable from "../components/DataTable";

export default function WalletPage() {
  const [transactions, setTransactions] = useState([
    { id: "455565655", date: "27 Sep 2025", amount: -100.0, type: "Withdrawal" },
    { id: "455565656", date: "27 Sep 2025", amount: 100.0, type: "Deposit" },
    { id: "455565657", date: "27 Sep 2025", amount: -50.0, type: "Withdrawal" },
    { id: "455565658", date: "27 Sep 2025", amount: 200.0, type: "Deposit" },
    { id: "455565659", date: "27 Sep 2025", amount: -75.0, type: "Withdrawal" },
    { id: "455565660", date: "27 Sep 2025", amount: 300.0, type: "Deposit" },
  ]);

  const [showPanel, setShowPanel] = useState(false);
  const [actionType, setActionType] = useState("");
  const [formData, setFormData] = useState({ bank: "", amount: "", code: "" });
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Logged-in user data (replace with actual)
  const loggedInUser = {
    name: "John Doe",
  };

  const balance = transactions.reduce((acc, t) => acc + t.amount, 0);

  const handleOpenPanel = (type) => {
    setActionType(type);
    setFormData({ bank: loggedInUser.bank || "", amount: "", code: "" });
    setShowPanel(true);
  };

  const handleClosePanel = () => {
    setShowPanel(false);
    setShowConfirmation(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amountValue = parseFloat(formData.amount);
    if (isNaN(amountValue) || amountValue <= 0) return alert("Please enter a valid amount.");
    setShowConfirmation(true);
  };

  const confirmTransaction = () => {
    const amountValue = parseFloat(formData.amount);
    const newTransaction = {
      id: Math.floor(Math.random() * 1000000000).toString(),
      date: new Date().toLocaleDateString("en-US", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      }),
      amount: actionType === "Deposit" ? amountValue : -amountValue,
      type: actionType,
    };

    setTransactions([newTransaction, ...transactions]);
    setShowPanel(false);
    setShowConfirmation(false);
    alert(`Transaction ${actionType === "Deposit" ? "deposited" : "withdrawn"} successfully!`);
  };

  const cancelTransaction = () => setShowConfirmation(false);

  const panelTitle = actionType === "Deposit" ? "Send Money to App" : "Send Money to Bank";

  const transactionsColored = transactions.map((t) => ({
    ...t,
    amount: (
      <span className={t.amount >= 0 ? "positive" : "negative"}>
        {t.amount >= 0 ? `+${t.amount.toFixed(2)}` : t.amount.toFixed(2)}
      </span>
    ),
  }));

  const columns = [
    { key: "id", label: "Transaction ID" },
    { key: "date", label: "Date" },
    { key: "amount", label: "Amount (USD)" },
    { key: "type", label: "Type" },
  ];

  return (
    <div className="container">
      <SidebarNav />

      <main className="main">
        {/* Balance */}
        <div className="balanceCard">
          <div>
            <p className="balanceLabel">Your Balance:</p>
            <p className="balanceAmount">${balance.toFixed(2)}</p>
          </div>

          <div className="buttons">
            <button className="btn deposit" onClick={() => handleOpenPanel("Deposit")}>
              Deposit
            </button>
            <button className="btn withdrawal" onClick={() => handleOpenPanel("Withdrawal")}>
            Withdrawal
            </button>
          </div>
        </div>

        {/* Transactions Table */}
        <div className="section">
          <h2 className="sectionTitle">Transaction History</h2>
          <DataTable mode="transactions" data={transactionsColored} columns={columns} />
        </div>
      </main>

      {/* Side Panel */}
      {showPanel && (
        <div className="sidePanel">
          <div className="panelHeader">
            <h3>{panelTitle}</h3>
            <button className="closeBtn" onClick={handleClosePanel}>
              ×
            </button>
          </div>

          <form className="panelForm" onSubmit={handleSubmit}>
            <div className="formGroup">
              <label>Bank:</label>
              <input
                type="text"
                name="bank"
                value={formData.bank}
                onChange={handleChange}
                placeholder="Enter bank name"
                required
              />
            </div>

            <div className="formGroup">
              <label>Amount:</label>
              <input
                type="number"
                name="amount"
                value={formData.amount}
                onChange={handleChange}
                placeholder="Enter amount"
                required
              />
            </div>

            <div className="formGroup">
              <label>Code:</label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                placeholder="Enter code"
                required
              />
            </div>

            <button type="submit" className="sendBtn">
              Send Money
            </button>
          </form>

          {/* Confirmation Modal */}
          {showConfirmation && (
            <div className="confirmationOverlay">
              <div className="confirmationBox">
                <div className="confirmationHeader">
                  <h2>Confirmation</h2>
                </div>

                <h3 className="confirmationQuestion">
                  Are you sure you want to {actionType === "Deposit" ? "deposit" : "withdraw"}?
                </h3>

                <div className="confirmationUser">
                  <h4 className="userName">{loggedInUser.name}</h4>
                  <p className="bankName">{formData.bank || "Mandiri Bank"}</p>
                </div>

                <div className="confirmationDetails">
                  <div>
                    <p>You Send</p>
                    <span>USD {formData.amount}</span>
                  </div>
                  <div>
                    <p>They Receive</p>
                    <span>ID 718,612</span>
                  </div>
                  <div>
                    <p>Will Arrive On</p>
                    <span>6 Sep 2025</span>
                  </div>
                </div>

                <div className="confirmationButtons">
                  <button className="confirmarBtn" onClick={confirmTransaction}>
                    Confirm
                  </button>
                  <button className="cancelarBtn" onClick={cancelTransaction}>
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
