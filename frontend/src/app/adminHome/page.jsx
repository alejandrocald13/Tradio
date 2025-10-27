'use client'

import { useEffect, useState } from "react"
import TableAdmin from "../components/TableAdmin"
import SidebarNavAdmin from "../components/SidebarNav-Admin"
import ActionAdminCard from "../components/ActionAdminCard"
import { api } from "../lib/axios"
import './adminHome.css'

export default function AdminHome () {
    const dayUserColumns = ['Name', 'UserName', 'Email', 'Age', 'Fecha']
    const dayTransactionColumns = ['Type', 'User Email', 'Action', 'Quantity', 'Total', 'Date'];
    const hoy = new Date().toISOString().split("T")[0];

    const movesColumns = ['Type', 'User Email', 'Amount', 'Date']

    const [dayTransactions, setDayTransactions] = useState([]);


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

    const dayUsers = [
        {
            id: 1,
            name: 'Daniela Matul',
            userName: 'Danim',
            email: 'dani@gmail.com',
            age: 19,
            date: '10-09-2025',
        }, 
        {
            id: 2,
            name: 'Daniela Matul',
            userName: 'Danim',
            email: 'dani@gmail.com',
            age: 19,
            date: '10-09-2025',
        },
        {
            id: 3,
            name: 'Daniela Matul',
            userName: 'Danim',
            email: 'dani@gmail.com',
            age: 19,
            date: '10-09-2025',
        },
        {
            id: 4,
            name: 'Daniela Matul',
            userName: 'Danim',
            email: 'dani@gmail.com',
            age: 19,
            date: '10-09-2025',
        }  
        
        ,
        {
            id: 5,
            name: 'Daniela Matul',
            userName: 'Danim',
            email: 'dani@gmail.com',
            age: 19,
            date: '10-09-2025',
        },
        {
            id: 6,
            name: 'Daniela Matul',
            userName: 'Danim',
            email: 'dani@gmail.com',
            age: 19,
            date: '10-09-2025',
        },
        {
            id: 7,
            name: 'Daniela Matul',
            userName: 'Danim',
            email: 'dani@gmail.com',
            age: 19,
            date: '10-09-2025',
        },
        {
            id: 8,
            name: 'Daniela Matul',
            userName: 'Danim',
            email: 'dani@gmail.com',
            age: 19,
            date: '10-09-2025',
        },
        {
            id: 9,
            name: 'Daniela Matul',
            userName: 'Danim',
            email: 'dani@gmail.com',
            age: 19,
            date: '10-09-2025',
        },
        {
            id: 10,
            name: 'Daniela Matul',
            userName: 'Danim',
            email: 'dani@gmail.com',
            age: 19,
            date: '10-09-2025',
        },
        {
            id:11,
            name: 'Daniela Matul',
            userName: 'Danim',
            email: 'dani@gmail.com',
            age: 19,
            date: '10-09-2025',
        },
        {
            id: 12,
            name: 'Daniela Matul',
            userName: 'Danim',
            email: 'dani@gmail.com',
            age: 19,
            date: '10-09-2025',
        }        
    ]

    const [activeActions, setActiveActions] = useState([])

    useEffect(() => {
        fetchDailyMovements()
        fetchDailyTransactions()
        fetchActiveStocks()
    }, [])

    const fetchDailyMovements = async () => {
        try {
            const today = new Date().toISOString().split("T")[0]
            const response = await api.get(`/wallet/movements-admin/?date_from=${today}&date_to=${today}`)
            setMovesData(response.data)
        } catch (error) {
            // console.log("Error obteniendo movimientos del día", error)
            alert("Error to fetch daily movements")
        }
    }

    const fetchDailyTransactions = async () => {
        try {
            const today = new Date().toISOString().split("T")[0]
            const response = await api.get(`/transactions/report/?date_from=${today}&date_to=${today}`)
            setDailyTransactions(response.data)
        } catch (error) {
            // console.log("Error obteniendo transacciones del día", error)
            alert("Error to fetch daily transactions")
        }
    }

    const fetchActiveStocks = async () => {
        try {
            const response = await api.get("/stocks-admin/")
            const stocks = response.data

            const filtered = stocks
                .filter(stock => stock.is_active === true)
                .slice(0, 4)

            setActiveActions(filtered)
        } catch (error) {
            // console.log("Error obteniendo acciones activas", error)
            alert("Error to fetch active stocks")
        }
    }

    return (
        <>
            <SidebarNavAdmin/>
            <div className="main-container-AH">
                <div className="greating-admin">
                    <div className="greeting-text">
                        <h1>Hello, Admin</h1>
                    </div>
                </div>
                <div className="sections-configurate">
                    <div className="section-tables">
                        <div className="container-UC">
                            <h3>Daily Movements</h3>
                            <div className="tableContainer">
                                <TableAdmin  columns={movesColumns} data={movesData} btnVerification={false}/>
                            </div>
                        </div>

                        <div className="container-UC">
                            <h3>Daily Transactions</h3>
                            <div className="tableContainer">
                                <TableAdmin  columns={dayTransactionColumns} data={dayUsers} btnVerification={false}/>
                            </div>
                        </div>
                    </div>

                    <div className="section-actions">
                        <div className="actions-summary-container">
                            <div className="summary-header">
                                <h3>Latest Active Actions</h3>
                            </div>

                            <div className="summary-actions-list">
                                {activeActions.map((action) => (
                                    <ActionAdminCard key={action.id} title={action.name}>
                                        <div className="action-card-content-admin">
                                            <p className="price-action-do-admin">Price: ${action.current_price}</p>
                                            <p className="category-action-do">Category: {action.category_name}</p>
                                            <p className="status-action-do">Status: <strong>Active</strong></p>
                                        </div>
                                    </ActionAdminCard>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}
