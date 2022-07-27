import firebase from 'firebase'
import "firebase/storage"

var firebaseConfig = {

  };
  
 
firebase.initializeApp(firebaseConfig);

firebase.firestore().settings({ experimentalForceLongPolling: true, merge:true });

export default firebase