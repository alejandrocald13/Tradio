'use client'

import { useEffect, useState } from "react"
import './movements.css'
import SidebarNavAdmin from "../components/SidebarNav-Admin"
import Searcher from "../components/Searcher"
import TableAdmin from "../components/TableAdmin"
import { api } from "../lib/axios"

export default function Movements () {
    const [showFilter, setShowFilter] = useState(false)

    const [typeSelected, setTypeSelected] = useState("")
    const [date1, setdate1] = useState("")
    const [date2, setdate2] = useState("")
    const [emailSearch, setEmailSearch] = useState("")

    const [movesData, setMovesData] = useState([])

    const hoy = new Date().toISOString().split("T")[0]

    const changeShowFiler = () => {
        setShowFilter(prev => !prev)
    }

    const getDataSearcher = (data) => {
        setEmailSearch(data)
    }

    useEffect(() => {
        const fetchMovements = async () => {
            try {
                const params = new URLSearchParams()

                if (emailSearch) params.append("email", emailSearch)
                if (typeSelected) params.append("type", typeSelected)
                if (date1) params.append("date_from", date1)
                if (date2) params.append("date_to", date2)

                const url = `/wallet/movements/?${params.toString()}`
                const response = await api.get(url)

                setMovesData(response.data || [])
            } catch (error) {
                console.log("Error al obtener movimientos", error)
                setMovesData([])
            }
        }

        fetchMovements()
    }, [emailSearch, typeSelected, date1, date2])

    const movesColumns = ['Type', 'User Email', 'Amount', 'Date']

    return (
        <>
            <SidebarNavAdmin/>
            <div className="main-container-M">
                <div className="header-M">
                    <div className="filtro-M">
                        <button className='open-filter-btn' onClick={changeShowFiler}>
                            <p>Filter</p>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"></path></svg>
                        </button>
                        {showFilter && (
                            <div className="filter">
                                <div className="filter-segments">
                                    <p>Type</p>
                                    <select
                                        value={typeSelected}
                                        onChange={(e) => setTypeSelected(e.target.value)}
                                    >
                                        <option value="">Select Type</option>
                                        <option value="TOPUP">Deposit</option>
                                        <option value="WITHDRAW">Withdrawal</option>
                                        <option value="REFERRAL_CODE">Referral Bonus</option>
                                    </select>
                                </div>

                                <div className="filter-segments">
                                    <p>Date</p>
                                    <div className="date-inputs-filter">
                                        <p>From:</p>
                                        <input
                                            type="date"
                                            value={date1}
                                            onChange={(e)=> setdate1(e.target.value)}
                                            max={hoy}
                                        />
                                    </div>

                                    <div className="date-inputs-filter-to">
                                        <p>To:</p>
                                        <input
                                            type="date"
                                            value={date2}
                                            onChange={(e)=> setdate2(e.target.value)}
                                            max={hoy}
                                        />
                                    </div>
                                </div>
                                <div className="filter-btns">
                                    <button className="apply-filter-btn" onClick={() => {setTypeSelected(''), setdate1(''), setdate2(''), changeShowFiler()}}>
                                        Clear
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>

                    <Searcher
                        placeholderI={'Enter email'}
                        getValue={getDataSearcher}
                    />

                    
                </div>
                
                <div className="table-transaction-M">
                    <TableAdmin
                        columns={movesColumns}
                        data={movesData}
                        btnVerification={false}
                    />
                </div>
            </div>
        </>
    )
}
