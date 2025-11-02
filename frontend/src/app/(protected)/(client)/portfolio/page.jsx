"use client";

import './portfolio.css'
import GreetingPortafolio from '@/app/components/GreetingPortfolio'
import CardInfoPortafolio from '@/app/components/GeneralBalancePortfolio'
import { useEffect, useState } from 'react';
import SidebarNav from '@/app/components/SidebarNav-Auth';
import CardActionsPortfolio from '@/app/components/CardActionsPortfolio';


export default function Portafolio (){
    // Datos que voy a necesitar para portafolio
    // Datos de acciones
    const [seeAction, setSeeAction] = useState(false)

    return (
        <>
            <SidebarNav/>
            <div className="main-container-portafolio">
                <div className="horizontal-container-portafolio">
                    <div className="vertical-container-info-portafolio">
                        <GreetingPortafolio message={'Let’s see how your portfolio is growing today.'}/>
                        
                        <div className="main-card-info-container-portafolio">
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
                                    <CardActionsPortfolio/>   
                                )}

                                {!seeAction && (
                                    <CardInfoPortafolio/>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}