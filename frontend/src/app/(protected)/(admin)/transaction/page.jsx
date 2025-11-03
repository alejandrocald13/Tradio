'use client'

import { useEffect, useState } from "react"
import './transaction.css'
import TableAdmin from "@/app/components/TableAdmin"
import SidebarNavAdmin from '@/app/components/SidebarNav-Admin'
import Searcher from "@/app/components/Searcher"
import { api } from "@/app/lib/axios"

export default function Transaction(){
    const [showFilter, setShowFilter] = useState(false)
    const [typeSelected, setTypeSelected] = useState("")
    const [selectedAction, setSelectedAction] = useState("")
    const [date1, setdate1] = useState("")
    const [date2, setdate2] = useState("")
    const [email, setEmail] = useState("")
    const hoy = new Date().toISOString().split("T")[0]

    const [usersData, setUsersData] = useState([])
    const [actions, setActions] = useState([])

    useEffect(() => {
        const getActions = async () => {
            try{
                const response = await api.get('/stocks/')
                const data = response.data
                const formattedData = data.map(dat => ({
                    name: dat.name,
                    symbol: dat.symbol,
                    id: dat.id
                }))
                setActions(formattedData)
            }catch(error){
                console.log("Error al obtener acciones", error)
            }
        }
        getActions()
    }, [])

    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const params = new URLSearchParams()
                if (typeSelected) params.append("type", typeSelected)
                if (selectedAction) params.append("stock", selectedAction)
                if (date1) params.append("date_from", date1)
                if (date2) params.append("date_to", date2)
                if (email) params.append("email", email)

                const url = `/transactions/report/?${params.toString()}`
                const response = await api.get(url)
                setUsersData(response.data)
            } catch (error) {
                console.log("Error al obtener transacciones", error)
                setUsersData([])
            }
        }
        fetchTransactions()
    }, [typeSelected, selectedAction, date1, date2, email])

    const changeShowFiler = () => setShowFilter(prev => !prev)
    const getDataSearcher = (data) => setEmail(data)

    const transationColumns = ['Type', 'User Email', 'Action', 'Quantity', 'Total', 'Date']

    return (
        <>
            <SidebarNavAdmin/>
            <div className="main-container-AT">
                <div className="header-AT">
                    
                    <div className="filtro-TA">
                        <button className='open-filter-btn' onClick={changeShowFiler}>
                            <p>Filter</p>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"></path></svg>
                        </button>
                        {showFilter && (
                            <div className="filter">
                                <div className="filter-segments">
                                    <p>Type</p>
                                    <select
                                        name="typeFilter"
                                        value={typeSelected}
                                        onChange={(e) => setTypeSelected(e.target.value)}
                                    >
                                        <option value="">Select Type</option>
                                        <option value="Sale">Sale</option>
                                        <option value="Purchases">Purchases</option>
                                    </select>
                                </div>

                                <div className="filter-segments">
                                    <p>Action</p>
                                    <select
                                        name="actionFilter"
                                        value={selectedAction}
                                        onChange={(e) => setSelectedAction(e.target.value)}
                                    >
                                        <option value="">Select Action</option>
                                        {actions.map((action) => (
                                            <option key={action.id} value={action.symbol}>
                                                {action.symbol}
                                            </option>
                                        ))}
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

                                <button
                                    className="apply-filter-btn"
                                    onClick={() => {setTypeSelected(''), setSelectedAction(''),setdate1(''), setdate2(''), changeShowFiler()}}
                                >
                                    Clear
                                </button>
                            </div>
                        )}
                    </div>

                    <Searcher
                        placeholderI={'Enter email'}
                        getValue={getDataSearcher}
                    />
                </div>

                <div className="table-transaction-AT">
                    <TableAdmin
                        columns={transationColumns}
                        data={usersData}
                        btnVerification={false}
                    />
                </div>
            </div>
        </>
    )
}
