"use client";

import './portfolio.css'
import GreetingPortafolio from '../components/GreetingPortfolio'
import CardInfoPortafolio from '../components/GeneralBalancePortfolio'
import ActionPortfolio from '../components/ActionPortfolio'
import { useState } from 'react';
import SidebarNav from '../components/SidebarNav-Auth';
import CardActionsPortfolio from '../components/CardActionsPortfolio';


export default function Portafolio (){
    // Datos que voy a necesitar para portafolio
    // Datos de acciones
    const [getDate, setgetDate] = useState(false)
    const [getInforme, setGetInforme] = useState(false)
    const [date1, setdate1] = useState("");
    const [date2, setdate2] = useState("");
    const [seeAction, setSeeAction] = useState(false)
    
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
        svg: <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h1v16H0V0zm1 15h15v1H1v-1z"></path><path fillRule="evenodd" d="M14.39 4.312L10.041 9.75 7 6.707l-3.646 3.647-.708-.708L7 5.293 9.959 8.25l3.65-4.563.781.624z" clip-rule="evenodd"></path><path fillRule="evenodd" d="M10 3.5a.5.5 0 01.5-.5h4a.5.5 0 01.5.5v4a.5.5 0 01-1 0V4h-3.5a.5.5 0 01-.5-.5z" clipRule="evenodd"></path></svg>,        
        percentage: 16,
        rendimiento: +12
        }, {
        name: 'Oracle',
        svg: <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h1v16H0V0zm1 15h15v1H1v-1z"></path><path fillRule="evenodd" d="M14.39 9.041l-4.349-5.436L7 6.646 3.354 3l-.708.707L7 8.061l2.959-2.959 3.65 4.564.781-.625z" clip-rule="evenodd"></path><path fillRule="evenodd" d="M10 9.854a.5.5 0 00.5.5h4a.5.5 0 00.5-.5v-4a.5.5 0 00-1 0v3.5h-3.5a.5.5 0 00-.5.5z" clipRule="evenodd"></path></svg>,
        description: 'Menos Rentable',
        percentage: 20,
        rendimiento: -1.8
        },{
        svg: <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 16 16" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M0 0h1v16H0V0zm1 15h15v1H1v-1z"></path><path fillRule="evenodd" d="M14.39 4.312L10.041 9.75 7 6.707l-3.646 3.647-.708-.708L7 5.293 9.959 8.25l3.65-4.563.781.624z" clip-rule="evenodd"></path><path fill-rule="evenodd" d="M10 3.5a.5.5 0 01.5-.5h4a.5.5 0 01.5.5v4a.5.5 0 01-1 0V4h-3.5a.5.5 0 01-.5-.5z" clipRule="evenodd"></path></svg>,        
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
            <SidebarNav/>
            <div className="main-container-portafolio">
                <div className="horizontal-container-portafolio">
                    <div className="vertical-container-info-portafolio">
                        <GreetingPortafolio/>
                        
                        <div className={seeAction ? "card-info-container-portafolio2" : "card-info-container-portafolio3"}>
                            <div className="all-content">
                                <div className="btnContainers">
                                    
                                    <button className={seeAction ? 'waiting': 'selected'} onClick={() => setSeeAction(false)}>
                                        GeneralBalance
                                    </button>
                                    <button className={!seeAction ? 'waiting': 'selected'} onClick={() => setSeeAction(true)}>
                                        Action
                                    </button>
                                </div>
                                {seeAction && (
                                    <>
                                        <CardActionsPortfolio/>
                                    </>
                                )}

                                {!seeAction && (
                                    <CardInfoPortafolio/>
                                )}
                            </div>
                        </div>

                        {!seeAction &&( <div className="cap-container-portafolio">
                            {dataGeneral.map((dat, index) =>(
                                <ActionPortfolio key={index} data={dat}/>))
                            }
                        </div>)}
                    </div>
                    
                    <div className="aux-conteiner-p">
                        <div className="vertical-container-actions-portafolio">
                            <div className="algo">

                                <button className="btn-get-date-email-portfolio" onClick={clickGetDate}>
                                    <p className="btn-title">Informe Por Email</p>
                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"></path></svg>
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

                            <div className="algo">
                                <a href="/purchases-sales">
                                    <p className="btn-title">Historial</p>
                                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M715.8 493.5L335 165.1c-14.2-12.2-35-1.2-35 18.5v656.8c0 19.7 20.8 30.7 35 18.5l380.8-328.4c10.9-9.4 10.9-27.6 0-37z"></path></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}