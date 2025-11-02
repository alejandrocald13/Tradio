'use client'

import { useEffect, useMemo, useState } from "react"
import TableAdmin from "../components/TableAdmin"
import SidebarNavAdmin from "../components/SidebarNav-Admin"
import ActionAdminCard from "../components/ActionAdminCard"
import ActionADailyCard from "../components/ActionADailyCard"
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



    const movesColumns = ['Type', 'User Email', 'Amount']

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
    const transationColumns = ['Type', 'User Email', 'Action', 'Quantity', 'Total']


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
                <TableAdmin columns={movesColumns} data={movesData} btnVerification={false} type={'home'}/>
              </div>
            </div>

            <div className="container-UC">
              <h3>Daily Transactions</h3>
              <div className="tableContainer">
                <TableAdmin columns={transationColumns} data={txData} btnVerification={false} type={'home'}/>
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
                  <ActionADailyCard key={action.id} title={action.name}>
                    <div className="action-card-content-admin">
                      <div className="action-info-group">
                        <p className="price-action-do-admin">Price: ${action.current_price}</p>
                        <p className="category-action-do">Category: {action.category_name}</p>
                      </div>
                      <p className="status-action-do">Status: <strong>Active</strong></p>
                    </div>
                  </ActionADailyCard>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
