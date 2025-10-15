'use client'


import { useState } from "react"
import './transaction.css'
import TableAdmin from "../components/TableAdmin"
import SidebarNavAdmin from '@/app/components/SidebarNav-Admin'
import Searcher from "../components/Searcher"

export default function Transaction(){
    const [selectedTable, setSelectedTable] = useState('transaction')
    const [showFilter, setShowFilter] = useState(false)
    const [selected, setSelected] = useState("")
    const [selectedAction, setSelectedAction] = useState("")
    const [selectedDate, setSelectedDate] = useState("")

    // Vamos a necesitar dos endpoints 
    // 1. Obtenemos datos de transacciones
    // 2. Obtenemos datos de movimiento

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
    const transationColumns = ['Type', 'User Email', 'Action', 'Quantity', 'Total', 'Date']
    const transactionData = [
        {
            'Type': 'Sale',
            'User Email': 'pedrito@gmail.com',
            'Action': 'Oracle',
            'Quantity': 10,
            'Total': 800,
            'Date': '12/04/2025'
        },
        {
            'Type': 'Purchases',
            'User Email': 'pedrito@gmail.com',
            'Action': 'Oracle',
            'Quantity': 5,
            'Total': 800,
            'Date': '12/08/2025'
        },
        {
            'Type': 'Sale',
            'User Email': 'pedrito@gmail.com',
            'Action': 'Oracle',
            'Quantity': 10,
            'Total': 800,
            'Date': '12/04/2025'
        },
        {
            'Type': 'Sale',
            'User Email': 'pedrito@gmail.com',
            'Action': 'Oracle',
            'Quantity': 10,
            'Total': 800,
            'Date': '12/04/2025'
        },
        {
            'Type': 'Sale',
            'User Email': 'pedrito@gmail.com',
            'Action': 'Oracle',
            'Quantity': 10,
            'Total': 800,
            'Date': '12/04/2025'
        }
    ]

    const actions = ['Oracle', 'Tesla', 'Spotify', 'Amazon', 'Apple', 'Oracle', 'Tesla', 'Spotify', 'Amazon', 'Apple', 'Oracle', 'Tesla', 'Spotify', 'Amazon', 'Apple', 'Oracle', 'Tesla', 'Spotify', 'Amazon', 'Apple', 'Oracle', 'Tesla', 'Spotify', 'Amazon', 'Apple', 'Oracle', 'Tesla', 'Spotify', 'Amazon', 'Apple', 'Oracle', 'Tesla', 'Spotify', 'Amazon', 'Apple','Oracle', 'Tesla', 'Spotify', 'Amazon', 'Apple', 'Oracle', 'Tesla', 'Spotify', 'Amazon', 'Apple','Oracle', 'Tesla', 'Spotify', 'Amazon', 'Apple', 'Oracle', 'Tesla', 'Spotify', 'Amazon', 'Apple', 'Oracle', 'Tesla', 'Spotify', 'Amazon', 'Apple', 'Oracle', 'Tesla', 'Spotify', 'Amazon', 'Apple', 'Oracle', 'Tesla', 'Spotify', 'Amazon', 'Apple', 'Oracle', 'Tesla', 'Spotify', 'Amazon', 'Apple']

    return (
        <>
            <SidebarNavAdmin/>
            <div className="main-container-AT">
                <div className="header-AT">
                    
                    <div className="filtro-TA">
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
                                    <p>Action</p>
                                    <select name="algo" id="1" value={selectedAction} onChange={(e) => setSelectedAction(e.target.value)}>
                                        <option value="" disabled>Select Type</option>
                                        {actions.map((action, index) => (
                                                <option value={index}>{action}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="filter-segments">
                                    <p>Date</p>
                                    <div className="date-inputs-filter">
                                        <p>From:</p>
                                        <input 
                                            type="date" 
                                        />
                                    </div>

                                    <div className="date-inputs-filter-to">
                                        <p>To:</p>
                                        <input 
                                            type="date" 
                                        />
                                    </div>
                                </div>
                                <button className="apply-filter-btn" onClick={changeShowFiler}>
                                    Apply Filter
                                </button>
                            </div>
                        )}
                    </div>
                    <Searcher placeholderI={'Enter email'}getValue={getDataSearcher} />
                </div>
                {selectedTable === 'transaction' && (<div className="table-transaction-AT">
                    <TableAdmin columns={transationColumns} data={transactionData} btnVerification={false}/>
                </div>)}
                {selectedTable === 'moves' &&(<div className="table-transaction-AT">
                    <TableAdmin columns={movesColumns} data={movesData} btnVerification={false}/>
                </div>)}
            </div>
        </>
    )
}