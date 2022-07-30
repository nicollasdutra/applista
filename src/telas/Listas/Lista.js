import React, { useEffect, useState } from 'react'
import { Text, TouchableOpacity,SafeAreaView, View, StyleSheet, FlatList, Alert, RefreshControl } from 'react-native'
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { Button, Divider, TextInput, Checkbox  } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import { getData } from '../../services/Data';


import firebase from '../../../firebaseconfig';

const database = firebase.firestore()

function excluiItem(id, setAdiciona, adiciona){
        
    
    database.collection("items").doc(id).delete().then(() => {
        //console.log("Document successfully deleted!");
        setAdiciona(!adiciona)
        //Alert.alert("Lista criada com sucesso","");
    }).catch((error) => {
        console.error("Error removing document: ", error);
    });
    

}

function alteraItem(id, checked, setAdiciona,adiciona){
        
    let item = database.collection("items").doc(id);

    return item.update({
        checked: checked
    })
    .then(() => {
        //console.log("Document successfully updated!");
        setAdiciona(!adiciona)
    })
    .catch((error) => {
        console.error("Error updating document: ", error);
    });
    
}



function msgConfirmaExclusao(id, setAdiciona,adiciona){
    
    Alert.alert(
        'Excluir',
        'Deseja realmente excluir este item?', 
        [
          {text: 'SIM', onPress: () => excluiItem(id, setAdiciona,adiciona)},
          {text: 'NÃO', onPress: () => ''},
        ],
        {cancelable: false},
      );
}

const Item = ({ id, nome, checked, setAdiciona, adiciona, valor, qtde, catlist }) => (

        <View style={{ marginLeft:10, width:'90%', marginBottom:5, }}>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <View style={{flexDirection:'row'}}>
                    <Checkbox
                        status={checked ? 'checked' : 'unchecked'}
                        onPress={() => {alteraItem(id,!checked,setAdiciona,adiciona)}}
                    />
                    
                    <View style={{width:'58%'}}>
                    {checked ?  
                        <Text style={{marginTop:8, marginLeft:10,color:'gray',marginBottom:5,}}>{nome}</Text>
                        :
                        <Text style={{marginTop:8, marginLeft:10,color:'black',marginBottom:5,}}>{nome}</Text>
                    }
                    </View>
                    <View style={{width:'15%'}}>
                    {catlist==='1' ?
                        checked ?  
                        <Text style={{marginTop:8, color:'gray',marginBottom:5,}}>{qtde}</Text>
                        :
                        <Text style={{marginTop:8, color:'black',marginBottom:5,}}>{qtde}</Text>
                        :
                        ''
                    }
                    </View>
                    <View style={{width:'10%'}}>
                    {catlist==='1' ?
                        checked ?  
                        <Text style={{marginTop:8, color:'gray',marginBottom:5,}}>{valor}</Text>
                        :
                        <Text style={{marginTop:8, color:'black',marginBottom:5,}}>{valor}</Text>
                        :
                        catlist ==='3' ?
                        checked ?  
                        <Text style={{marginTop:8, color:'gray',marginBottom:5,}}>{valor}</Text>
                        :
                        <Text style={{marginTop:8, color:'black',marginBottom:5,}}>{valor}</Text>
                        :
                        ''
                    }
                    </View>
                </View>
                <TouchableOpacity style={{marginTop:8}} onPress={()=>{msgConfirmaExclusao(id,setAdiciona,adiciona)}}><Icon name='close' style={{marginLeft:20,marginBottom:6}} size={20} color='red' /></TouchableOpacity>
            </View>
            <Divider />
        </View>
    
    
  );

export default function Lista(){

    const wait = (timeout) => { 
        return new Promise(resolve => setTimeout(resolve, timeout)); 
    } 
    
    const [refreshing, setRefreshing] = React.useState(false); 

    const onRefresh = React.useCallback(() => { 
      setRefreshing(true); 
      setAdiciona(!adiciona)
      wait(2000).then(() => setRefreshing(false)); 
    }, []);

    const [novoItem,setNovoItem] = useState('')
    const [valor,setValor] = useState(0)
    const [qtde,setQtde] = useState(1)
    const navigation = useNavigation();
    const route = useRoute();
    const [listaItens,setListaItens]=useState([])
    const [adiciona,setAdiciona]=useState(false)
    
    useEffect(() => {
        
        const list = []

        database.collection("items").where("idlist", "==", route.params.id)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
            //list.push({...doc.data()})       
                list.push({
                    id: doc.id,
                    nome: doc.data().nome,
                    valor: doc.data().valor,
                    qtde: doc.data().qtde,
                    checked: doc.data().checked,
                    idlist: doc.data().idlist,
                    catlist: doc.data().catlist
                })
            });
            setListaItens(list)
        })
        .catch((error) => {
            //console.log("Error getting documents: ", error);
        });
        console.log('oi 2')
    },[adiciona])

 

    const renderItem = ({ item }) => (

        <Item id={item.id} nome={item.nome} valor={item.valor} qtde={item.qtde} catlist={item.catlist} checked={item.checked} setAdiciona={setAdiciona} adiciona={adiciona} />
    );
    
    
    function adicionaNaLista(){
        
        novoItem.trim().length > 0 
        ? 
            database.collection("items").add({
                nome: novoItem,
                valor: valor,
                qtde: qtde,
                checked: false,
                idlist: route.params.id,
                catlist: route.params.categoria
            })
            .then(() => {
                //Alert.alert("Lista criada com sucesso","");
                setNovoItem('')
                setValor(0)
                setQtde(1)
                setAdiciona(!adiciona)
            })
            .catch((error) => {
                //Alert.alert("Erro", error);
            })       
        : 
            ''//console.log(getData())
        

    }

    function clica(idlist, nome, categoria, data, username){

        navigation.navigate('ListaConfig', { idlist: idlist, nome: nome, categoria: categoria, data: data, username: username })
        
    }

    return <>
        
        <SafeAreaView style={{flex:1, backgroundColor:'#FFFFFF', }}>
            <View style={{margin:16,height:'100%'}}>
            <Button style={styles.botaoVoltar} mode="contained" onPress={() => {navigation.goBack()}}>
                Voltar
            </Button>
            <Divider />
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <View style={{flexDirection:'row'}}>
                    <View style={{marginTop:13,marginRight:10,color:'gray'}}>
                    {route.params.categoria === '1' ?  <Icon name='cart' size={42} color='#5359D1' /> : route.params.categoria === '2' ? <Icon name='reader' size={32} color='#5359D1' /> : <Icon name='cash-outline' size={32} color='#5359D1' /> }
                    </View>
                    <View style={{flexDirection:'column'}}>
                        <Text style={{fontWeight:'bold',fontSize:30,color:'gray'}}>{route.params.nome}</Text>
                        <Text style={{fontSize:16,color:'gray'}}>Lista de {route.params.categoria === '1' ? 'Compras' : route.params.categoria === '2' ? 'Tarefas' : 'Finanças'}</Text>
                        <Text style={{fontSize:12,marginTop:4,color:'gray'}}>Criado por {route.params.username} em {route.params.data.substring(0,10)}</Text>
                    </View>
                </View>
                <View>
                    <Text onPress={() => {clica(route.params.id,route.params.nome,route.params.categoria,route.params.data, route.params.username)}} style={{fontSize:36, marginRight:10,color:'gray'}}>...</Text>
                </View>
            </View>
            <Divider style={{marginBottom:10,marginTop:10}} />
            <View style={{flexDirection:'row', alignItems:'center', marginLeft:10}}>

                {route.params.categoria === '1' ?
                <TextInput returnKeyType="next" onChangeText={text => setNovoItem(text)} selectionColor='gray' value ={novoItem} underlineColor="transparent" placeholder='novo item' style={{fontSize:14,marginBottom:10, height:30, width:'45%'}} />
                :
                route.params.categoria === '2' ?
                <TextInput returnKeyType="next" onChangeText={text => setNovoItem(text)} selectionColor='gray' value ={novoItem} underlineColor="transparent" placeholder='novo item' style={{fontSize:14,marginBottom:10, height:30, width:'80%'}} />
                :
                <TextInput returnKeyType="next" onChangeText={text => setNovoItem(text)} selectionColor='gray' value ={novoItem} underlineColor="transparent" placeholder='novo item' style={{fontSize:14,marginBottom:10, height:30, width:'58%'}} />
                }

                
                {route.params.categoria === '1' ? <TextInput returnKeyType="next" onChangeText={text => setQtde(text)} selectionColor='gray' value ={qtde} underlineColor="transparent" placeholder='qtde' style={{fontSize:14,marginBottom:10, marginLeft:15, height:30, width:'18%'}} /> : ''}

                {route.params.categoria === '1' ? <TextInput returnKeyType="next" onChangeText={text => setValor(text)} selectionColor='gray' value ={valor} underlineColor="transparent" placeholder='valor' style={{fontSize:14,marginBottom:10, marginLeft:15, height:30, width:'18%'}} />
                 : route.params.categoria === '2' ? '' 
                 : <TextInput returnKeyType="next" onChangeText={text => setValor(text)} selectionColor='gray' value ={valor} underlineColor="transparent" placeholder='valor' style={{fontSize:14,marginBottom:10, marginLeft:15, height:30, width:'23%'}} />} 
                
                <TouchableOpacity onPress={adicionaNaLista}><Icon name='add' style={{marginLeft:10,marginBottom:6}} size={28} color='#5359D1' /></TouchableOpacity>
            </View>
            <Divider style={{marginBottom:10,marginTop:10}} />
            
            <FlatList
              data={listaItens.sort((a,b) => a.checked-b.checked)}
              renderItem={renderItem}
              keyExtractor={item => item.id}
              refreshControl={ 
                <RefreshControl 
                  refreshing={refreshing} 
                  onRefresh={onRefresh} 
                /> 
              } 
            />

        </View>
        </SafeAreaView>
    </>
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        
      },
containerInput: {
    width: '80%',
    marginVertical: 12,
    marginLeft: '10%',
    marginRight:'10%',
  },
  botao:{
    backgroundColor:'#5359D1',
    width:'90%',
    marginLeft:'5%',
    marginTop:20,
  },
  botaoVoltar:{
    backgroundColor:'#b5b2b2',
    width:'100%',
    marginBottom:16
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
})