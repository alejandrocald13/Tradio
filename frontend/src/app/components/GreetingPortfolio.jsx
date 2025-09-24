"use client";

import "../styles/GreetingPortfolio.css";
import { useState } from 'react'

export default function GreetingPortafolio(){
    // Datos que necesito aca
    // Nombre
    const name = 'Daniela'
    const [getInforme, setGetInforme] = useState(false)
    
        const clickInforme = () => {
            if (getInforme){
                setGetInforme(false)
            } else{
                setGetInforme(true)
            }
        }
    return (
        <>
            <div className="greeting-main-container-portafolio">
                <div className="greeting-container-portafolio">
                    <h1 className="welcome-message-portafolio">Hola {name}!!</h1>
                    <p className="message-portafolio">Veamos cómo crece tu portafolio hoy.</p>
                </div>
                <div className="image-container-portafolio">
                         <div className="getPDF">
                            <button className="btn-get-pdf" onClick={clickInforme}>
                                Enviar Informe
                            </button>
                                {getInforme &&(
                                    <>
                                        <p>Aqui </p>
                                        <p>pediremos </p>
                                        <p>fechas </p>


                                    </>
                                )}

                        </div>
                        <div className="historial-container">
                            <a href="http://localhost:3000" className="historial-link">
                                Ver Historial
                            </a>
                        </div>
                </div>
            </div>
        </>
    )
} 