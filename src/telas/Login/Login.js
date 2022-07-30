import React, { useContext, useEffect, useState } from 'react'
import { Text,View,TouchableOpacity, StyleSheet, LogBox } from 'react-native'
import { Avatar, Button, Card, Title, Paragraph,TextInput as Input } from 'react-native-paper';

import { GlobalContext } from '../../contexts/GlobalContext';
import { useNavigation } from '@react-navigation/native';

import firebase from '../../../firebaseconfig';


import { ref, set, update, onValue, remove } from "firebase/database";

LogBox.ignoreLogs(["AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'"]);

function TextInput({ errorText, description, ...props }) {
    return (
      <View style={styles.container}>
        <Input
          selectionColor={'#5359D1'}
          underlineColor="transparent"
          mode="outlined"
          {...props}
        />
        {description && !errorText ? (
          <Text style={styles.description}>{description}</Text>
        ) : null}
        {errorText ? <Text style={styles.error}>{errorText}</Text> : null}
      </View>
    )
  }


export default function Login(){

    

    const navigation = useNavigation();
    const {idUsuario, setIdUsuario, usuario, setUsuario, setCurrentTab, setListaShared } = useContext(GlobalContext)
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    const [secureTextEntry, setSecureTextEntry] = useState(true);
    const database = firebase.firestore()

    useEffect(() => {
      
      setCurrentTab("Login")
      setIdUsuario(firebase.auth.currentUser?.uid)
      setUsuario(firebase.auth.currentUser?.email)
      
      //console.log(idUsuario)

    },[])


    
    const loginUsuario = () => {

      firebase.auth().signInWithEmailAndPassword(email.trim(), password.trim())
      .then((userCredential) => {
    // Signed in
        let user = userCredential.user;
        setIdUsuario(user.uid)
        //setUsuario(user.email)
        //console.log(idUsuario)
        consultaUsuario(user.uid)


        const listS = []
    
        database.collection("shared").where("email", "==", email.trim())
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              
                database.collection("lists").doc(doc.data().idlist)
                .get()
                .then((item) => {
                    listS.push({
                    id: item.id,
                    nome: item.data().nome,
                    categoria: item.data().categoria,
                    data: item.data().data,
                    username: item.data().username
                  }) 
                })
            });
  
            setListaShared(listS)
            
        })
        .catch((error) => {
            //console.log("Error getting documents: ", error);
        });
  


    // ...
      })
      .catch((error) => {
        var errorCode = error.code;
        var errorMessage = error.message;
      });


    }

    function consultaUsuario(id)
    {
      
      var docRef = database.collection("users").doc(id);

      docRef.get()
      .then((doc) => {
        if (doc.exists) {
          //console.log("Document data:", doc.data());
          setUsuario(doc.data().nome)

        } else {
          // doc.data() will be undefined in this case
          //console.log("No such document!");
        }
      })
      .catch((error) => {
        //console.log("Error getting document:", error);
      });
      

    }

    return <>
    
    <TextInput
        label="Email"
        returnKeyType="next"
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        label="Senha"
        returnKeyType="done"
        onChangeText={text => setPassword(text)}
        secureTextEntry={secureTextEntry}
        right={<Input.Icon
          name="eye"
          onPress={() => {
            setSecureTextEntry(!secureTextEntry);
            return false;
          }}
        />}
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity onPress={() => {navigation.navigate('EsqueceuSenha')}}>
          <Text style={styles.forgot}>Esqueceu sua senha?</Text>
        </TouchableOpacity>
      </View>
      <Button style={styles.botao} mode="contained" onPress={loginUsuario}>
            Entrar
      </Button>
      <View style={styles.row}>
        <Text>Não possui uma conta? </Text>
        <TouchableOpacity onPress={() => {navigation.navigate('NovaConta')}}>
          <Text style={styles.link}>Cadastrar</Text>
        </TouchableOpacity>
      </View>

    </>
}

const styles = StyleSheet.create({
    colors: {
        text: '#000000',
        primary: '#5359D1',
        secondary: '#414757',
        error: '#f13a59',
      },
    forgotPassword: {
      width: '100%',
      alignItems: 'flex-end',
      marginBottom: 24,
    },
    row: {
      display: 'flex',
      marginTop: 14,
      alignItems:'center',
    },
    forgot: {
      fontSize: 13,
    },
    link: {
      fontWeight: 'bold',
    },
    container: {
        width: '100%',
        marginVertical: 12,
      },
      input: {
        
      },
      description: {
        fontSize: 13,
        color: '#414757',
        paddingTop: 8,
      },
      error: {
        fontSize: 13,
        color: '#f13a59',
        paddingTop: 8,
      },
      botao:{
        backgroundColor:'#5359D1',
      },
      
  })