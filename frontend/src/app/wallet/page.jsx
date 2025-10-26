"use client";

import { useState, useEffect, useMemo } from "react";
import "./wallet.css";
import SidebarNav from "../components/SidebarNav-Auth";
import DataTable from "../components/DataTable";
import Modal from "../components/Modal";
import { api } from "../lib/axios";

export default function WalletPage() {
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);

  const [showPanel, setShowPanel] = useState(false);
  const [actionType, setActionType] = useState(""); // "Deposit" | "Withdrawal"
  const [formData, setFormData] = useState({ bank: "", amount: "", code: "" });

  const [showModal, setShowModal] = useState(false);

  const fetchWalletData = async () => {
    try {
      const res = await api.get("/wallet/me/");
      setBalance(res.data.balance || 0);
      setTransactions(res.data.transactions || []);
    } catch (err) {
      console.error("Error fetching wallet data:", err);
    }
  };

  useEffect(() => {
    fetchWalletData();
  }, []);

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
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  
  const handleSubmit = (e) => {
    e.preventDefault();
    const amountValue = parseFloat(formData.amount);
    if (isNaN(amountValue) || amountValue <= 0) {
        alert("Please enter a valid amount.");
        return;
    }
    setShowModal(true);
  };

  const confirmTransaction = async () => {
    try {
        const payload = {
            amount: parseFloat(formData.amount),
            bank: formData.bank,
            code: formData.code,
        };

        if (actionType === "Deposit") {
            await api.post("/wallet/deposit/", payload);
        } else if (actionType === "Withdrawal") {
            await api.post("/wallet/withdraw/", payload);
        } else {
            alert("Unknown action type");
            return;
        }

        await fetchWalletData();

        setShowPanel(false);
        setShowModal(false);
        alert(`Transaction ${actionType} successful!`);
    } catch (err) {
        console.error("Error sending transaction:", err);
        alert("Transaction failed");
    }
  };

  const cancelTransaction = () => setShowModal(false);

  const transactionsColored = useMemo(() => {
    return transactions.map((t) => ({
      ...t,
      amount: (
        <span
          className={
            parseFloat(t.amount) >= 0 ? "positive" : "negative"
          }
        >
          {parseFloat(t.amount) >= 0
            ? `+${parseFloat(t.amount).toFixed(2)}`
            : parseFloat(t.amount).toFixed(2)}
        </span>
      ),
    }));
  }, [transactions]);

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
            <p className="balanceAmount">${Number(balance).toFixed(2)}</p>
          </div>

          <div className="buttons">
            <button
              className="btn deposit"
              onClick={() => handleOpenPanel("Deposit")}
            >
              Deposit
            </button>
            <button
              className="btn withdrawal"
              onClick={() => handleOpenPanel("Withdrawal")}
            >
              Withdrawal
            </button>
          </div>
        </div>

        <div className="section">
          <h2 className="sectionTitle">Transaction History</h2>
          <DataTable
            mode="transactions"
            data={transactionsColored}
            columns={columns}
          />
        </div>
      </main>

      {showPanel && (
        <div className="sidePanel">
          <div className="panelHeader">
            <h3>
              {actionType === "Deposit"
                ? "Send Money to App"
                : "Send Money to Bank"}
            </h3>
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

          <Modal
            isOpen={showModal}
            title="Confirmation"
            onClose={cancelTransaction}
          >
            <p>
              Are you sure you want to{" "}
              {actionType === "Deposit" ? "deposit" : "withdraw"}?
            </p>

            <div
              style={{
                marginTop: "10px",
                fontSize: "14px",
              }}
            >
              <p>You Send: USD {formData.amount}</p>
              {/* campos falsos no actualizaos de momento*/}
              <p>They Receive: ID 718,612</p>
              <p>Will Arrive On: 6 Sep 2025</p>
            </div>

            <div
              style={{
                marginTop: "18px",
                display: "flex",
                justifyContent: "center",
                gap: "12px",
              }}
            >
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
