import React, { useEffect, useState } from 'react'
import { SafeAreaView, Text, StyleSheet, View, TouchableOpacity, Alert, FlatList } from 'react-native'
import { useIsFocused, useNavigation, useRoute } from '@react-navigation/native';
import { Button, Divider, TextInput, Checkbox  } from 'react-native-paper';
import Icon from 'react-native-vector-icons/Ionicons';
import firebase from '../../../firebaseconfig';
import { getData } from '../../services/Data';

const database = firebase.firestore()



export default function ListaConfig()
{
    const navigation = useNavigation();
    const route = useRoute();
    const [email,setEmail] = useState();
    const [listaItens,setListaItens]=useState([])
    const [adiciona, setAdiciona] = useState(false)

    const Item = ({ id, email }) => (

        <View style={{ marginLeft:10, width:'90%', marginBottom:5, }}>
            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                <View style={{flexDirection:'row'}}>
                    <Text style={{marginTop:8, marginLeft:10,color:'gray',marginBottom:5,color:'gray'}}>{email}</Text>
                </View>
                <TouchableOpacity style={{marginTop:8}} onPress={()=>{msgConfirmaExclusaoShared(id,setAdiciona,adiciona)}}><Icon name='close' style={{marginLeft:20,marginBottom:6}} size={20} color='red' /></TouchableOpacity>
            </View>
            <Divider />
        </View>
    
    
    );

  useEffect(() => {
        
    const list = []

    database.collection("shared").where("idlist", "==", route.params.idlist)
    .get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
        //list.push({...doc.data()})       
            list.push({
                id: doc.id,
                email: doc.data().email
            })
        });
        setListaItens(list)
    })
    .catch((error) => {
        //console.log("Error getting documents: ", error);
    });
},[adiciona])


    function adicionaNaLista(){
        
        email.trim().length > 0 
        ? 
            database.collection("shared").add({
                idlist: route.params.idlist,
                email: email.trim(),
                datashared: getData()
            })
            .then(() => {
                //Alert.alert("Lista criada com sucesso","");
                setEmail('')
                setAdiciona(!adiciona)
            })
            .catch((error) => {
                //Alert.alert("Erro", error);
            })       
        : 
            ''//console.log(getData())

    }

    function msgConfirmaExclusao(){
    
        Alert.alert(
            'Excluir',
            'Deseja realmente excluir esta lista?', 
            [
              {text: 'SIM', onPress: () => excluiItem()},
              {text: 'NÃO', onPress: () => ''},
            ],
            {cancelable: false},
          );
    }

    function msgConfirmaExclusaoShared(id, setAdiciona,adiciona){
    
        Alert.alert(
            'Excluir',
            'Deseja realmente excluir este item?', 
            [
              {text: 'SIM', onPress: () => excluiItemShared(id, setAdiciona,adiciona)},
              {text: 'NÃO', onPress: () => ''},
            ],
            {cancelable: false},
          );
    }

    function excluiItem(){
        
        //consulta os itens da lista deleta um por um

        database.collection("items").where("idlist", "==", route.params.idlist)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
        
                database.collection("items").doc(doc.id).delete().then(() => {
                    //console.log("Document successfully deleted!");
                }).catch((error) => {
                    //console.error("Error removing document: ", error);
                });
        
        
            });
        })
        .catch((error) => {
            //console.log("Error getting documents: ", error);
        });


        //deleta a lista agora
        
        database.collection("lists").doc(route.params.idlist).delete().then(() => {
            //console.log("Document successfully deleted!");

            navigation.navigate('Principal')
            //Alert.alert("Lista criada com sucesso","");
        }).catch((error) => {
            //console.error("Error removing document: ", error);
        }); 
        
    
    }


    function excluiItemShared(id, setAdiciona, adiciona){
        
    
        database.collection("shared").doc(id).delete().then(() => {
            //console.log("Document successfully deleted!");
            setAdiciona(!adiciona)
            //Alert.alert("Lista criada com sucesso","");
        }).catch((error) => {
            console.error("Error removing document: ", error);
        });
        
    
    }


    const renderItem = ({ item }) => (

        <Item id={item.id} email={item.email} setAdiciona={setAdiciona} adiciona={adiciona} />
    );

    return <>
    
        <SafeAreaView style={{flex:1, backgroundColor:'#FFFFFF', }}>
            <View style={{margin:16,height:'100%'}}>
                <Button style={styles.botaoVoltar} mode="contained" onPress={() => {navigation.goBack()}}>
                    Voltar
                </Button>        
                <Divider />
                <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                    <View style={{flexDirection:'row'}}>
                        <View style={{marginTop:13,marginRight:10,}}>
                            {route.params.categoria === '1' ?  <Icon name='cart' size={42} color='#5359D1' /> : <Icon name='reader' size={32} color='#5359D1' /> }
                        </View>
                        <View style={{flexDirection:'column'}}>
                            <Text style={{fontWeight:'bold',fontSize:30,color:'gray'}}>{route.params.nome}</Text>
                            <Text style={{fontSize:16,color:'gray'}}>Lista de {route.params.categoria === '1' ? 'Compras' : route.params.categoria === '2' ? 'Tarefas' : 'Finanças'}</Text>
                        <Text style={{fontSize:12,marginTop:4,color:'gray'}}>Criado por {route.params.username} em {route.params.data.substring(0,10)}</Text>
                        </View>
                    </View>
                    <View>
                        <Button style={{backgroundColor:'red', marginTop:12, marginRight:10}} mode="contained" onPress={msgConfirmaExclusao}>
                            <Icon name='trash' size={18} color='white' />
                        </Button>
                    </View>
                </View>
                <Divider style={{marginTop:20,marginBottom:20}} />
                <Text style={{marginBottom:10,color:'gray'}}>Compartilhar lista com:</Text>
                <View style={{flexDirection:'row'}}>
                    <TextInput
                        returnKeyType="next"
                        onChangeText={text => setEmail(text)}
                        selectionColor='gray'
                        value ={email}
                        underlineColor="transparent"
                        placeholder='digite o email'
                        style={{fontSize:14,marginBottom:10, height:30, width:'80%'}}
                    />
                    <TouchableOpacity onPress={adicionaNaLista}><Icon name='add' style={{marginLeft:20,marginBottom:6}} size={28} color='#5359D1' /></TouchableOpacity>
                </View>
                <Text style={{marginBottom:10, marginTop:15,color:'gray'}}>Lista compartilhada com:</Text>
                <Divider style={{marginBottom:10,marginTop:10}} />
            
                <FlatList
                    data={listaItens}
                    renderItem={renderItem}
                    keyExtractor={item => item.id}
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
  botaoVoltar:{
    backgroundColor:'#b5b2b2',
    width:'100%',
    marginBottom:16
  },  

})