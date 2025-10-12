'use client'

import { useEffect, useState } from "react"
import Greeting from "../components/GreetingPortfolio"
import TableAdmin from "../components/TableAdmin"
import './adminHome.css'

export default function AdminHome () {
    useEffect(() => {
        // Aqui obtendremos los usuarios del dia
        // Las transacciones del dia
    })
    const dayUserColumns = ['Name', 'UserName', 'Email', 'Age', 'Fecha']
    const dayTransactionColumns = ['Name', 'UserName', 'Email', 'Age', 'Fecha']
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
    return (
        <>
            <div className="main-container-AH">
                <div className="greating-admin">
                    <Greeting message={'Welcome to the control panel. Authorize users, activate market actions, and review financial activity in real time.'}/>
                </div>
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
        </>
    )
}