'use client'

import { useEffect, useMemo, useState } from "react"
import TableAdmin from "../components/TableAdmin"
import SidebarNavAdmin from "../components/SidebarNav-Admin"
import ActionAdminCard from "../components/ActionAdminCard"
import { api } from "../lib/axios"
import './adminHome.css'

export default function AdminHome () {
    const dayTransactionColumns = ['Type', 'User Email', 'Action', 'Quantity', 'Total', 'Date'];

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

    const [activeActions, setActiveActions] = useState([])
    
    useEffect(() => {
        const fetchActiveStocks = async () => {
            try {
                const response = await api.get("/stocks-admin/");
                const stocks = response.data;

                const filtered = stocks
                    .filter(stock => stock.is_active)
                    .slice(0, 4);

                setActiveActions(filtered);
            } catch (error) {
                console.error("Error fetching active stocks:", error);
                alert("Error fetching active stocks");
            }
    };
        fetchActiveStocks();
    }, []);

  useEffect(() => {
    const fetchDaily = async () => {
      try {
        const [movesRes, txRes] = await Promise.all([
          api.get(`/wallet/movements/?date_from=${today}&date_to=${today}`),
          api.get(`/transactions/report/?date_from=${today}&date_to=${today}`)
        ])
        setMovesData(movesRes.data || [])
        setTxData(txRes.data || [])
      } catch (err) {
        console.error("Error fetching admin daily data", err)
        setMovesData([])
        setTxData([])
      }
    }
    fetchDaily()
  }, [today])

  const movesColumns = ['Type', 'User Email', 'Amount', 'Date']
  const transationColumns = ['Type', 'User Email', 'Action', 'Quantity', 'Total', 'Date']

  const actions = [
    { id: 1, name: "Apple Inc.", price: 185.32, category: "tech", active: true },
    { id: 2, name: "Microsoft Corp.", price: 328.50, category: "tech", active: true },
    { id: 3, name: "Pfizer Inc.", price: 35.20, category: "healthcare", active: true },
    { id: 4, name: "NVIDIA Corp.", price: 459.20, category: "tech", active: true },
    { id: 5, name: "Coca-Cola", price: 58.44, category: "consumer", active: true },
    { id: 6, name: "Bank of America", price: 30.22, category: "financials", active: true  },
    { id: 7, name: "Coca-Cola", price: 58.44, category: "consumer", active: true  },
    { id: 8, name: "Procter & Gamble", price: 142.65, category: "consumer", active: true  },
    { id: 9, name: "ExxonMobil", price: 110.12, category: "energy", active: true  },
  ]

  const activeActions = actions.filter(a => a.active).slice(0, 4)

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
                <TableAdmin columns={movesColumns} data={movesData} btnVerification={false}/>
              </div>
            </div>

            <div className="container-UC">
              <h3>Daily Transactions</h3>
              <div className="tableContainer">
                <TableAdmin columns={transationColumns} data={txData} btnVerification={false}/>
              </div>
            </div>
          </div>

                    <div className="section-actions">
                        <div className="actions-summary-container">
                            <div className="summary-header">
                                <h3>Some active actions</h3>
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
