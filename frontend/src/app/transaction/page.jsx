'use client'


import { useState } from "react"
import './transaction.css'
import TableAdmin from "../components/TableAdmin"
import SidebarNavAdmin from '@/app/components/SidebarNav-Admin'

export default function Transaction(){
    const [selectedTable, setSelectedTable] = useState('transaction')
    // Vamos a necesitar dos endpoints 
    // 1. Obtenemos datos de transacciones
    // 2. Obtenemos datos de movimiento
    const columns = ['data1', 'data2', 'data3', 'data4', 'data5']
    const data = [
        {
            id: 1,
            name: 'Daniela2 Matul',
            userName: 'Danim',
            email: 'dani@gmail.com',
            age: 19,
            date: '10-09-2025'
        }, 
        {
            id: 2,
            name: 'Daniela2 Matul',
            userName: 'Danim',
            email: 'dani@gmail.com',
            age: 19,
            date: '10-09-2025'
        },
        {
            id: 3,
            name: 'Daniela Matul',
            userName: 'Danim',
            email: 'dani@gmail.com',
            age: 19,
            date: '10-09-2025'
        },
        {
            id: 4,
            name: 'Daniela Matul',
            userName: 'Danim',
            email: 'dani@gmail.com',
            age: 19,
            date: '10-09-2025'
        }  
        
        ,
        {
            id: 5,
            name: 'Daniela Matul',
            userName: 'Danim',
            email: 'dani@gmail.com',
            age: 19,
            date: '10-09-2025'
        },
        {
            id: 6,
            name: 'Daniela Matul',
            userName: 'Danim',
            email: 'dani@gmail.com',
            age: 19,
            date: '10-09-2025'
        },
        {
            id: 7,
            name: 'Daniela Matul',
            userName: 'Danim',
            email: 'dani@gmail.com',
            age: 19,
            date: '10-09-2025'
        },
        {
            id: 8,
            name: 'Daniela Matul',
            userName: 'Danim',
            email: 'dani@gmail.com',
            age: 19,
            date: '10-09-2025'
        },
        {
            id: 9,
            name: 'Daniela Matul',
            userName: 'Danim',
            email: 'dani@gmail.com',
            age: 19,
            date: '10-09-2025'
        },
        {
            id: 10,
            name: 'Daniela Matul',
            userName: 'Danim',
            email: 'dani@gmail.com',
            age: 19,
            date: '10-09-2025'
        }         
    ]

    return (
        <>
            <SidebarNavAdmin/>
            <div className="main-container-AT">
                <div className="header-AT">

                </div>
                {selectedTable === 'transaction' && (<div className="table-transaction-AT">
                    <TableAdmin columns={columns} data={data} btnVerification={false}/>
                </div>)}
                <div className="table-move-AT">

                </div>
            </div>
        </>
    )
}