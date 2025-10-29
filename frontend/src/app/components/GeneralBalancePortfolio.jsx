'use client'

import { useEffect, useState } from "react";
import "../styles/GeneralBalancePortfolio.css";
import CircularGraph from "./DoughnutGraph";
import { api } from "../lib/axios";

export default function CardInfoPortafolio(){
    const [totalAction, setTotalAction] = useState({total: 0})
    const [currentTotalActions, setCurrentTotalActions] = useState({total: 0})
    const [wallet, setWallet] = useState({balance: 0})
    const [totalAssets, setTotalAssets] = useState(0)

    useEffect(()=>{
        const getTotalActions = async () =>{
            try{
                const response = await api.get('/portfolios/total/')
                setTotalAction(response.data)
                console.log("RESPUESRA1", response.data)
            }catch(error){
                console.log("Error al obtener el total invertido en acciones", error)
            }
        }

        const getCurrentTotalActions = async () =>{
            try{
                const response = await api.get('/portfolios/current_total/')
                setCurrentTotalActions(response.data)
                console.log("RESPUESRA2", response.data)

            }catch(error){
                console.log("Error al obtener el total actual en acciones", error)
            }
        }

        const getWallet = async () =>{
            try{
                const response = await api.get('/wallet/balance/')
                setWallet(response.data)
                console.log("RESPUESRA3", response.data)

            }catch(error){
                console.log("Error al obtener total en efectivo", error)
            }
        }

        getTotalActions()
        getCurrentTotalActions()
        getWallet()
    }, [])

    const graphData = {
        clasificacion: ['Activos', 'Efectivo'],
        name: 'Balance General',
        dataL: [30, 70],
        widthSend: 230,
        heightSend: 230,
        num: 2
    }

    return (
        <>
            <div className="card-info-container-portafolio">
                    <div className="graph">
                        <CircularGraph 
                            graphData={graphData}
                        />
                    </div>
                    <div className="more-Info-portafolio">
                        <div className="data-container-portafolio">
                            <p className="label">Cash</p>
                            <p className="label">Assets</p>
                            <p className="label">Total Assets</p>
                            <p className="label">Total Invested</p>
                            <p className="label">Accumulated Result</p>
                        </div>

                        <div className="data-container-portafolio">
                            <p className="value"> ${wallet.balance}</p>
                            <p className="value"> ${currentTotalActions.total}</p>
                            <p className="value"> ${parseFloat(wallet.balance) + parseFloat(currentTotalActions.total)}</p>
                            <p className="value"> ${totalAction.total}</p>
                            <p className="value"> ${(parseFloat(currentTotalActions.total) + parseFloat(wallet.balance)) - parseFloat(totalAction.total)}</p>
                        </div>
                    </div>

            </div>
        </>
    )
}