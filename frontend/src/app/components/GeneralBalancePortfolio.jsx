import "../styles/GeneralBalancePortfolio.css";
//import CircularGraph from "./DoughnutGraph";

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
        widthSend: 200,
        heightSend: 200,
        backgroundColor: ["#729c8775", "#729c87ff"]
    }

    return (
        <>
            <div className="card-info-container-portafolio">
                <div className="graph">
                    {/*<CircularGraph 
                        graphData={graphData}
                    />*/}
                </div>
                <div className="more-Info-portafolio">
                    <div className="data-container-portafolio">
                        <p className="data-portafolio">
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3v-3h18v3z"></path></svg>
                            Total En Activos  ${dataL.activo}
                        </p>
                    </div>

                    <div className="data-container-portafolio">
                        <p className="data-portafolio">
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3v-3h18v3z"></path></svg>
                            Total En Efectivo  ${dataL.efectivo}
                        </p>
                    </div>

                    <div className="data-container-portafolio">
                        <p className="data-portafolio">
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M21 3H3c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H3v-3h18v3z"></path></svg>
                            Resultado Acumulado  ${dataL.resultado}
                        </p>
                    </div>
                </div>
            </div>
        </>
    )
}