'use client';

import '../styles/TableAdmin.css'
import { useEffect, useState } from "react";
import ButtonSwitch from './ButtonSwitch';

// Valores que necesitamos si queremos kusar esta tabla
// columns, arreglo con los nombres de cada columna
// data, los datos :) no importa la cantidad
// btnVerification (true/false) si queremos que haya un btn verficación (input:checkbox) en la ultima columna
// getValueInputP: Si se activo el btnVerification por medio de esta función obtenemos el valor
export default function TableAdmin({columns, data, btnVerification, getValueInputP, type}){
    const getValueInput = (value) => {
        console.log("Checkeando ", value)
        getValueInputP(value)
    }

    return (
        <>
            <div className="main-container-TA">
                <table className="table-TA">
                    <thead className="thead-TA">
                        <tr>
                            {columns.map((column, index) => (
                                <th key={index}>{column}</th>
                            ))}
                        </tr>
                    </thead>

                    <tbody className="tbody-TA">
                        {data.map((d, index) => (
                                <tr key={index}>
                                    {Object.keys(d).map((value) => (
                                        <>
                                        {type === 'home' &&(
                                            <>

                                                {(value !== 'enable' && value !== 'id' && value !== 'Date') &&(<td>{d[value]}</td>)}
                                            </>
                                        )}
                                        {type !== 'home' &&(value !== 'enable' && value !== 'id') &&(<td>{d[value]}</td>)}
                                            
                                        </>
                                    ))}

                                    { btnVerification &&(
                                        <td><ButtonSwitch id={d.id} value={d.enable} getValue={getValueInput} email={d.email}/></td>
                                    )}
                                </tr>
                        ))}
                    </tbody>
                    
                </table>
            </div>
        </>
    )
}