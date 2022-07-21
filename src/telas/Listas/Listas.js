import React, { useContext, useEffect } from 'react'
import { Text, StyleSheet,TouchableOpacity,View } from 'react-native'
import { GlobalContext } from '../../contexts/GlobalContext'

export default function Listas(){


  const {usuario, setUsuario, setCurrentTab } = useContext(GlobalContext)
    
    useEffect(() => {
      
      setCurrentTab("Listas")
      
    },[])

    return <>
    
        <Text>Listas</Text>
        <TouchableOpacity onPress={() => {}} style={estilos.adicionarMemo}>
            <Text style={estilos.adicionarMemoTexto}>+</Text>
        </TouchableOpacity>

    </>

}


const estilos = StyleSheet.create({
    centralizaModal: {
        flex: 1,
        flexDirection: "row",
        alignItems: "flex-end"
      },
    adicionarMemo: {
      backgroundColor: "#5359D1",
      justifyContent: "center",
      height: 48,
      width: 48,
      margin: 16,
      alignItems: "center",
      borderRadius: 9999,
      position: "absolute",
      bottom: 0,
      right: 0,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.23,
      shadowRadius: 2.62,
      elevation: 4,
    },
    adicionarMemoTexto: {
      fontSize: 32,
      lineHeight: 40,
      color: "#FFFFFF",
    }
  });
  