import React, { useContext, useEffect, useState } from "react";
import { Dimensions , View, StyleSheet, Alert, Text, Button} from "react-native";
import { Portal } from "@gorhom/portal";
import { Modalize } from "react-native-modalize";

import { useNavigation, useRoute } from '@react-navigation/native';
import { TextInput } from 'react-native-paper';
import SelectList from 'react-native-dropdown-select-list'
import { getData } from "../../../services/Data";

import { GlobalContext } from '../../../contexts/GlobalContext';

import firebase from '../../../../firebaseconfig';


const { height } = Dimensions.get("screen");
const modalHeight = height * 0.8;

const BottomSheet = ({ modalRef, onClose }) => {

    const navigation = useNavigation();

    const [nomeLista, setNomeLista] = useState('')
    const [categoria, setCategoria] = useState('')
    const data = [{key:'1',value:'Compras'},{key:'2',value:'Tarefas'},{key:'3',value:'Finanças'}];

    
    const {idUsuario, usuario} = useContext(GlobalContext)
    const database = firebase.firestore()


    function adicionaLista()
    {
        database.collection("lists").add({
            nome: nomeLista,
            categoria: categoria,
            user: idUsuario,
            username: usuario,
            data: getData()
        })
        .then(() => {
            Alert.alert("Lista criada com sucesso","");
            //navigation.navigate('Login')
            //console.log("Document successfully written!");
            
        })
        .catch((error) => {
            Alert.alert("Erro", error);
        });

    }

    return (
      <Portal>
        <Modalize ref={modalRef} modalHeight={modalHeight}>
          <View style={styles.content}>
            <Text style={styles.text}>Nova Lista</Text>
            
            <View style={styles.containerInput}>
                <TextInput
                    label="Nome"
                    returnKeyType="next"
                    onChangeText={text => setNomeLista(text)}
                    selectionColor={'#5359D1'}
                    underlineColor="transparent"
                    mode="outlined"
                    style={{marginBottom:10, height:50}}
                />

            <SelectList 
                setSelected={setCategoria} 
                data={data} 
                inputStyles={{fontSize:16, marginLeft:-10, backgroundColor:'white', color:'gray'}} 
                dropdownTextStyles={{color:'gray'}}
                onSelect={() => {}} 
                search={false} 
                boxStyles={{borderRadius:4, backgroundColor:'white', color:'gray'}}  
                placeholder="Selecione a categoria"
            />
                
            </View>
            <View style={{marginTop:20}}>
              <Button title="Cadastrar" color="#5359D1" onPress={adicionaLista} />
            </View>
            <View style={{marginTop:10}}>
              <Button title="Voltar" color="#b5b2b2" onPress={onClose} />
            </View>
          </View>
        </Modalize>
      </Portal>
    );
};

export default BottomSheet;

const styles = StyleSheet.create({
  content: {
    flex: 1,
    flexDirection:'column',
    //justifyContent: "space-between",
    height: modalHeight,
    paddingHorizontal: 20,
    paddingVertical: 32,
    backgroundColor: "#FFFFFF",
  },
  text: {
    fontSize: 18,
    alignSelf: "center",
    color: "#5359D1",
  },
  containerInput: {
    width: '80%',
    marginVertical: 12,
    marginLeft: '10%',
    marginRight:'10%',
  },
  
});