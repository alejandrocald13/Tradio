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
                    <h1 className="welcome-message-portafolio">Hi {name}!!</h1>
                    <p className="message-portafolio">Let’s see how your portfolio is growing today.</p>
                </div>
                <div className="image-container-portafolio"> 
                </div>
            </div>
        </>
    )
} 