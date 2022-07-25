import firebase from 'firebase'
import "firebase/storage"

var firebaseConfig = {

  apiKey: "AIzaSyC9N0eYTJaVbeywuRAbbzwZsXV0C5jb03s",
  authDomain: "projeto-lista-2ea1e.firebaseapp.com",
  databaseURL: "https://projeto-lista-2ea1e-default-rtdb.firebaseio.com",
  projectId: "projeto-lista-2ea1e",
  storageBucket: "projeto-lista-2ea1e.appspot.com",
  messagingSenderId: "660410502774",
  appId: "1:660410502774:web:754f9610f973ff9be15957"
  };
  
 
firebase.initializeApp(firebaseConfig);

firebase.firestore().settings({ experimentalForceLongPolling: true, merge:true });

export default firebase