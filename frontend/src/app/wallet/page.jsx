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
  const [actionType, setActionType] = useState(""); 
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

  const existingCodes = useMemo(() => {
    return new Set(
      (transactions || []).map((t) => String(t.transfer_number || t.id || ""))
    );
  }, [transactions]);

  const generateUniqueCode = () => {
    const date = new Date();
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, "0");
    const d = String(date.getDate()).padStart(2, "0");

    let code = "";
    do {
      const rand = Math.random().toString(36).slice(2, 8).toUpperCase();
      code = `TRD-${y}${m}${d}-${rand}`;
    } while (existingCodes.has(code));
    return code;
  };

  const handleOpenPanel = (type) => {
    setActionType(type);
    const autoCode = generateUniqueCode();
    setFormData({ bank: "", amount: "", code: autoCode });
    setShowPanel(true);
  };

  const handleClosePanel = () => {
    setShowPanel(false);
    setShowModal(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "code") return;
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
      }

      await fetchWalletData();
      setShowPanel(false);
      setShowModal(false);
      alert(`Transaction ${actionType} successful!`);
    } catch (err) {
      console.error("Error:", err);
      alert("Transaction failed");
    }
  };

  const cancelTransaction = () => setShowModal(false);

  const transactionsForTable = useMemo(() => {
    return (transactions || []).map((t) => {
      const shownId = t.transfer_number || t.id;
      const amt = parseFloat(t.amount);
      return {
        ...t,
        id: shownId,
        amount: (
          <span className={amt >= 0 ? "positive" : "negative"}>
            {amt >= 0 ? `+${amt.toFixed(2)}` : amt.toFixed(2)}
          </span>
        ),
      };
    });
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
          <DataTable
            mode="transactions"
            data={transactionsForTable}
            columns={columns}
          />
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
              <input type="text" name="bank" value={formData.bank} onChange={handleChange} placeholder="Bank name" required />
            </div>

            <div className="formGroup">
              <label>Amount:</label>
              <input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="Amount" required min="0.01" step="0.01" />
            </div>

            <div className="formGroup">
              <label>Code:</label>
              <input type="text" name="code" value={formData.code} readOnly />
            </div>

            <button type="submit" className="sendBtn">Send Money</button>
          </form>

          <Modal isOpen={showModal} title="Confirmation" onClose={cancelTransaction}>
            <p>Are you sure you want to {actionType === "Deposit" ? "deposit" : "withdraw"}?</p>

            <div style={{ marginTop: "10px", fontSize: "14px" }}>
              <p>You Send: USD {formData.amount}</p>
              <p>Transfer Code: {formData.code}</p>
            </div>

            <div className="modal-actions">
              <button onClick={confirmTransaction}>Confirm</button>
              <button className="cancel-btn" onClick={cancelTransaction}>Cancel</button>
            </div>
          </Modal>
        </div>
      )}
    </div>
  );
}
