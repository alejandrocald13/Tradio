'use client';

import { useEffect, useState } from "react";
import TableAdmin from "../components/TableAdmin"
import Modal from '../components/Modal'
import Searcher from "../components/Searcher";
import SidebarNavAdmin from '@/app/components/SidebarNav-Admin'
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
        console.log("Valor", value.value)
        setStatusValue(value)
        setIsOpen(true)
    }

    const closeModal = () => {
        setIsOpen(false)
        setConfirmaton(true)
    }

    const getValueInputSearcher = (value) => {
        console.log("Hola desde getValueInput ", value)
    }
    const columns = ['Name', 'UserName', 'Email', 'Age', 'Date', 'Enable']
    
    return(
        <>
            <SidebarNavAdmin/>
            <div className="main-container-users">
                <div className="header-users">
                    <Searcher placeholderI={'Enter name'} getValue={getValueInputSearcher} />
                </div>
                <div className="table-TA-container">
                    <TableAdmin  columns={columns} data={users} btnVerification={true} getValueInputP={getValueInput}/>
                </div>


                <Modal isOpen={isOpen} title={'Change User Status'} isClose={false}>
                    <div className="container-modal">
                        <div className="p-cpntainer">
                            <p className="p">Are you sure you want to change the user's status?</p>
                            {statusValue?.value === true && (<p className="p-switch">The user {statusValue.id} will be enabled</p>)}
                            {statusValue?.value === false && (<p className="p-switch" >The user {statusValue.id} will be disabled</p>)}
                        </div>

                        <div className="btns">
                            <button className="changeStatus-confirmation" onClick={closeModal}>
                                    Confirm
                            </button>
                            <button className="changeStatus-cancel" onClick={closeModal}>
                                    Cancel
                            </button>
                        </div>
                    </div>
                    
                </Modal>
            </div>
        </>
    )
}