"use client";

import "../styles/GreetingPortfolio.css";
import { useState } from 'react'

export default function GreetingPortafolio(){
    // Datos que necesito aca
    // Nombre
    const name = 'Daniela'
    return (
        <>
            <div className="greeting-main-container-portafolio">
                <div className="greeting-container-portafolio">
                    <h1 className="welcome-message-portafolio">Hola {name}!!</h1>
                    <p className="message-portafolio">Veamos cómo crece tu portafolio hoy.</p>
                </div>
                <div className="image-container-portafolio"> 
                </div>
            </div>
        </>
    )
} 