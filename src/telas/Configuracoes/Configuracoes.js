import React, { useContext, useEffect } from 'react'
import { Text } from 'react-native'
import { GlobalContext } from '../../contexts/GlobalContext'

export default function Configuracoes(){

    const {usuario, setUsuario, setCurrentTab } = useContext(GlobalContext)
    
    useEffect(() => {
      
      setCurrentTab("Configurações")
      
    },[])


    return <>
    
        <Text>Configuracoes</Text>
    </>

}