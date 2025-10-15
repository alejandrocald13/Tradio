import "../styles/GeneralBalancePortfolio.css";
import CircularGraph from "./DoughnutGraph";

export default function CardInfoPortafolio(){
    const dataL = {
        activo: 100,
        efectivo: 200,
        resultado: 500
    }

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
            <div className="card-info-container-portafolio">
                    <div className="graph">
                        <CircularGraph 
                            graphData={graphData}
                        />
                    </div>
                    <div className="more-Info-portafolio">
                        <div className="data-container-portafolio">
                            <p className="data-portafolio">
                            <span className="label">Total En Activos</span>
                            <span className="value"> ${dataL.activo}</span>
                            </p>
                        </div>

                        <div className="data-container-portafolio">
                            <p className="data-portafolio">
                            <span className="label">Total En Efectivo</span>
                            <span className="value"> ${dataL.efectivo}</span>
                            </p>
                        </div>

                        <div className="data-container-portafolio">
                            <p className="data-portafolio">
                            <span className="label">Resultado Acumulado</span>
                            <span className="value"> ${dataL.resultado}</span>
                            </p>
                    </div>
                </div>

            </div>
        </>
    )
}