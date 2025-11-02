import DoughnutGraph from "./DoughnutGraph"
import ActionPortfolio from "./ActionPortfolio"
import '../styles/CardActionsPortfolio.css'
import { useEffect, useState } from "react"
import { api } from "../lib/axios"


export default function CardActionsPortfolio() {
    const [portfolio, setPortfolio] = useState([])
    const [clasification, setClasification] = useState([])
    const [percentage, setPercentage] = useState([])
    const dataL = {
        activo: 100,
        efectivo: 200,
        resultado: 500
    }

    useEffect(()=>{
        const getPortfolios = async () =>{
            try{
                const response = await api.get('/portfolios/')
                const data = response.data
                setPortfolio(data)
                console.log('Portafolio :)', response.data)
                setClasification(data.map(dat => dat.stock_name));
                setPercentage(data.map(dat => dat.weight_percentage))
            }catch(err){
                console.log("Portafolio no se obtuvieron", error)
            }
        }
        getPortfolios()
    }, [])

    const graphData = {
        clasificacion: clasification,
        name: 'Percentage(%)',
        dataL: percentage,
        widthSend: 250,
        heightSend: 250,
        num: portfolio.length,
        display: false
    }
    return (
        <>
            <div className="main-container-CAP">
                <div className="info-CAP-container">
                    <div className="CAP-graph">
                        <h1 className="title-CAP">Purchased Shares</h1>
                        <DoughnutGraph graphData={graphData}/>
                    </div>
                    <div className="CAP-actions">
                        
                        {portfolio.map((dat, index) =>(
                            <ActionPortfolio key={index} data={dat}>
                                <p>Stock: {dat.quantity}</p>
                                <p>Cost: {(dat.total_cost / dat.quantity).toFixed(2)}</p>
                            </ActionPortfolio>
                        ))}
                    </div>
                    
                </div>
            </div>
        </>
    )
}