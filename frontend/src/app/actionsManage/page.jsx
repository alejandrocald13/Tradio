"use client";
import { useState, useEffect } from "react";
import SidebarNavAdmin from "../components/SidebarNav-Admin";
import ActionAdminCard from "../components/ActionAdminCard";
import ButtonSwitch from "../components/ButtonSwitch";
import Modal from "../components/Modal";
import Searcher from "../components/Searcher";
import { api } from "../lib/axios";
import "./actionsManage.css";




export default function ActionsManage() {
    // aca simulare los datos para las categorias
    // en un futuro se obtendran de una API
    // id: identificador unico (dependera como lo envien en el back o algo que identifique cada categoria)
    // name: nombre a mostrar
    // count: cantidad de acciones en esa categoria

    const [activeId, setActiveId] = useState("all");
    const [actions, setActions] = useState([]);
    const [filteredActions, setFilteredActions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [categoryCounts, setCategoryCounts] = useState({});
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("all");
    const [showDropdown, setShowDropdown] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionPending, setActionPending] = useState(null);
    const [actionPendingName, setActionPendingName] = useState("");

    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newSymbol, setNewSymbol] = useState("");
    const [isAdding, setIsAdding] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [toast, setToast] = useState({ message: "", type: "" });

    useEffect(() => {
        let filteredList = actions;

        if (searchTerm) {
            filteredList = filteredList.filter((action) =>
                action.name.toLowerCase().includes(searchTerm)
            );
        }
        
        if (statusFilter === "enable") {
            filteredList = filteredList.filter((action) => action.active);
        } else if (statusFilter === "disable") {
            filteredList  = filteredList .filter((action) => !action.active);
        }
        
        const updatedCategoryCounts = filteredList.reduce((counts, action) => {
            counts[action.category] = (counts[action.category] || 0) + 1;
            return counts;
        }, {});
        
        updatedCategoryCounts["all"] = filteredList.length;

        setCategoryCounts(updatedCategoryCounts);
        
        if (activeId !== "all") {
            filteredList = filteredList.filter((a) => a.category === activeId);
        }

        setFilteredActions(filteredList);
    }, [activeId, actions, searchTerm, statusFilter]);

    useEffect(() => {
        const fetchActions = async () => {
            try {
                const res = await api.get("/stocks-admin/");
                const formatted = res.data.map(a => ({
                    id: a.id,
                    name: a.name,
                    price: Number(a.current_price),
                    category: a.category_name,
                    active: a.is_active
                }));
                setActions(formatted);
                setFilteredActions(formatted);

                const uniqueCategories = [...new Set(formatted.map(a => a.category))];
                const categoryObjects = [
                    { id: "all", name: "All" },
                    ...uniqueCategories.map(cat => ({ id: cat, name: cat }))
                ];
                setCategories(categoryObjects);

            } catch (err) {
                alert("Failed to load actions. Please check your connection or try again later.");
            }
        };
        fetchActions();
    }, []);

    useEffect(() => {
        let filtered = actions;

        if (searchTerm) {
            filtered = filtered.filter(a =>
                a.name.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (statusFilter === "enable") filtered = filtered.filter(a => a.active);
        if (statusFilter === "disable") filtered = filtered.filter(a => !a.active);

        const counts = filtered.reduce((acc, a) => {
            acc[a.category] = (acc[a.category] || 0) + 1;
            return acc;
        }, {});
        counts["all"] = filtered.length;
        setCategoryCounts(counts);

        if (activeId !== "all") {
            filtered = filtered.filter(a => a.category === activeId);
        }

        setFilteredActions(filtered);
    }, [activeId, actions, searchTerm, statusFilter]);

    const handleSearch = (value) => {
        setSearchTerm(value.toLowerCase());
    };

    const handleSwitchAttempt = ({ id, value }) => {
        const action = actions.find(a => a.id === id);
        setActionPending({ id, value });
        setActionPendingName(action?.name || "");
        setIsModalOpen(true);
    };

    const handleSwitchConfirm = async () => {
        if (!actionPending) return;

        const { id, value } = actionPending;
        const endpoint = value
            ? `/stocks-admin/${id}/enable/`
            : `/stocks-admin/${id}/disable/`;

        setIsConfirming(true);

        try {
            await api.post(endpoint, { is_active: value });

            const updated = actions.map(a =>
                a.id === id ? { ...a, active: value } : a
            );
            setActions(updated);
            setIsModalOpen(false);
            setActionPending(null);
            showToast(`Action ${value ? "enabled" : "disabled"} successfully!`);
        } catch (err) {
            alert("There was an error when changing the status of the action. Please try again.");
        } finally {
            setIsConfirming(false);
        }
    };

    const showToast = (message, type = "success") => {
        setToast({ message, type });
        setTimeout(() => setToast({ message: "", type: "" }), 3000);
    };

    return (
        <>
            <SidebarNavAdmin />
            <div className="page-container">
                <div className="div-category">
                    <h2>CATEGORY</h2>

                    <div className="categories-list">
                        {categories.map((data) => (
                        <button
                            key={data.id}
                            type="button"
                            className={`category-item ${activeId === data.id ? "is-active" : ""}`}
                            onClick={() => setActiveId(data.id)}
                            aria-selected={activeId === data.id}
                        >
                            <span className="category-name">{data.name}</span>
                            <span className={`capsule-number ${activeId === data.id ? "capsule-number-active" : ""}`}>
                                {categoryCounts[data.id] ?? 0}
                            </span>
                        </button>
                        ))}
                    </div>
                </div>
                <div className="div-actions">
                    <div className="searcher-container">
                        <Searcher placeholderI="Search action by name..." getValue={handleSearch} />
                        <div className="filter-btn">
                            <button className="filter-btn-pattern" onClick={() => setShowDropdown(!showDropdown)}>Filter 
                                <svg 
                                    stroke="currentColor" fill="currentColor" strokeWidth="0" 
                                    viewBox="0 0 16 16" height="1.5em" width="1.5em" xmlns="http://www.w3.org/2000/svg"><path 
                                    fillRule="evenodd" d="M6 10.5a.5.5 0 01.5-.5h3a.5.5 0 010 1h-3a.5.5 0 01-.5-.5zm-2-3a.5.5 
                                    0 01.5-.5h7a.5.5 0 010 1h-7a.5.5 0 01-.5-.5zm-2-3a.5.5 0 01.5-.5h11a.5.5 0 010 1h-11a.5.5 0 
                                    01-.5-.5z" clipRule="evenodd"></path>
                                </svg>
                            </button>
                            {showDropdown && (
                                <div className="dropdown-menu">
                                    <button onClick={() => {setStatusFilter("all"), setShowDropdown(false)} }>All</button>
                                    <button onClick={() => {setStatusFilter("enable"), setShowDropdown(false)}}>Enable</button>
                                    <button onClick={() => {setStatusFilter("disable"), setShowDropdown(false)}}>Disable</button>
                                </div>
                            )}
                        </div>
                        <button className="add-btn" onClick={() => setIsAddModalOpen(true)}>
                            + Add Action
                        </button>
                    </div>
                    <div className="actions-container">
                        {filteredActions.length > 0 ? (
                            filteredActions.map((action) => (
                                <ActionAdminCard key={action.id}  title={action.name}>
                                    <div className="action-card-content">
                                        <p className="price-action-do">Price: ${action.price.toFixed(2)}</p>
                                        <div className="button-action-do">
                                            <p>{action.active ? "Enable" : "Disable"}</p>
                                            <ButtonSwitch  id={action.id} value={action.active} getValue={handleSwitchAttempt} />
                                        </div>
                                    </div>
                                </ActionAdminCard>
                            ))
                        ) : (
                            <div className="no-actions">
                                <svg
                                    className="no-actions-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
                                    <path d="M888 792H200V168c0-4.4-3.6-8-8-8h-56c-4.4 0-8 3.6-8 8v688c0 4.4 3.6 8 8 
                                    8h752c4.4 0 8-3.6 8-8v-56c0-4.4-3.6-8-8-8zM305.8 637.7c3.1 3.1 8.1 3.1 11.3 0l138.3-137.6L583 628.5c3.1 3.1 8.2 3.1 11.3 
                                    0l275.4-275.3c3.1-3.1 3.1-8.2 0-11.3l-39.6-39.6a8.03 8.03 0 0 0-11.3 0l-230 229.9L461.4 404a8.03 8.03 0 0 0-11.3 0L266.3 
                                    586.7a8.03 8.03 0 0 0 0 11.3l39.5 39.7z" />
                                </svg>
                                <p>There are no actions in this category</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Modal isOpen={isModalOpen} title="Confirm change" onClose={() => !isConfirming && setIsModalOpen(false)}>
                <p> Are you sure you want to {actionPending?.value ? "enable" : "disable"}{" "}
                    <strong>{actionPendingName}</strong>? </p>
                <div className="buttons-modal">
                    <button className="primary-btn" onClick={handleSwitchConfirm} disabled={isConfirming}>
                        {isConfirming ? "Processing..." : "Confirm"}
                    </button>
                    <button className="cancel-btn" onClick={() => setIsModalOpen(false)} disabled={isConfirming}>
                        Cancel
                    </button>
                </div>
            </Modal>

            <Modal isOpen={isAddModalOpen} title="Add new action" onClose={() => setIsAddModalOpen(false)}>
                <p>Enter the stock symbol to add:</p>
                <input
                    type="text"
                    value={newSymbol}
                    onChange={(e) => setNewSymbol(e.target.value.toUpperCase())}
                    placeholder="Example: AAPL"
                    className="input-symbol"
                    disabled={isAdding}
                />
                <div className="buttons-modal">
                    <button
                        className="primary-btn"
                        onClick={async () => {
                            if (!newSymbol.trim()) return alert("Please enter a valid symbol");
                            setIsAdding(true);
                            try {
                                await api.post("/stocks-admin/add_stock/", { symbol: newSymbol.trim() });
                                const res = await api.get("/stocks-admin/");
                                const formatted = res.data.map(a => ({
                                    id: a.id,
                                    name: a.name,
                                    price: Number(a.current_price),
                                    category: a.category_name,
                                    active: a.is_active
                                }));
                                setActions(formatted);
                                showToast("Action added successfully!");
                                setIsAddModalOpen(false);
                                setNewSymbol("");
                            } catch (err) {
                                alert("Failed to add action. Please check the symbol or try again.");
                            } finally {
                                setIsAdding(false);
                            }
                        }}
                        disabled={isAdding}
                    >
                        {isAdding ? "Adding..." : "Add"}
                    </button>
                    <button className="cancel-btn" onClick={() => setIsAddModalOpen(false)} disabled={isAdding}>Cancel</button>
                </div>
            </Modal>

            {toast.message && (
                <div className={`toast ${toast.type}`}>
                    {toast.message}
                </div>
            )}

        </>

    );
}
