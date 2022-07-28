import React, { useContext, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import Login from '../Login/Login';
import Principal from '../Principal/Principal';
import Listas from '../Listas/Listas';
import Configuracoes from '../Configuracoes/Configuracoes';
import NovaConta from '../Login/NovaConta';
import EsqueceuSenha from '../Login/EsqueceuSenha';
import Lista from '../Listas/Lista';
import ListaConfig from '../Listas/ListaConfig';

import { GlobalContext } from '../../contexts/GlobalContext';


const Stack = createNativeStackNavigator();

const Rotas = () => {

    const { usuario, setUsuario } = useContext(GlobalContext)


    useEffect(() => {
        console.log(usuario)
        usuario === 'null' ? setUsuario('') : ''
    },[])

  return (
    <NavigationContainer independent={true}>
      <Stack.Navigator initialRouteName="Principal"
      screenOptions={{
        headerShown: false
      }}
      >
        <Stack.Screen
          name="Principal"
          component={Principal}
        />
        <Stack.Screen
          name="Login"
          component={Login}
        />
        <Stack.Screen
          name="Listas"
          component={Listas}
        />
        <Stack.Screen
          name="Configuracoes"
          component={Configuracoes}
        />
        <Stack.Screen
          name="NovaConta"
          component={NovaConta}
        />
        <Stack.Screen
          name="EsqueceuSenha"
          component={EsqueceuSenha}
        />
        <Stack.Screen
          name="Lista"
          component={Lista}
        />
        <Stack.Screen
          name="ListaConfig"
          component={ListaConfig}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};
export default Rotas;