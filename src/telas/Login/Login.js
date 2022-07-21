import React, { useContext, useEffect, useState } from 'react'
import { Text,View,TouchableOpacity, StyleSheet, LogBox } from 'react-native'
import { Avatar, Button, Card, Title, Paragraph,TextInput as Input } from 'react-native-paper';
import { auth } from '../../../firebase';
import { GlobalContext } from '../../contexts/GlobalContext';
import { useNavigation } from '@react-navigation/native';


LogBox.ignoreLogs(["AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'"]);

function TextInput({ errorText, description, ...props }) {
    return (
      <View style={styles.container}>
        <Input
          style={styles.input}
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
    const {usuario, setUsuario, setCurrentTab } = useContext(GlobalContext)
    const [email,setEmail] = useState('')
    const [password,setPassword] = useState('')
    
    useEffect(() => {
      
      setCurrentTab("Login")
      setUsuario(auth.currentUser?.email)
      
    },[])



    const novoUsuario = () => {
      auth
      .createUserWithEmailAndPassword(email,password)
      .then(userCredentials => {
        const user = userCredentials.user;
        alert("Usuário cadastrado com sucesso!")
      })
      .catch(error => alert(error.message))
    }

    const loginUsuario = () => {

      auth
      .signInWithEmailAndPassword(email,password)
      .then(userCredentials => {
        const user = userCredentials.user;
        setUsuario(user.email)
        navigation.navigate('Principal', {})
      })
      .catch(error => alert(error.message))
    }


    


    return <>
    
     <Text>Email logado: {usuario}</Text>   
    <TextInput
        label="Email"
        returnKeyType="next"
        onChangeText={text => setEmail(text)}
      />
      <TextInput
        label="Senha"
        returnKeyType="done"
        onChangeText={text => setPassword(text)}
        secureTextEntry
      />
      <View style={styles.forgotPassword}>
        <TouchableOpacity>
          <Text style={styles.forgot}>Esqueceu sua senha?</Text>
        </TouchableOpacity>
      </View>
      <Button style={styles.botao} mode="contained" onPress={loginUsuario}>
            Entrar
      </Button>
      <View style={styles.row}>
        <Text>Não possui uma conta? </Text>
        <TouchableOpacity>
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
        //backgroundColor: styles.colors.surface,
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