import React, { createContext, useState } from "react";

export const GlobalContext = createContext({})

export function InfoProvider( {children} ){

    const [usuario, setUsuario] = useState('null')
    const [currentTab, setCurrentTab] = useState("Login");
  
    return (
        
        <GlobalContext.Provider value={{usuario, setUsuario, currentTab, setCurrentTab}}>
            {children}
        </GlobalContext.Provider>
    )
}