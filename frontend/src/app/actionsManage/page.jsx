"use client";
import { useState, useEffect } from "react";
import SidebarNavAdmin from "../components/SidebarNav-Admin";
import "./actionsManage.css";




export default function ActionsManage() {
    // aca simulare los datos para las categorias
    // en un futuro se obtendran de una API
    // id: identificador unico (dependera como lo envien en el back o algo que identifique cada categoria)
    // name: nombre a mostrar
    // count: cantidad de acciones en esa categoria
    const CATEGORY_MOCK = [
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

    const [activeId, setActiveId] = useState(CATEGORY_MOCK[0].id);

    useEffect(() => {
        if (!activeId && CATEGORY_MOCK.length) {
        setActiveId(CATEGORY_MOCK[0].id);
        }
    }, [activeId]);

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
                        {data.count}
                        </span>
                    </button>
                    ))}
                </div>
            </div>

        </div>
        </>
    );
}
