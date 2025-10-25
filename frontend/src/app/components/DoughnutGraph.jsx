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
    function generateShades(baseColor, n) {
        // baseColor = "#729c87"
        const r = parseInt(baseColor.slice(1, 3), 16);
        const g = parseInt(baseColor.slice(3, 5), 16);
        const b = parseInt(baseColor.slice(5, 7), 16);

        const colors = [];
        for (let i = 0; i < n; i++) {
            var alpha;
            if (n == 1){
                alpha = (0.4 + (0.6 * i) / (1)).toFixed(2);
            }else {
                alpha = (0.4 + (0.6 * i) / (n - 1)).toFixed(2);
            }
            colors.push(`rgba(${r}, ${g}, ${b}, ${alpha})`);

        }
        return colors;
    }
    const data = {
        labels: graphData.clasificacion,
        datasets: [
            {
                label: graphData.name,
                data: graphData.dataL,
                backgroundColor: generateShades("#729c87ff", graphData.num),
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
