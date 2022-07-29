import React, { useState } from 'react'
import { SafeAreaView, Text, StyleSheet, View, TouchableOpacity, Alert } from 'react-native'
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
    const [adiciona, setAdiciona] = useState(false)


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
                            <Text style={{fontWeight:'bold',fontSize:30}}>{route.params.nome}</Text>
                            <Text style={{fontSize:14}}> Lista de {route.params.categoria === '1' ? 'Compras' : 'Tarefas'}</Text>
                        </View>
                    </View>
                    <View>
                        <Button style={{backgroundColor:'red', marginTop:12, marginRight:10}} mode="contained" onPress={msgConfirmaExclusao}>
                            <Icon name='trash' size={18} color='white' />
                        </Button>
                    </View>
                </View>
                <Divider style={{marginTop:20,marginBottom:20}} />
                <Text style={{marginBottom:10}}>Compartilhar lista com:</Text>
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
                <Text style={{marginBottom:10, marginTop:15}}>Lista compartilhada com:</Text>
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