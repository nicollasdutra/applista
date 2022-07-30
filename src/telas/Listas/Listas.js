import React, { useContext, useEffect, useState, useRef } from 'react'
import { Text, StyleSheet,TouchableOpacity, Button, View, FlatList } from 'react-native'
import { PortalProvider } from "@gorhom/portal";
import BottomSheet from './components/BottomSheet';

import Icon from 'react-native-vector-icons/Ionicons';
import { GlobalContext } from '../../contexts/GlobalContext'
import { useIsFocused, useNavigation  } from '@react-navigation/native';

import firebase from '../../../firebaseconfig';



export default function Listas(){

  const isFocused = useIsFocused()

  const Item = ({ id, nome, categoria, iduser,data, username }) => (
  
    <TouchableOpacity style={estilos.cartao} onPress={() => clica(id, iduser, nome, categoria,data,username)}>
        <View style={estilos.linha}>
            <View style={estilos.imagem}>
             {categoria === '1' ?  <Icon name='cart' size={32} color='#5359D1' /> : categoria === '2' ? <Icon name='reader' size={32} color='#5359D1' /> : <Icon name='cash-outline' size={32} color='#5359D1' /> }
            </View>
            <View style={estilos.cartaoDestaque}>
                <Text style={{fontWeight:'bold',fontSize:16,color:'gray'}}>{nome}</Text>
                <Text style={{color:'gray'}}>{categoria==='1' ? 'Lista de compras' : categoria==='2' ? 'Lista de tarefas' : 'Lista de Finanças'}</Text>
            </View>
        </View>
        <View style={estilos.opcoes}>
            <Text style={{fontSize:10,color:'gray'}}>Criado em:</Text>
            <Text style={{fontSize:10,color:'gray'}}>{data.substring(0,10)}</Text>
            <Text style={{fontSize:10,color:'gray'}}>por {username}</Text>
        </View>
    </TouchableOpacity>
  );

  
  
  const navigation = useNavigation();

  const [atualizaPagina,setAtualizaPagina] = useState(false);

  const modalRef = useRef(null);
  
  const onOpen = () => {
    modalRef.current?.open();
  };

  const onClose = () => {
    setAtualizaPagina(!atualizaPagina);
    modalRef.current?.close();
  };

  const database = firebase.firestore()
  
  const [listas, setListas] = useState([])
  const [listasShared, setListasShared] = useState([])
  const {idUsuario, usuario, setUsuario, setCurrentTab } = useContext(GlobalContext)
  

  function getListas(id)
  {
    const list = []

    database.collection("lists").where("user", "==", id)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          list.push({
            id: doc.id,
            nome: doc.data().nome,
            categoria: doc.data().categoria,
            data: doc.data().data,
            username: doc.data().username
          })
        });
        setListas(list)
    })
    .catch((error) => {
        //console.log("Error getting documents: ", error);
    });
    
  }


  

  useEffect(() => {
      
    setCurrentTab("Minhas Listas")
    

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
     
        let uid = user.uid;
    
        getListas(uid)
      }
    })
    

  },[atualizaPagina])

  useEffect(() => {
      
    setCurrentTab("Minhas Listas")
    

    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
     
        let uid = user.uid;
    
        getListas(uid)
        
      }
    })
    

  },[isFocused])

  function clica(id, iduser, nome, categoria, data, username){

    navigation.navigate('Lista', { id: id, iduser: iduser, nome: nome, categoria: categoria, data: data, username: username })
    
  }
 

    const renderItem = ({ item }) => (
        <Item id={item.id} nome={item.nome} categoria={item.categoria} iduser={idUsuario} data={item.data} username={item.username}/>
    );
    

    return <>
    
        
        <PortalProvider>
          <View style={estilos.container}>
            <FlatList
              data={listas}
              renderItem={renderItem}
              keyExtractor={item => item.data}
            />
          
            <FlatList
              data={listasShared}
              renderItem={renderItem}
              keyExtractor={item => item.data}
            />

            <BottomSheet modalRef={modalRef} onClose={onClose} />


            <TouchableOpacity onPress={onOpen} style={estilos.adicionarMemo}>
              <Text style={estilos.adicionarMemoTexto}>+</Text>
            </TouchableOpacity> 
            <Text style={{textAlign:'right', width:'100%',marginRight:16, marginBottom: 110, color:'#5359D1'}}>Nova Lista</Text>
            
            {/* <Button title="Open Modal" color="#1E2022" onPress={onOpen} /> */}
          </View>
        </PortalProvider>

      
         
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
      marginBottom:56,
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
  container: {
    height:'90%',
    width:'100%',
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },





cartao:{
    justifyContent: "space-between",
    backgroundColor: '#F6F6F6',
    marginVertical:8,
    marginHorizontal: 23,
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
    width: '80%',
    
},
linha:{
  flexDirection: "row",
},
imagem:{
  marginLeft: 10,
  borderRadius: 6,
  alignContent: "center",
  justifyContent: "center",
  
},
cartaoDestaque: {
  marginLeft:16,
  marginTop: 10,
  marginBottom:10,
},
opcoes: {
  marginRight: 20,
  marginTop: 10,
},
textoOpcoes:{
  fontWeight: 'bold',
  fontSize:24,

},
nome:{
  fontWeight: 'bold',
  fontSize: 16,
},

});
  