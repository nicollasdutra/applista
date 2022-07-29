import React, { createContext, useState } from "react";

export const GlobalContext = createContext({})

export function InfoProvider( {children} ){

    const [idUsuario, setIdUsuario] = useState('')
    const [usuario, setUsuario] = useState('null')
    const [currentTab, setCurrentTab] = useState("Login");
    const [listaShared, setListaShared] = useState([])

    return (
        
        <GlobalContext.Provider value={{idUsuario, setIdUsuario, usuario, setUsuario, currentTab, setCurrentTab, listaShared, setListaShared}}>
            {children}
        </GlobalContext.Provider>
    )
}