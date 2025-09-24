"use client";

import './portfolio.css'
import GreetingPortafolio from '../components/GreetingPortfolio'
import CardInfoPortafolio from '../components/GeneralBalancePortfolio'
import CardActionPortafolio from '../components/ActionPortfolio'
import { useState } from 'react';


export default function Portafolio (){
    // Datos que voy a necesitar para portafolio
    // Datos de acciones
    const [getDate, setgetDate] = useState(false)
    const [getInforme, setGetInforme] = useState(false)
    const [date1, setdate1] = useState("");
    const [date2, setdate2] = useState("");

    const hoy = new Date().toISOString().split("T")[0];
    const handleChangeD1 = (e) => {
        setdate1(e.target.value);
    };

    const handleChangeD2 = (e) => {
        setdate2(e.target.value);
    };

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
    
    const clickInforme = () => {
        setGetInforme(getInforme ? false : true)
        if (getInforme){
            // Aqui mandamos a llamar para enviar gmail
        }
        clickGetDate()
    }
    const clickGetDate = () => {
        if (!getDate && !getInforme){
            setgetDate(true)
        }else{
            setgetDate(false)
            setGetInforme(false)
            setdate1('');
            setdate2('');
        }
    }

    return (
        <>
            <div className="main-container-portafolio">
                <div className="horizontal-container-portafolio">
                    <div className="vertical-container-info-portafolio">
                        <GreetingPortafolio/>
                        <CardInfoPortafolio/>

                        <div className="cap-container-portafolio">
                            {dataGeneral.map((dat) =>(
                                <CardActionPortafolio data={dat}/>))
                            }
                        </div>
                    </div>
                    
                    <div className="vertical-container-actions-portafolio">
                        <div className="btn-get-date-email-portfolio">
                            <p className="btn-title">Informe Por Email</p>
                            <button className="btn" onClick={clickGetDate}>
                                <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"></path></svg>
                            </button>
                        </div>

                        {getDate && (<div className="inputs-date-portfolio">
                            <div className="date-inputs-portfolio">
                                <p>Desde:</p>
                                <input 
                                    type="date" 
                                    value={date1} 
                                    onChange={handleChangeD1} 
                                    max={hoy} 
                                />
                            </div>

                            <div className="date-inputs-portfolio">
                                <p>Hasta:</p>
                                <input 
                                    type="date" 
                                    value={date2} 
                                    onChange={handleChangeD2} 
                                    max={hoy} 
                                />
                            </div>

                            <div className="getPDF">
                                <button className="btn-get-pdf" onClick={clickInforme}>
                                    Enviar Informe
                                </button>
                            </div>
                        </div>)}

                        <div className="btn-get-date-email-portfolio">
                            <p className="btn-title">Historial</p>
                            <a href="/purchases-sales">
                                    <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M715.8 493.5L335 165.1c-14.2-12.2-35-1.2-35 18.5v656.8c0 19.7 20.8 30.7 35 18.5l380.8-328.4c10.9-9.4 10.9-27.6 0-37z"></path></svg>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}