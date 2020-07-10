import app from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'
import 'firebase/storage'

let firebaseConfig = {
  apiKey: "AIzaSyDvEXsVkrNOlEtHCisPMcy0rApTOyhs2KY",
  authDomain: "reactapp-19c60.firebaseapp.com",
  databaseURL: "https://reactapp-19c60.firebaseio.com",
  projectId: "reactapp-19c60",
  storageBucket: "reactapp-19c60.appspot.com",
  messagingSenderId: "1098074902012",
  appId: "1:1098074902012:web:2735ae4465f99cb8e9f679",
  measurementId: "G-TDS7B7KTKW"
};
class Firebase{
  constructor(){
    app.initializeApp(firebaseConfig);
    
    //referenciando a database
    this.app = app.database();
    this.storage = app.storage();
  }
  login(email,password){
    return app.auth().signInWithEmailAndPassword(email,password)
  }
  logout(){
    return app.auth().signOut();
  }
  async register(nome,email,password){
    await app.auth().createUserWithEmailAndPassword(email,password)
    const uid = app.auth().currentUser.uid
    return app.database().ref('usuarios').child(uid).set({
      nome:nome,
    })
  }
  isInitialized(){
    return new Promise(resolve =>{
      app.auth().onAuthStateChanged(resolve);
    })
  }
  getCurrent(){
    return app.auth().currentUser && app.auth().currentUser.email
  }
  getCurrentUid(){
    return app.auth().currentUser && app.auth().currentUser.uid
  }
  async getUserName(callback){
    if(!app.auth().currentUser){
      return null;
    }
    const uid = app.auth().currentUser.uid;
    await app.database().ref('usuarios').child(uid).once('value').then(callback);
  }
}
export default new Firebase()