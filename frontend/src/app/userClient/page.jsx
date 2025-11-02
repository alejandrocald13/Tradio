'use client';

import { useEffect, useState } from "react";
import TableAdmin from "../components/TableAdmin"
import Modal from '../components/Modal'
import Searcher from "../components/Searcher";
import SidebarNavAdmin from '@/app/components/SidebarNav-Admin'
import "./users.css"
import { api } from "../lib/axios";

export default function users() {
    const [users, setUsers] = useState([]);
    const [statusValue, setStatusValue] = useState({value: true, id:0})
    const [isOpen, setIsOpen] = useState(false)
    const [confirmation, setConfirmation] = useState(false)


    const getUsers = async () => {
        try{
            const response = await api.get('/users/')
            setUsers(response.data)
        }catch(error){
            console.log("Error obteniendo usuarios", error)
            alert(error)
        }
    }    
    useEffect(() => {
        getUsers()
    }, [confirmation])


    const getValueInputEnable = (value) => {
        setStatusValue(value)
        setIsOpen(true)
    }

    const closeModal = async (value) => {
        setIsOpen(false)
        if(value){
            try{
                if(statusValue.value){
                    const response = await api.post(`/users/${statusValue.id}/enable/`)
                    console.log("Se ha habilitado el usuario", response.data)
                } else{
                    const response = await api.post(`/users/${statusValue.id}/disable/`)
                    console.log("Se ha deshabilitado el usuario", response.data)
                }
                setConfirmation(prev => !prev)
            }catch(error){
                alert(error)
            }
        }
    }

    const getValueInputSearcher = async (value) => {
        if (value === ''){
            getUsers()
            return 0
        }
        try{
            const response = await api.post("/users/search", {name: value})
            setUsers(response.data)
        }catch(error){
            alert(error)
        }
    }
    const columns = ['Name', 'Email', 'Age', 'Date', 'Enable']
    
    return(
        <>
            <SidebarNavAdmin/>
            <div className="main-container-users">
                <div className="header-users">
                    <Searcher placeholderI={'Enter name'} getValue={getValueInputSearcher} />
                </div>
                <div className="table-TA-container">
                    <TableAdmin  columns={columns} data={users} btnVerification={true} getValueInputP={getValueInputEnable}/>
                </div>


                <Modal isOpen={isOpen} title={'Change User Status'} isClose={false}>
                    <div className="container-modal">
                        <div className="p-cpntainer">
                            <p className="p">Are you sure you want to change the user's status?</p>
                            {statusValue?.value === true && (<p className="p-switch">The user {statusValue.email} will be enabled</p>)}
                            {statusValue?.value === false && (<p className="p-switch" >The user {statusValue.email} will be disabled</p>)}
                        </div>

                        <div className="btns">
                            <button className="changeStatus-confirmation" onClick={()=> closeModal(true)}>
                                    Confirm
                            </button>
                            <button className="changeStatus-cancel" onClick={()=> closeModal(false)}>
                                    Cancel
                            </button>
                        </div>
                    </div>
                    
                </Modal>
            </div>
        </>
    )
}