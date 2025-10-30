'use client'

import { useEffect, useMemo, useState } from "react"
import TableAdmin from "../components/TableAdmin"
import SidebarNavAdmin from "../components/SidebarNav-Admin"
import ActionAdminCard from "../components/ActionAdminCard"
import Link from "next/link"
import { api } from "../lib/axios"
import './adminHome.css'

export default function AdminHome () {
  const [movesData, setMovesData] = useState([])
  const [txData, setTxData] = useState([])

  const today = useMemo(() => {
    const d = new Date()
    // normaliza a fecha local YYYY-MM-DD (evita desfasar a día anterior por zona horaria)
    d.setMinutes(d.getMinutes() - d.getTimezoneOffset())
    return d.toISOString().slice(0, 10)
  }, [])

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
                <h3>Latest Active Actions</h3>
              </div>

              <div className="summary-actions-list">
                {activeActions.map((action) => (
                  <ActionAdminCard key={action.id} title={action.name}>
                    <div className="action-card-content-admin">
                      <p className="price-action-do-admin">Price: ${action.price.toFixed(2)}</p>
                      <p className="category-action-do">Category: {action.category}</p>
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
