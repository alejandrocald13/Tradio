"use client";
import { useState, useEffect } from "react";
import SidebarNavAdmin from "../components/SidebarNav-Admin";
import "./actionsManage.css";
import ActionAdminCard from "../components/ActionAdminCard";
import ButtonSwitch from "../components/ButtonSwitch";
import Modal from "../components/Modal";




export default function ActionsManage() {
    // aca simulare los datos para las categorias
    // en un futuro se obtendran de una API
    // id: identificador unico (dependera como lo envien en el back o algo que identifique cada categoria)
    // name: nombre a mostrar
    // count: cantidad de acciones en esa categoria
    const CATEGORY_MOCK = [
        { id: "all", name: "Todas", count: 0 },
        { id: "tech",        name: "Tecnología",        count: 32 },
        { id: "healthcare",  name: "Salud",             count: 18 },
        { id: "financials",  name: "Finanzas",          count: 27 },
        { id: "consumer",    name: "Consumo",           count: 21 },
        { id: "energy",      name: "Energía",           count: 12 },
        { id: "industrials", name: "Industria",         count: 19 },
        { id: "materials",   name: "Materiales",        count: 9  },
        { id: "utilities",   name: "Utilities",         count: 7  },
        { id: "realestate",  name: "Inmobiliario",      count: 6  },
        { id: "comms",       name: "Comunicación",      count: 14 },
    ];

    const ACTIONS_MOCK = [
        { id: 1, name: "Apple Inc.", price: 185.32, category: "tech", active: false },
        { id: 2, name: "Microsoft Corp.", price: 328.50, category: "tech", active: false  },
        { id: 3, name: "Pfizer Inc.", price: 35.20, category: "healthcare", active: false  },
        { id: 4, name: "Johnson & Johnson", price: 162.75, category: "healthcare", active: true  },
        { id: 5, name: "JPMorgan Chase", price: 147.88, category: "financials", active: false  },
        { id: 6, name: "Bank of America", price: 30.22, category: "financials", active: false  },
        { id: 7, name: "Coca-Cola", price: 58.44, category: "consumer", active: false  },
        { id: 8, name: "Procter & Gamble", price: 142.65, category: "consumer", active: true  },
        { id: 9, name: "ExxonMobil", price: 110.12, category: "energy", active: true  },
        { id: 10, name: "Chevron", price: 162.33, category: "energy", active: false  },
    ];

    const [activeId, setActiveId] = useState("all");
    const [actions, setActions] = useState(ACTIONS_MOCK);
    const [filteredActions, setFilteredActions] = useState(ACTIONS_MOCK);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [actionPending, setActionPending] = useState(null);

    useEffect(() => {
    if (activeId === "all") {
            setFilteredActions(actions);
        } else {
            setFilteredActions(actions.filter((a) => a.category === activeId));
        }
    }, [activeId, actions]);

    const handleSwitchChange = () => {
    if (!actionPending) return;
    const updated = actions.map((a) =>
        a.id === actionPending.id ? { ...a, active: actionPending.value } : a
    );
        setActions(updated);
        setIsModalOpen(false);
        setActionPending(null);
    };

    const handleSwitchAttempt = ({ id, value }) => {
        setActionPending({ id, value });
        setIsModalOpen(true);
    };

    const cancelSwitchChange = () => {
        setIsModalOpen(false);
        setActionPending(null);
    };

    return (
        <>
        <SidebarNavAdmin />
        <div className="page-container">
            <div className="div-category">
                <h2>CATEGORY</h2>

                <div className="categories-list">
                    {CATEGORY_MOCK.map((data) => (
                    <button
                        key={data.id}
                        type="button"
                        className={`category-item ${activeId === data.id ? "is-active" : ""}`}
                        onClick={() => setActiveId(data.id)}
                        aria-selected={activeId === data.id}
                    >
                        <span className="category-name">{data.name}</span>
                        <span className={`capsule-number ${activeId === data.id ? "capsule-number-active" : ""}`}>
                            {/* {data.count} */}
                            {data.id === "all"
                                ? ACTIONS_MOCK.length
                                : ACTIONS_MOCK.filter((a) => a.category === data.id).length}
                        </span>
                    </button>
                    ))}
                </div>
            </div>
                <div className="actions-container">
                    {filteredActions.length > 0 ? (
                        filteredActions.map((action) => (
                        <ActionAdminCard key={action.id}>
                            <div className="action-card-content">
                                <h3>{action.name}</h3>
                                <p>Precio: ${action.price.toFixed(2)}</p>
                                <ButtonSwitch  id={action.id} value={action.active} getValue={handleSwitchAttempt} />
                            </div>
                        </ActionAdminCard>
                        ))
                    ) : (
                        <p>No hay acciones en esta categoría.</p>
                    )}
                </div>

        </div>


        <Modal
            isOpen={isModalOpen}
            title="Confirmar cambio"
            onClose={cancelSwitchChange}
        >
            <p>
                ¿Seguro que deseas{" "}
                {actionPending?.value ? "habilitar" : "deshabilitar"} esta acción?
            </p>
            <div>
                <button onClick={handleSwitchChange}>Confirmar</button>
                <button onClick={cancelSwitchChange}>Cancelar</button>
            </div>
        </Modal>
        </>

    );
}
