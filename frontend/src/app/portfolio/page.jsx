"use client";

import './portfolio.css'
import GreetingPortafolio from '../components/GreetingPortfolio'
import CardInfoPortafolio from '../components/GeneralBalancePortfolio'
import CardActionPortafolio from '../components/ActionPortfolio'


export default function Portafolio (){
    // Datos que voy a necesitar para portafolio
    // Nombre del Usuario
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
    ]

    return (
        <>
            <div className="main-container-portafolio">
                <div className="sidebar-fixed">

                </div>
                <div className="horizontal-container-portafolio">
                    <div className="vertical-container-info-portafolio">
                        <GreetingPortafolio/>
                        <CardInfoPortafolio/>

                        <div className="cap-container-portafolio">
                            {dataGeneral.map((dat) =>(
                                <CardActionPortafolio data={dat}/>
                            ))
                            }


                        </div>
                    </div>
                    
                    <div className="vertical-container-actions-portafolio">

                        <div className="card-ve">
                            <p className="card-title">Informe Por Email</p>
                            <button className="card-btn">
                                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg">
                                <path d="M715.8 493.5L335 165.1c-14.2-12.2-35-1.2-35 18.5v656.8c0 19.7 20.8 30.7 35 18.5l380.8-328.4c10.9-9.4 10.9-27.6 0-37z"></path>
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}