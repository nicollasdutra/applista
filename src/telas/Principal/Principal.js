import React, { useContext, useEffect, useRef, useState } from 'react';
import { Animated, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import firebase from '../../../firebaseconfig';

import { GlobalContext } from '../../contexts/GlobalContext';


import logo from '../../../assets/logo.png';

// Tab ICons...
import home from '../../../assets/home.png';
import search from '../../../assets/search.png';
import settings from '../../../assets/settings.png';
import logout from '../../../assets/logout.png';
// Menu
import menu from '../../../assets/menu.png';
import close from '../../../assets/close.png';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Ionicons';

import Login from '../Login/Login';
import Listas from '../Listas/Listas';
import ListasShared from '../Listas/ListasShared';
import Configuracoes from '../Configuracoes/Configuracoes';

export default function Principal() {

  const navigation = useNavigation();

  const { setIdUsuario, usuario, setUsuario, currentTab, setCurrentTab } = useContext(GlobalContext)

  // To get the curretn Status of menu ...
  const [showMenu, setShowMenu] = useState(false);

  // Animated Properties...

  const offsetValue = useRef(new Animated.Value(0)).current;
  // Scale Intially must be One...
  const scaleValue = useRef(new Animated.Value(1)).current;
  const closeButtonOffset = useRef(new Animated.Value(0)).current;

  const loginSair = () => {

    firebase.auth()
    .signOut()
    .then(() => {
        setUsuario('')
        setIdUsuario('')
        navigation.navigate('Principal', {})
    })
    .catch(error => alert(error.message))
  }



  return (
    
        <>    
    <SafeAreaView style={styles.container}>
      <View style={{ justifyContent: 'flex-start', padding: 15 }}>
        

        <Text style={{
          fontSize: 20,
          fontWeight: 'bold',
          color: 'white',
          marginTop: 20
        }}>{usuario === undefined ? 'Faça seu login' : usuario === 'Faça seu login' ? 'Faça seu login' : 'Olá ' + usuario}</Text>

        <TouchableOpacity>
          <Text style={{
            marginTop: 6,
            color: 'white'
          }}>{usuario === undefined ? '' : usuario === '' ? '' : 'meu perfil'}</Text>
        </TouchableOpacity>

        <View style={{ flexGrow: 1, marginTop: 50 }}>
          {
            // Tab Bar Buttons....
          }

          {usuario === undefined ? TabButton(currentTab, setCurrentTab, "Login", home, false ,'',showMenu,setShowMenu, offsetValue,scaleValue,closeButtonOffset) : usuario === '' ? TabButton(currentTab, setCurrentTab, "Login", home, false ,'',showMenu,setShowMenu, offsetValue,scaleValue,closeButtonOffset) : ''}
          {usuario === undefined ? '' : usuario === '' ? '' : TabButton(currentTab, setCurrentTab, "Minhas Listas", search, true, "md-list",showMenu,setShowMenu, offsetValue,scaleValue,closeButtonOffset)}
          {usuario === undefined ? '' : usuario === '' ? '' : TabButton(currentTab, setCurrentTab, "Compartilhadas", search, true, "md-list",showMenu,setShowMenu, offsetValue,scaleValue,closeButtonOffset)}
          {/* {usuario === undefined ? '' : usuario === '' ? '' : TabButton(currentTab, setCurrentTab, "Configurações", settings, false, '',showMenu,setShowMenu, offsetValue,scaleValue,closeButtonOffset)}
 */}
        </View>

        <View>
          {usuario === undefined ? '' : usuario === '' ? '' : <TouchableOpacity onPress={loginSair} style={{flexDirection: "row", marginLeft:10}} ><Icon name='log-out-outline' size={18} color="white" /><Text style={{color:'white'}}> Log Out</Text></TouchableOpacity>}
        </View>

      </View>

      {
        // Over lay View...
      }

      <Animated.View style={{
        flexGrow: 1,
        backgroundColor: 'white',
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 15,
        paddingVertical: 20,
        borderRadius: showMenu ? 15 : 0,
        // Transforming View...
        transform: [
          { scale: scaleValue },
          { translateX: offsetValue }
        ]
      }}>

        {
          // Menu Button...
        }

        <Animated.View style={{
          transform: [{
            translateY: closeButtonOffset
          }]
        }}>

          <View style={{flexDirection:'row', justifyContent:'space-between'}}>
            


          <TouchableOpacity onPress={() => {
            // Do Actions Here....
            // Scaling the view...
            Animated.timing(scaleValue, {
              toValue: showMenu ? 1 : 0.88,
              duration: 300,
              useNativeDriver: true
            })
              .start()

            Animated.timing(offsetValue, {
              // YOur Random Value...
              toValue: showMenu ? 0 : 200, //esse 200 é a posicao que a tela principal se desloca pro lado
              duration: 300,
              useNativeDriver: true
            })
              .start()

            Animated.timing(closeButtonOffset, {
              // YOur Random Value...
              toValue: !showMenu ? -30 : 0,
              duration: 300,
              useNativeDriver: true
            })
              .start()

            setShowMenu(!showMenu);
          }}>

            <Image source={showMenu ? close : menu} style={{
              width: 20,
              height: 20,
              tintColor: 'black',
              marginTop: 20,

            }}></Image>

          </TouchableOpacity>
          <View style={{flexDirection:'row'}}>
              <Image source={logo} style={{width:24,height:24, marginTop:17, marginLeft:30}} />
              <Text style={{fontSize:16, color:'#5359D1', marginTop:17, marginLeft:10}}>List Me Now!</Text>
            </View>
          </View>
          
          <Text style={{
            fontSize: 18,
            fontWeight: 'bold',
            color: '#5359D1',
            paddingTop: 20,
            paddingBottom: 10,
          }}>{currentTab}</Text>

          
          {/* Carrega aqui a pagina App.js */}

          {currentTab === "Login" ? usuario === undefined ? <Login /> : usuario === '' ? <Login /> : <Listas /> : 
            currentTab === "Minhas Listas" ? usuario === undefined ? <Login /> : usuario === '' ? <Login /> : <Listas /> : 
              currentTab === "Compartilhadas" ? usuario === undefined ? <Login /> : usuario === '' ? <Login /> : <ListasShared /> : 
                /* currentTab === "Configurações" ? usuario === undefined ? <Login /> : usuario === '' ? <Login /> : <Configuracoes /> : 
 */
              ''
          }
          


        </Animated.View>

      </Animated.View>
      </SafeAreaView>
      </>
    
  );
}

// For multiple Buttons...
const TabButton = (currentTab, setCurrentTab, title, image, isIcon, nameIcon,showMenu,setShowMenu, offsetValue,scaleValue,closeButtonOffset) => {
  return (

    <TouchableOpacity onPress={() => {
      if (title == "LogOut") {

      } else {
        setCurrentTab(title)
      }

      Animated.timing(scaleValue, {
        toValue: showMenu ? 1 : 0.88,
        duration: 300,
        useNativeDriver: true
      })
        .start()

      Animated.timing(offsetValue, {
        // YOur Random Value...
        toValue: showMenu ? 0 : 200, //esse 200 é a posicao que a tela principal se desloca pro lado
        duration: 300,
        useNativeDriver: true
      })
        .start()

      Animated.timing(closeButtonOffset, {
        // YOur Random Value...
        toValue: !showMenu ? -30 : 0,
        duration: 300,
        useNativeDriver: true
      })
        .start()

      setShowMenu(!showMenu);
    }}>

      <View style={{
        flexDirection: "row",
        alignItems: 'center',
        paddingVertical: 8,
        backgroundColor: currentTab == title ? 'white' : 'transparent',
        paddingLeft: 10,
        paddingRight: 20,
        borderRadius: 8,
        marginTop: 10
      }}>

       { isIcon == false
        ?
        <Image source={image} style={{
          width: 18, height: 18,
          tintColor: currentTab == title ? '#5359D1' : "white"
        }}></Image>
        :
        currentTab == title ? <Icon name={nameIcon} size={18} color='#5359D1' /> : <Icon name={nameIcon} size={18} color="white" />
      }

        <Text style={{
          fontSize: 14,
          paddingLeft: 10,
          color: currentTab == title ? '#5359D1' : "white"
        }}>{title}</Text>

      </View>
    </TouchableOpacity>
  );
}


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#5359D1',
      alignItems: 'flex-start',
      justifyContent: 'flex-start',
    },
  });