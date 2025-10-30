'use client';

import '../styles/TableAdmin.css'
import { useEffect, useState } from "react";
import ButtonSwitch from './ButtonSwitch';

// Valores que necesitamos si queremos kusar esta tabla
// columns, arreglo con los nombres de cada columna
// data, los datos :) no importa la cantidad
// btnVerification (true/false) si queremos que haya un btn verficación (input:checkbox) en la ultima columna
// getValueInputP: Si se activo el btnVerification por medio de esta función obtenemos el valor
export default function TableAdmin({columns, data, btnVerification, getValueInputP}){
    const getValueInput = (value) => {
        console.log("Checkeando ", value)
        getValueInputP(value)
    }
    const lengthColumns = columns.length

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
                                            {(value !== 'enable' && value !== 'id' && (lengthColumns >= 3 && value !== 'Date')) &&(<td>{d[value]}</td>)}
                                        </>
                                    ))}

                                    { btnVerification &&(
                                        <td><ButtonSwitch id={d.id} value={d.enable} getValue={getValueInput}/></td>
                                    )}
                                </tr>
                        ))}
                    </tbody>
                    
                </table>
            </div>
        </>
    )
}