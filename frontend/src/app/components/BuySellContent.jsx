"use client";
import { useState, useMemo, useEffect } from "react";
import "../styles/BuySellContent.css";

export default function BuySellContent({ mode = "buy", data = {}, isOpen, onCancel, onConfirm }) {
    const { title = "—", subtitle = "-", price = 0 } = data;
    const [quantity, setQuantity] = useState("");
    const funds = 500.0     // el dinero que se tiene en la wallet
    const purchasePrice = 5000  // precio ene el que compro antes la accion
    const ownedShares = 6;  // el numero de acciones que tiene compradas
    const numPrice = Number(price) || 0;
    const numQuantity = Number(quantity) || 0;

    const total = useMemo(() => numPrice * numQuantity, [numPrice, numQuantity]);

    const isBuy = mode === "buy";
    const insufficient = mode === "buy" && total > funds;
    const notEnoughShares = !isBuy && (ownedShares <= 0 || numQuantity > ownedShares); // si es menor a 0 

    const actionLabel = isBuy ? "Buy" : "Sell";
    const colorClass = isBuy ? "buy-mode" : "sell-mode";

    const fundsLabel = isBuy ? "Current funds:" : "Purchase price:";
    const priceLabel = isBuy ? "Current price:" : "Current market price:";
    const totalLabel = isBuy ? "Estimated total:" : "Total to sell:";

    let warningText = "";
    if (isBuy && insufficient) warningText = "Cannot buy due to insufficient funds.";
    if (!isBuy && notEnoughShares) warningText = "You don't have enough shares to sell.";

    
    useEffect(() => {
        if (!isOpen) {
            setQuantity("");
        }
    }, [isOpen]);

    return (
        <div className={`slide-content-wrapper ${colorClass}`}>
            <div className="slide-header">
                <h2>{isBuy ? "Buy Action" : "Sell Action"}</h2>
                <p className="slide-subtitle">{subtitle}</p>
            </div>

            <div className="slide-content-prices">
                <h3 className="action-title">{title}</h3>

                <div className="slide-info">
                    <p> <strong>{fundsLabel}</strong>{" "} {isBuy ? `$${funds.toFixed(2)}` : `$${purchasePrice.toFixed(2)}`} </p>
                    <p> <strong>{priceLabel}</strong> ${numPrice.toFixed(2)} </p>
                    {!isBuy && (
                        <p>
                            <strong>Owned shares:</strong> {ownedShares}
                        </p>
                    )}
                </div>

                <div className="slide-input">
                    <label htmlFor="quantity">Quantity:</label>
                    <input id="quantity" type="number" min="1" value={quantity} onChange={(e) => {
                        const value = e.target.value;   // verificamos que si sea un numero positivo (fallaba si es negativo por alguna razon)
                        if (Number(value) < 0) return;
                        setQuantity(value);
                    }} 
                        placeholder="example: 5" 
                    />
                </div>
            </div>

            <div className="slide-content-total-btns">
                <div className="slide-total">
                    <p> <strong>{totalLabel}</strong> ${total.toFixed(2)} </p>
                </div>

                {warningText && (
                    <p className="slide-warning">
                        <svg stroke="currentColor" fill="none" stroke-width="0" viewBox="0 0 24 24" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path d="M12 6C12.5523 6 13 6.44772 13 7V13C13 13.5523 12.5523 14 12 14C11.4477 14 11 13.5523 11 13V7C11 6.44772 11.4477 6 12 6Z" fill="currentColor"></path><path d="M12 16C11.4477 16 11 16.4477 11 17C11 17.5523 11.4477 18 12 18C12.5523 18 13 17.5523 13 17C13 16.4477 12.5523 16 12 16Z" fill="currentColor"></path><path fill-rule="evenodd" clip-rule="evenodd" d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM4 12C4 16.4183 7.58172 20 12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12Z" fill="currentColor"></path></svg>
                        {warningText}
                    </p>
                )}

                <div className="slide-buttons">
                    <button  className={`btn-primary ${(insufficient || notEnoughShares) ? "disabled" : ""}`} disabled={insufficient || notEnoughShares || !quantity}
                        onClick={() => {
                            onConfirm?.({ quantity, total });
                            alert(`✅ ${actionLabel} simulada: ${quantity} acciones por $${total}`);
                        }}
                    >
                        {actionLabel}
                    </button>
                    <button className="btn-cancel" onClick={onCancel}>Cancel</button>
                </div>
            </div>
        </div>
    );
}
