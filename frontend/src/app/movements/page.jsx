'use client'

import { useEffect, useState } from "react"
import './movements.css'
import SidebarNavAdmin from "../components/SidebarNav-Admin"
import Searcher from "../components/Searcher"
import TableAdmin from "../components/TableAdmin"

export default function movements () {
    const [showFilter, setShowFilter] = useState(false)
    const [selected, setSelected] = useState("")
    const [selectedAction, setSelectedAction] = useState("")

    useEffect(() => {
        // Aqui obtendremos los movimientos
    })

    const changeShowFiler = () => {
        if(showFilter){
            setShowFilter(false)
        }else{
            setShowFilter(true)
        }
    }

    const getDataSearcher = (data) => {
        console.log(data)
    }
    const movesColumns = ['Type', 'User Email', 'Amount', 'Date']
    const movesData = [
        {
            'Type': 'Debit',
            'User Email': 'dani@gmail.com',
            'Amount': 100,
            'Date': '20/07/2024'
        },
        {
            'Type': 'Debit',
            'User Email': 'dani@gmail.com',
            'Amount': 100,
            'Date': '20/07/2024'
        },
        {
            'Type': 'Debit',
            'User Email': 'dani@gmail.com',
            'Amount': 100,
            'Date': '20/07/2024'
        },
        {
            'Type': 'Debit',
            'User Email': 'dani@gmail.com',
            'Amount': 100,
            'Date': '20/07/2024'
        }
    ]

    return (
        <>
            <SidebarNavAdmin/>
            <div className="main-container-M">
                <div className="header-M">
                    <div className="filtro-M">
                        <button className='open-filter-btn' onClick={changeShowFiler}>
                            <p>Filter</p>
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"></path></svg>
                        </button>
                        {showFilter && (
                            <div className="filter">
                                <div className="filter-segments">
                                    <p>Type</p>
                                    <select name="algo" id="1" value={selected} onChange={(e) => setSelected(e.target.value)}>
                                        <option value="" disabled>Select Type</option>
                                        <option value="2">Sale</option>
                                        <option value="3">Purchases</option>
                                    </select>
                                </div>
                                <div className="filter-segments">
                                    <p>Date</p>
                                    <input type="date" value="j" />
                                </div>
                                <button className="apply-filter-btn" onClick={changeShowFiler}>
                                    Apply Filter
                                </button>
                            </div>
                        )}
                    </div>
                    <Searcher placeholderI={'Enter email'}getValue={getDataSearcher} />
                </div>
                <div className="table-transaction-M">
                    <TableAdmin columns={movesColumns} data={movesData} btnVerification={false}/>
                </div>
            </div>
        </>
    )
}