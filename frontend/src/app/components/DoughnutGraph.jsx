"use client";

import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);


/* Si se va a llamar en otro componente hay que enviarle esta estructura
    const graphData = {
            clasificacion: ['Activos', 'Efectivo'],
            name: 'Balance General',
            dataL: [30, 70],
            widthSend: 200,
            heightSend: 200,
            backgroundColor: ["#729c8775", "#729c87ff"]
    }
*/
export default function DoughnutGraph({graphData}) {
    const data = {
        labels: graphData.clasificacion,
        datasets: [
            {
                label: graphData.name,
                data: graphData.dataL,
                backgroundColor: graphData.backgroundColor,
            },
        ]
    }

    const options = {
        cutout: "55%",
        plugins: {
            legend: {
                position: "bottom",
                labels: {
                    boxWidth: 15,            
                    padding: 20,              
                    color: "#333",  
                    font: {
                        size: 14
                    }         
                },
            },
        },
    };

  return (
    <>
        <div className="main-container-circular-graph" style={{width: graphData.widthSend, height: graphData.heightSend}}>
            <Doughnut data={data} options={options}/>
        </div>
    </>
  );
}
