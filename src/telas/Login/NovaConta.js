import React, { useContext, useState } from 'react'
import { Text, View,StyleSheet,SafeAreaView } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button,TextInput } from 'react-native-paper';
import { GlobalContext } from '../../contexts/GlobalContext';

import firebase from '../../../firebaseconfig';

export default function NovaConta()
{
    const navigation = useNavigation();

    const [nome, setNome] = useState('')
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('')
    const [confirm, setConfirm] = useState('')
    const [erro, setErro] = useState('')
    const [secureTextEntry, setSecureTextEntry] = useState(true)
    const {setIdUsuario, setUsuario } = useContext(GlobalContext)
    const database = firebase.firestore()


    const novoUsuario = () => {
 
        senha != confirm ? setErro('As senhas digitadas devem ser iguais!') : ''

        nome.trim() === '' ? setErro('Digite o nome do usuário!') : ''

        email.trim() === '' ? setErro('Digite o email do usuário!') : ''

        senha.trim() === '' ? setErro('Digite a senha do usuário!') : ''

        senha.length < 6 ? setErro('A senha deve ter ao menos 6 caracteres!') : ''

        erro === '' ?  

        firebase.auth().createUserWithEmailAndPassword(email, senha)
          .then((userCredential) => {
          // Signed in
            
            let user = userCredential.user;
            
            //adiciona na tabela users:
            setErro('')
            adicionaUser(user.uid)

            // ...
          })
          .catch((error) => {
            var errorCode = error.code;
            var errorMessage = error.message;
            // ..
            //console.log(errorCode)
            //console.log(errorMessage)

            errorCode === 'auth/invalid-email' ? setErro('Email inválido!') : ''
            errorCode === 'auth/email-already-in-use' ? setErro('Email já cadastrado!') : ''

        })
        
        : ''
      }
  



    function adicionaUser(id)
    {

        database.collection("users").doc(id).set({
            nome: nome.trim(),
            email: email.trim(),
            senha: senha.trim()
        })
        .then(() => {
            //console.log("Document successfully written!");
            setIdUsuario(id)
            setUsuario(nome)
            navigation.navigate('Principal')

        })
        .catch((error) => {
            console.error("Error writing document: ", error);
        });

    }

    
    return <>
    
    <SafeAreaView style={styles.container}>
    <Text style={{
            fontSize: 16,
            fontWeight: 'bold',
            color: '#5359D1',
            paddingTop: 20,
            textAlign:'center',
            paddingBottom: 10,
          }}>Digite os dados da nova conta:</Text>

    <View style={styles.containerInput}>
    <TextInput
        label="Nome"
        returnKeyType="next"
        onChangeText={text => setNome(text)}
        selectionColor={'#5359D1'}
        underlineColor="transparent"
        mode="outlined"
        style={{marginBottom:10, height:50}}
    />
    <TextInput
        label="Email"
        returnKeyType="next"
        onChangeText={text => setEmail(text)}
        selectionColor={'#5359D1'}
        underlineColor="transparent"
        mode="outlined"
        style={{marginBottom:10, height:50}}
    />
    <TextInput
        label="Senha"
        returnKeyType="done"
        onChangeText={text => setSenha(text)}
        selectionColor={'#5359D1'}
        underlineColor="transparent"
        mode="outlined"
        style={{marginBottom:10, height:50}}
        secureTextEntry={secureTextEntry}
        right={<TextInput.Icon
          name="eye"
          onPress={() => {
            setSecureTextEntry(!secureTextEntry);
            return false;
          }}
        />}
      />
      <TextInput
        label="Confirme a senha"
        returnKeyType="done"
        onChangeText={text => setConfirm(text)}
        selectionColor={'#5359D1'}
        underlineColor="transparent"
        mode="outlined"
        style={{marginBottom:10, height:50}}
        secureTextEntry={secureTextEntry}
        right={<TextInput.Icon
          name="eye"
          onPress={() => {
            setSecureTextEntry(!secureTextEntry);
            return false;
          }}
        />}
      />
     </View>

    {erro === '' ? <></> : <Text style={{marginLeft:10, color:'red', textAlign:'center'}}>{erro}</Text>}

     <Button style={styles.botao} mode="contained" onPress={novoUsuario}>
            Cadastrar
      </Button>
      <Button style={styles.botaoVoltar} mode="contained" onPress={() => {navigation.goBack()}}>
            Voltar
      </Button>
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
    width:'90%',
    marginLeft:'5%',
    marginTop:10
  },  
})