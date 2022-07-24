import React, { useContext, useEffect, useState } from 'react'
import { Text, StyleSheet,TouchableOpacity,View, FlatList } from 'react-native'
import { GlobalContext } from '../../contexts/GlobalContext'

import firebase from '../../../firebaseconfig';

const Item = ({ nome, texto }) => (
  
  <View style={estilos.cartao}>
      <View style={estilos.linha}>
          <View>
              <Text>{nome}</Text>
          </View>
          <View>
              <Text>{texto}</Text>
          </View>
      </View>
  </View>
);


export default function Listas(){

  const database = firebase.firestore()
  const [listas, setListas] = useState([])
  const {idUsuario, usuario, setUsuario, setCurrentTab } = useContext(GlobalContext)
  

  function getListas(id)
  {

    database.collection(id).onSnapshot((query) => {
      const list = []
      query.forEach((doc) => {
        list.push({...doc.data(), id: doc.id})
      })
      setListas(list)
    })
    
  }

  function adicionaLista(id)
  {
    console.log(id)

    database.collection(id).add({
      nome: "Mercado",
      texto: "Contra file"
    })
    .then((docRef) => {
      console.log("Document written with ID: ", docRef.id);

    })
    .catch((error) => {
      console.log("Error adding document: ", error);
    });


  }

  useEffect(() => {
      
      setCurrentTab("Listas")
      console.log(idUsuario)


      firebase.auth().onAuthStateChanged((user) => {
        if (user) {
       
          let uid = user.uid;
          console.log(uid)

          getListas(uid)
        }
      })
      

    },[])

    const renderItem = ({ item }) => (
      <Item nome={item.nome} texto={item.texto} />
    );

    return <>
    
        <Text>Listas</Text>
        <TouchableOpacity onPress={() => {}} style={estilos.adicionarMemo}>
            <Text style={estilos.adicionarMemoTexto}>+</Text>
        </TouchableOpacity>

        <FlatList
            data={listas}
            renderItem={renderItem}
            keyExtractor={item => item.id}
        /> 
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
    },
    cartao:{
      justifyContent: "space-between",
      backgroundColor: '#F6F6F6',
      marginVertical:8,
      marginHorizontal: 16,
      borderRadius: 6,
      flexDirection: "row",
      elevation: 4, //para colocar sombra - somente android
  
      //para IOS a sombra é os itens até o final (shadowRadius)
      shadowColor: '#000',
      shadowOffset:{
          width: 0,
          height:2, 
      },
      shadowOpacity: 0.23,
      shadowRadius:2.62,
  },
  linha:{
    flexDirection: "row",
  },
  });
  