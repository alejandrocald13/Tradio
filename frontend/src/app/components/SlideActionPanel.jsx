"use client";
import "../styles/SlideActionPanel.css";

export default function SlideActionPanel({ 
    isOpen, 
    onClose, 
    children,
    width = 500,
}) {

    return (
        <div 
        className={`slide-overlay ${isOpen ? "open" : ""}`} 
        onClick={onClose}
        >
        <aside
            className={`slide-panel right ${isOpen ? "open" : ""}`}
            style={{ width }}
            onClick={(e) => e.stopPropagation()}
        >
            {children}
        </aside>
        </div>
    );
}

