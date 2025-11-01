"use client";

import { api } from "../lib/axios";
import "../styles/GreetingPortfolio.css";
import { useEffect, useState } from 'react'
import Modal from '../components/Modal';

export default function GreetingPortafolio({message}){
    const [getDate, setgetDate] = useState(false)
    const [getInforme, setGetInforme] = useState(false)
    const [name, setName] = useState('')
    const [date1, setdate1] = useState("");
    const [date2, setdate2] = useState("");
    const [reportAlert, setReportAlert] = useState(false)

    const validateDate = () => {
        const fechaInicio = new Date(date1);
        const fechaFin = new Date(date2);

        const diffMs = Math.abs(fechaFin - fechaInicio);
        const diffDias = diffMs / (1000 * 60 * 60 * 24);

        if (diffDias <=90){
            return diffDias;
        }else{
            throw new Error('El tiempo excede los tres meses')
        }
    }

    useEffect(()=>{
        const getName = async () =>{
            try{
                const response =  await api.get('/users/getname')
                setName(response.data.name)
                
            }catch(erro){
                alert("Error get Name")
            }
        }
        getName()
    }, [])

    const clickInforme = async () => {
        try{
            validateDate()
            const response = await api.post('/reports/',{
                from: date1, 
                to: date2
            })
            setReportAlert(true)

        }catch(error){
            console.log("No funciono :(", error)
            alert(error)
        }
        clickGetDate()
    }
    const clickGetDate =async() => {
        if (!getDate && !getInforme){
            setgetDate(true)
        }else{
            setgetDate(false)
            setGetInforme(false)
        }
    }

    const hoy = new Date().toISOString().split("T")[0];

    return (
        <>
            <div className="greeting-main-container-portafolio">
                <div className="greeting-container-portafolio">
                    <h1 className="welcome-message-portafolio">Hi {name}!</h1>
                    <p className="message-portafolio">{message}</p>
                </div>
                <div className="btn-container-greeting"> 
                    <div className="btn-container">
                        <div className="algo2">
                        <button className="btn-get-date-email-portfolio" onClick={clickGetDate}>
                            <p className="btn-title">Send Email Report</p>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M840.4 300H183.6c-19.7 0-30.7 20.8-18.5 35l328.4 380.8c9.4 10.9 27.5 10.9 37 0L858.9 335c12.2-14.2 1.2-35-18.5-35z"></path></svg>
                        </button>
                        {getDate && (
                            <div className="filter">
                                <div className="filter-segments">
                                    <p>Date</p>
                                    <div className="date-inputs-filter">
                                        <p>From:</p>
                                        <input
                                            type="date"
                                            value={date1}
                                            onChange={(e)=> setdate1(e.target.value)}
                                            max={hoy}
                                        />
                                    </div>

                                    <div className="date-inputs-filter-to">
                                        <p>To:</p>
                                        <input
                                            type="date"
                                            value={date2}
                                            onChange={(e)=> setdate2(e.target.value)}
                                            max={hoy}
                                        />
                                    </div>
                                </div>

                                <button className="apply-filter-btn" onClick={()=>{clickInforme()}}>
                                    Send
                                </button>
                            </div>
                        )}
                        </div>
                    </div>
                    <div className="btn-container">
                        <a href="/purchases-sales">
                            <p className="btn-title">History</p>
                            <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 1024 1024" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M715.8 493.5L335 165.1c-14.2-12.2-35-1.2-35 18.5v656.8c0 19.7 20.8 30.7 35 18.5l380.8-328.4c10.9-9.4 10.9-27.6 0-37z"></path></svg>
                        </a>
                    </div>
                    
                </div>
            </div>
                {reportAlert && (
                    <Modal isOpen={reportAlert} title='Email Send'>
                        <div className="reportAlert">
                            <div className="p-container">
                                <p className='text'>The email has alredy been sent</p>
                                <p className='date'>From: {date1} To: {date2}</p>
                            </div>
                            <button className="btn-get-pdf" onClick={()=> {setReportAlert(false), setdate1(''), setdate2('')}}>Accept</button>
                        </div>
                    </Modal>
                )}
        </>
    )
} 