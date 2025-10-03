'use client';

import { useEffect, useState } from "react";
import TableAdmin from "../components/TableAdmin"
import Modal from '../components/Modal'
import "./users.css"

export default function users() {
    const [users, setUsers] = useState([]);
    const [statusValue, setStatusValue] = useState(false)
    const [isOpen, setIsOpen] = useState(false)
    const [confirmation, setConfirmaton] = useState(false)
    const usersR = [
        {
            id: 1,
            name: 'Daniela Matul',
            userName: 'Danim',
            email: 'dani@gmail.com',
            age: 19,
            date: '10-09-2025',
            enable: false
        }, 
        {
            id: 2,
            name: 'Daniela Matul',
            userName: 'Danim',
            email: 'dani@gmail.com',
            age: 19,
            date: '10-09-2025',
            enable: true
        },
        {
            id: 3,
            name: 'Daniela Matul',
            userName: 'Danim',
            email: 'dani@gmail.com',
            age: 19,
            date: '10-09-2025',
            enable: true
        },
        {
            id: 4,
            name: 'Daniela Matul',
            userName: 'Danim',
            email: 'dani@gmail.com',
            age: 19,
            date: '10-09-2025',
            enable: false
        }  
        
        ,
        {
            id: 5,
            name: 'Daniela Matul',
            userName: 'Danim',
            email: 'dani@gmail.com',
            age: 19,
            date: '10-09-2025',
            enable: false
        },
        {
            id: 6,
            name: 'Daniela Matul',
            userName: 'Danim',
            email: 'dani@gmail.com',
            age: 19,
            date: '10-09-2025',
            enable: false
        },
        {
            id: 7,
            name: 'Daniela Matul',
            userName: 'Danim',
            email: 'dani@gmail.com',
            age: 19,
            date: '10-09-2025',
            enable: false
        },
        {
            id: 8,
            name: 'Daniela Matul',
            userName: 'Danim',
            email: 'dani@gmail.com',
            age: 19,
            date: '10-09-2025',
            enable: false
        },
        {
            id: 9,
            name: 'Daniela Matul',
            userName: 'Danim',
            email: 'dani@gmail.com',
            age: 19,
            date: '10-09-2025',
            enable: false
        },
        {
            id: 10,
            name: 'Daniela Matul',
            userName: 'Danim',
            email: 'dani@gmail.com',
            age: 19,
            date: '10-09-2025',
            enable: false
        },
        {
            id:11,
            name: 'Daniela Matul',
            userName: 'Danim',
            email: 'dani@gmail.com',
            age: 19,
            date: '10-09-2025',
            enable: false
        },
        {
            id: 12,
            name: 'Daniela Matul',
            userName: 'Danim',
            email: 'dani@gmail.com',
            age: 19,
            date: '10-09-2025',
            enable: false
        },
        {
            id: 13,
            name: 'Daniela Matul',
            userName: 'Danim',
            email: 'dani@gmail.com',
            age: 19,
            date: '10-09-2025',
            enable: false
        }          
    ]

    useEffect(() => {
        // Aqui obtendremos los usuarios de la Api

        setUsers(usersR)
    }, [confirmation])


    const getValueInput = (value) => {
        setStatusValue(value)
        setIsOpen(true)
    }

    const closeModal = () => {
        setIsOpen(false)
        setConfirmaton(true)
    }

    const columns = ['Name', 'UserName', 'Email', 'Age', 'Fecha', 'Enable']
    
    return(
        <>
            <div className="main-container-users">
                <div className="header-users">
                    <h1>Users</h1>
                    <p>Searcher</p>
                </div>
                <div className="table-TA-container">
                    <TableAdmin  columns={columns} data={users} btnVerification={true} getValueInputP={getValueInput}/>
                </div>


                <Modal isOpen={isOpen} title={'Cambiar Estado de Usuario'} isClose={false}>
                    <p>¿Estas seguro de cambiar el estado del Usuario?</p>
                    <button className="changeStatus" onClick={closeModal}>
                                Confirmar
                    </button>
                    <button className="changeStatus" onClick={closeModal}>
                                Cancelar
                    </button>
                </Modal>
            </div>
        </>
    )
}