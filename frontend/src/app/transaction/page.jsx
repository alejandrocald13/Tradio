'use client'


import { useEffect, useState } from "react"
import './transaction.css'
import TableAdmin from "../components/TableAdmin"
import SidebarNavAdmin from '@/app/components/SidebarNav-Admin'
import Searcher from "../components/Searcher"
import { responseCookiesToRequestCookies } from "next/dist/server/web/spec-extension/adapters/request-cookies"
import { api } from "../lib/axios"

export default function Transaction(){
    const [showFilter, setShowFilter] = useState(false)
    const [typeSelected, setTypeSelected] = useState("") // Filtro de tipo
    const [selectedAction, setSelectedAction] = useState("") // Filtro de Accion 
    const [date1, setdate1] = useState(""); // Filtro de fecha 1
    const [date2, setdate2] = useState(""); // FIltro fecha 2
    const [email, setEmail] = useState(""); // Email
    const hoy = new Date().toISOString().split("T")[0];
    const [usersData, setUsersData] = useState([]) // En esta variable va la info que obtenemos de usersData (Enviarla en componente tabla )
    const [actions, setActions] = useState([])


    useEffect(()=>{
        // Aqui va endpoint para obtener usuarios y utilizar filtros
        // Si el usuario no ha elegido un filtro estos estan ""
        const login = async () => {
             try{
                 const response = await api.post('/token/', {
                     email: 'robertoalejandrocalderon@gmail.com',
                     password: 'Tradio1309.'
                 })

                 console.log('Login correcto', response.data)
             }catch(error){
                 console.log("No se logró confirmar las credenciales", error)
                 setErrorMessage(error.response?.data?.detail || "Error al iniciar sesión");
             }
         }
         login()
        console.log("Tipo", typeSelected)
        console.log("aCCION", selectedAction)
        console.log("d1", date1)
        console.log("d2", date2)

    }, [showFilter, email])

    useEffect(()=> {
        const getActions = async () =>{
            try{
                const response = await api.get('/stocks/')
                const data = response.data
                
                const formattedData = data.map(dat => ({
                    name: dat.name,
                    symbol: dat.symbol,
                    id: dat.id
                }));

                setActions(formattedData);
                console.log(formattedData);

                
            }catch(error){
                console.log("Error al obtener acciones disponibles en bd", error)
            }
        }
        getActions()
        
    }, [])

    const changeShowFiler = () => {
        if(showFilter){
            setShowFilter(false)
        }else{
            setShowFilter(true)
        }
    }

    const getDataSearcher = (data) => {
        setEmail(data)
    }

    const transationColumns = ['Type', 'User Email', 'Action', 'Quantity', 'Total', 'Date']
    const transactionData = [
        {
            'Type': 'Sale',
            'User Email': 'pedrito@gmail.com',
            'Action': 'Oracle',
            'Quantity': 10,
            'Total': 800,
            'Date': '12/04/2025'
        },
        {
            'Type': 'Purchases',
            'User Email': 'pedrito@gmail.com',
            'Action': 'Oracle',
            'Quantity': 5,
            'Total': 800,
            'Date': '12/08/2025'
        },
        {
            'Type': 'Sale',
            'User Email': 'pedrito@gmail.com',
            'Action': 'Oracle',
            'Quantity': 10,
            'Total': 800,
            'Date': '12/04/2025'
        },
        {
            'Type': 'Sale',
            'User Email': 'pedrito@gmail.com',
            'Action': 'Oracle',
            'Quantity': 10,
            'Total': 800,
            'Date': '12/04/2025'
        },
        {
            'Type': 'Sale',
            'User Email': 'pedrito@gmail.com',
            'Action': 'Oracle',
            'Quantity': 10,
            'Total': 800,
            'Date': '12/04/2025'
        }
    ]
    
    return (
        <>
            <SidebarNavAdmin/>
            <div className="main-container-AT">
                <div className="header-AT">
                    
                    <div className="filtro-TA">
                        <button className='open-filter-btn' onClick={changeShowFiler}>
                            <p>Filter</p>
                            <svg stroke="currentColor" fill="currentColor" stroke-width="0" viewBox="0 0 24 24" height="1em" width="1em" xmlns="http://www.w3.org/2000/svg"><path d="M10 18h4v-2h-4v2zM3 6v2h18V6H3zm3 7h12v-2H6v2z"></path></svg>
                        </button>
                        {showFilter && (
                            <div className="filter">
                                <div className="filter-segments">
                                    <p>Type</p>
                                    <select name="algo" id="1" value={typeSelected} onChange={(e) => setTypeSelected(e.target.value)}>
                                        <option value="" disabled>Select Type</option>
                                        <option value="Sale">Sale</option>
                                        <option value="Purchases">Purchases</option>
                                    </select>
                                </div>
                                <div className="filter-segments">
                                    <p>Action</p>
                                    <select name="algo" id="1" value={selectedAction} onChange={(e) => setSelectedAction(e.target.value)}>
                                        <option value="" disabled>Select Type</option>
                                        {actions.map((action) => (
                                                <option value={action.symbol}>{action.name}</option>
                                        ))}
                                    </select>
                                </div>
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
                                <button className="apply-filter-btn" onClick={changeShowFiler}>
                                    Apply Filter
                                </button>
                            </div>
                        )}
                    </div>
                    <Searcher placeholderI={'Enter email'}getValue={getDataSearcher} />
                </div>
                <div className="table-transaction-AT">
                    <TableAdmin columns={transationColumns} data={transactionData} btnVerification={false}/>
                </div>
            </div>
        </>
    )
}