import DoughnutGraph from "./DoughnutGraph"
import ActionPortfolio from "./ActionPortfolio"
import '../styles/CardActionsPortfolio.css'


export default function CardActionsPortfolio() {
    const dataL = {
        activo: 100,
        efectivo: 200,
        resultado: 500
    }

    const dataGeneral = [
        {
        name: 'Tesla',
        description: 'Más Rentable',
        percentage: 16,
        rendimiento: +12
        }, {
        name: 'Oracle',
        description: 'Menos Rentable',
        percentage: 20,
        rendimiento: -1.8
        },{
        name: 'Amazon',
        description: 'Mayor Porcentaje',
        percentage: 25,
        rendimiento: +1
        }
        ,{
        name: 'Amazon',
        description: 'Mayor Porcentaje',
        percentage: 25,
        rendimiento: +1
        }
        ,{
        name: 'Amazon',
        description: 'Mayor Porcentaje',
        percentage: 25,
        rendimiento: +1
        }
    ]
    const graphData = {
        clasificacion: ['Activos', 'Efectivo'],
        name: 'Balance General',
        dataL: [30, 70],
        widthSend: 230,
        heightSend: 230,
        backgroundColor: ["#729c8775", "#729c87ff"]
    }
    return (
        <>
            <div className="main-container-CAP">
                <div className="info-CAP-container">
                    <div className="CAP-graph">
                        <h1 className="title-CAP">Acciones Compradas</h1>
                        <DoughnutGraph graphData={graphData}/>
                    </div>
                    <div className="CAP-actions">
                        
                        {dataGeneral.map((dat, index) =>(
                            <ActionPortfolio key={index} data={dat}/>))
                        }
                    </div>
                    
                </div>
            </div>
        </>
    )
}