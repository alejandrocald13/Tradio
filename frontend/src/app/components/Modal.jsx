import "../styles/Modal.css";

export default function Modal({ isOpen, title, children, onClose }) {
    if (!isOpen) return null;

    const handleOverlayClick = (e) => { if (e.target === e.currentTarget) onClose?.(); };

    return (
        <div className="modal-overlay" onClick={handleOverlayClick} role="dialog" aria-modal="true">
            <div className="modal-card" onClick={(e) => e.stopPropagation()}>
                {/* Aca se define el titulo */}
                <div className="modal-header">
                    <span className="modal-title">{title}</span>
                </div>
                {/* Aca se define el cuerpo (la parte blanca) */}
                <div className="modal-body">{children}</div>
            </div>
        </div>
    );
}