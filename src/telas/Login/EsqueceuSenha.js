import React, { useContext, useState } from 'react'
import { Text, View,StyleSheet,SafeAreaView } from 'react-native'
import { useNavigation, useRoute } from '@react-navigation/native';
import { Button,TextInput } from 'react-native-paper';

import firebase from '../../../firebaseconfig';

export default function EsqueceuSenha()
{
    const navigation = useNavigation();

    
    const [email, setEmail] = useState('')
    const [erro, setErro] = useState('')
    const [success, setSuccess] = useState('')

    const resetPassword = () => {
 
        email.trim() === '' ? setErro('Digite o email do usuário!') : ''

        erro === '' ?  

        firebase.auth().sendPasswordResetEmail(email.trim())
        .then(() => {
            // Password reset email sent!
            
            setSuccess('Email de redefinição de senha enviado! Se necessário, confira sua caixa de spam.')
            setErro('')

          })
          .catch((error) => {
            //console.log(error.code)
            //console.log(error.message)
            setSuccess('')
            
            error.code === 'auth/invalid-email' ? setErro('Email inválido!') : ''
            error.code === 'auth/user-not-found' ? setErro('Email não cadastrado!') : ''
            
            // ..
          })


        : ''
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
          }}>Digite o email para recuperação:</Text>

    <View style={styles.containerInput}>

    <TextInput
        label="Email"
        returnKeyType="next"
        onChangeText={text => setEmail(text)}
        selectionColor={'#5359D1'}
        underlineColor="transparent"
        mode="outlined"
        style={{marginBottom:10, height:50}}
    />

     </View>

    {success === '' ? <></> : <Text style={{width:'90%', marginLeft:10, color:'#58d47d', textAlign:'center'}}>{success}</Text>}

    {erro === '' ? <></> : <Text style={{marginLeft:10, color:'red', textAlign:'center'}}>{erro}</Text>}

     <Button style={styles.botao} mode="contained" onPress={resetPassword}>
            Enviar
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