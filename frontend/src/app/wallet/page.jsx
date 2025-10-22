"use client";
import { useState } from "react";
import "./wallet.css";
import SidebarNav from "../components/SidebarNav-Auth";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal"; // ✅ import del modal reutilizable

export default function WalletPage() {
  const [transactions, setTransactions] = useState([]);
  const [showPanel, setShowPanel] = useState(false);
  const [actionType, setActionType] = useState("");
  const [formData, setFormData] = useState({ bank: "", amount: "", code: "" });
  const [showModal, setShowModal] = useState(false);

  const loggedInUser = { name: "John Doe" };
  const balance = transactions.reduce((acc, t) => acc + t.amount, 0);

  const handleOpenPanel = (type) => {
    setActionType(type);
    setFormData({ bank: "", amount: "", code: "" });
    setShowPanel(true);
  };

  const handleClosePanel = () => {
    setShowPanel(false);
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const amountValue = parseFloat(formData.amount);
    if (isNaN(amountValue) || amountValue <= 0)
      return alert("Please enter a valid amount.");
    setShowModal(true);
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
    setShowModal(false);
    alert(`Transaction ${actionType} successful!`);
  };

  const cancelTransaction = () => setShowModal(false);

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

        <div className="section">
          <h2 className="sectionTitle">Transaction History</h2>
          <DataTable mode="transactions" data={transactionsColored} columns={columns} />
        </div>
      </main>

      {showPanel && (
        <div className="sidePanel">
          <div className="panelHeader">
            <h3>{actionType === "Deposit" ? "Send Money to App" : "Send Money to Bank"}</h3>
            <button className="closeBtn" onClick={handleClosePanel}>×</button>
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

          {/* ✅ Usamos el Modal Component */}
          <Modal
            isOpen={showModal}
            title="Confirmation"
            onClose={cancelTransaction}
          >
            <p>
              Are you sure you want to{" "}
              {actionType === "Deposit" ? "deposit" : "withdraw"}?
            </p>

            <p style={{ marginTop: "8px", fontWeight: 600 }}>
              {loggedInUser.name}
            </p>
            <p>{formData.bank || "Mandiri Bank"}</p>

            <div style={{ marginTop: "10px", fontSize: "14px" }}>
              <p>You Send: USD {formData.amount}</p>
              <p>They Receive: ID 718,612</p>
              <p>Will Arrive On: 6 Sep 2025</p>
            </div>

            <div style={{ marginTop: "18px", display: "flex", justifyContent: "center", gap: "12px" }}>
              <button
                onClick={confirmTransaction}
                style={{
                  background: "#4e635e",
                  color: "white",
                  border: "none",
                  padding: "8px 18px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Confirm
              </button>

              <button
                onClick={cancelTransaction}
                style={{
                  background: "#b5b5b5",
                  color: "white",
                  border: "none",
                  padding: "8px 18px",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
}
