'use client'

import { useEffect, useState } from "react";
import "../styles/GeneralBalancePortfolio.css";
import CircularGraph from "./DoughnutGraph";
import { api } from "../lib/axios";
import ActionPortfolio from '../components/ActionPortfolio'


export default function CardInfoPortafolio(){
    const [totalAction, setTotalAction] = useState({total: 0})
    const [currentTotalActions, setCurrentTotalActions] = useState({total: 0})
    const [wallet, setWallet] = useState({balance: 0})
    const [totalAssets, setTotalAssets] = useState(0)
    const [date1, setdate1] = useState("");
    const [date2, setdate2] = useState("");

        // Aqui guardaremos la info para cada tarjeta
    const [highestPerformanceAction, setHighestPerformanceAction] = useState({
        name: '-', weight_percentage: 0, performance_percentage: 0
    })
    const [lowestPerformanceAction, setLowestPerformanceAction] = useState({
        name: '-', weight_percentage: 0, performance_percentage: 0
    })

    const [highestWeightAction, setHighestWeightAction] = useState({
        name: '-', weight_percentage: 0, performance_percentage: 0
    })
    const dataGeneral = [
        {
            name: highestPerformanceAction.name,
            description: 'More highest',
            svg: <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h1v16H0V0zm1 15h15v1H1v-1z"></path><path fillRule="evenodd" d="M14.39 4.312L10.041 9.75 7 6.707l-3.646 3.647-.708-.708L7 5.293 9.959 8.25l3.65-4.563.781.624z" clipRule="evenodd"></path><path fillRule="evenodd" d="M10 3.5a.5.5 0 01.5-.5h4a.5.5 0 01.5.5v4a.5.5 0 01-1 0V4h-3.5a.5.5 0 01-.5-.5z" clipRule="evenodd"></path></svg>,        
            percentage: highestPerformanceAction.weight_percentage,
            rendimiento: highestPerformanceAction.performance_percentage
        }, {
            name: lowestPerformanceAction.name,
            svg: <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h1v16H0V0zm1 15h15v1H1v-1z"></path><path fillRule="evenodd" d="M14.39 9.041l-4.349-5.436L7 6.646 3.354 3l-.708.707L7 8.061l2.959-2.959 3.65 4.564.781-.625z" clipRule="evenodd"></path><path fillRule="evenodd" d="M10 9.854a.5.5 0 00.5.5h4a.5.5 0 00.5-.5v-4a.5.5 0 00-1 0v3.5h-3.5a.5.5 0 00-.5.5z" clipRule="evenodd"></path></svg>,
            description: 'Less highest',
            percentage: lowestPerformanceAction.weight_percentage,
            rendimiento: lowestPerformanceAction.performance_percentage
        },{
            svg: <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h1v16H0V0zm1 15h15v1H1v-1z"></path><path fillRule="evenodd" d="M14.39 4.312L10.041 9.75 7 6.707l-3.646 3.647-.708-.708L7 5.293 9.959 8.25l3.65-4.563.781.624z" clipRule="evenodd"></path><path fillRule="evenodd" d="M10 3.5a.5.5 0 01.5-.5h4a.5.5 0 01.5.5v4a.5.5 0 01-1 0V4h-3.5a.5.5 0 01-.5-.5z" clipRule="evenodd"></path></svg>,        
            name: highestWeightAction.name,
            description: 'Most Weight',
            percentage: highestWeightAction.weight_percentage,
            rendimiento: highestWeightAction.performance_percentage
        }
    ]

        useEffect(()=>{

        const getHighestPerformanceAction = async () => {
            try{
                const response = await api.get('/portfolios/highest_performance/')

                console.log('HighestPerformanceAction', response.data)
                setHighestPerformanceAction(response.data)
            }catch(error){
                console.log("HighestPerformanceAction ERROR", error)
                alert(error)
            }
        }

        const getLowestPerformanceAction = async () => {
            try{
                const response = await api.get('/portfolios/lowest_performance/')

                console.log('LowesttPerformanceAction', response.data)
                setLowestPerformanceAction(response.data)
            }catch(error){
                console.log("LowestPerformanceAction ERROR", error)
                alert(error)
            }
        } 

        const getHighestWeightAction = async () => {
            try{
                const response = await api.get('/portfolios/highest_weight/')

                console.log('HighestWeightAction', response.data)
                setHighestWeightAction(response.data)
            }catch(error){
                console.log("HighestWeightAction ERROR", error)
                alert(error)
            }
        }
        getHighestPerformanceAction()
        getLowestPerformanceAction()
        getHighestWeightAction()
        

    }, [])

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
                const response = await api.get('/wallet/me')
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
        clasificacion: ['Assets', 'Cash'],
        name: 'General Balance (%)',
        dataL: [30, 70],
        widthSend: 300,
        heightSend: 300,
        num: 2,
        display: true
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
                        <h1>General Balance</h1>

                        <div className="section-group">
                            <h4>Current Values</h4>
                            <div className="data-container-portafolio">
                                <div className="row">
                                    <p className="title">Cash</p>
                                    <p className="value">${wallet.balance.toFixed(2)}</p>
                                </div>
                                <div className="row">
                                    <p className="title">Assets</p>
                                    <p className="value">${currentTotalActions.total.toFixed(2)}</p>
                                </div>
                            </div>
                        </div>

                        <div className="section-group">
                            <h4>Totals</h4>
                            <div className="data-container-portafolio">
                                <div className="row">
                                    <p className="title">Total Assets</p>
                                    <p className="value">${(parseFloat(wallet.balance) + parseFloat(currentTotalActions.total)).toFixed(2)}</p>
                                </div>
                                <div className="row">
                                    <p className="title">Total Invested</p>
                                    <p className="value">${totalAction.total.toFixed(2)}</p>
                                </div>
                                <div className="row">
                                    <p className="title">Accumulated Result</p>
                                    <p className="value">${(
                                        (parseFloat(currentTotalActions.total) + parseFloat(wallet.balance)) -
                                        parseFloat(totalAction.total)).toFixed(2)}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

            </div>
                                {( <div className="cap-container-portafolio">
                            {dataGeneral.map((dat, index) =>(
                                    <ActionPortfolio key={index} data={dat}>
                                        <div className="subtitles">
                                            <p>Weight: {(dat.percentage).toFixed(2)}%</p>
                                            <p>Performance: {(dat.rendimiento).toFixed(2)}%</p>
                                        </div>

                                    </ActionPortfolio>
                            ))
                            }
                    </div>)}

        </>
    )
}