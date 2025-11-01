'useClient'

import { useEffect, useState } from 'react'
import '../styles/ButtonSwitch.css'
import Modal from './Modal'



// Datos que se necesitan enviar para que el btn funcione. 
// id: (para diferenciar cada input y si label)
// value: Estado del input:checkbox (true/false)
// funcion que recibe el cambio del input (true/false)
export default function ButtonSwitch ({id, value, getValue, email}) {
    return (
        <>
            <div className="btn">
                <input type="checkbox" id={id} checked={value} onChange={(e) => getValue({value: e.target.checked, id: id, email: email})}/>
                <label htmlFor={id} className='lbl-switch'></label>
            </div>
        </>
    )
}