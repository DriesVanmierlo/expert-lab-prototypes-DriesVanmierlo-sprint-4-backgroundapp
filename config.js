import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import { getAuth, updateProfile } from "firebase/compat/auth";
import { ref, uploadBytes, getDownloadURL } from 'firebase/compat/storage';

import { collection, doc, setDoc, getDoc } from "firebase/firestore"; 

export const firebaseConfig = {
    apiKey: "AIzaSyDFGiabw3T5F3tPw3dYBw7QZ2Y0YXe21oM",
    authDomain: "careerlaunch-4-aabf9.firebaseapp.com",
    databaseURL: "https://careerlaunch-4-aabf9-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "careerlaunch-4-aabf9",
    storageBucket: "careerlaunch-4-aabf9.appspot.com",
    messagingSenderId: "654422240311",
    appId: "1:654422240311:web:c829281cdccbe3795623b2"
};

if(!firebase.apps.length){
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth()
const storage = firebase.storage()
const db = firebase.firestore()

export { auth };

export async function upload(file, currentUser, setLoading) {

    setLoading(true);

    const response = await fetch(file)
    const blob = await response.blob()
    const filename = `${currentUser.uid}.jpg`
    var ref = firebase.storage().ref(filename).put(blob)
    var fileRef = storage.ref(filename)

    try {
        await ref;
    } catch (error){
        console.log(error)
    }

    // const authUser = getAuth();
    const photoURL = await fileRef.getDownloadURL(fileRef)
    // console.log("FOTO URL:", photoURL)

    // console.log("CURRENT USER", currentUser)
    await currentUser.updateProfile({ photoURL })

    setLoading(false);

    // console.log('photo URL', photoURL)
    // return photoURL;

    // const fileRef = ref(storage, currentUser.uid + '.jpg');

    // setLoading(true);
    // const snapshot = await uploadBytes(fileRef, file);
    // setLoading(false);
    // alert("Uploaded!")
}

export async function saveUser (uid, firstName, lastName, email, phoneNumber, profileURL, pushToken) {

    const user = {
        "uid": uid,
        "firstname": firstName,
        "lastname": lastName,
        "email": email,
        "phoneNumber": phoneNumber,
        "profileURL": profileURL,
        "pushToken": pushToken 
    }

    await db.collection("users").doc(uid).set({user})

    // const collectionName = "users/"

    // var ref = firebase.firestore().collection(collectionName).add(user)

    // try {
    //     await ref;
    // } catch (error){
    //     console.log(error)
    // }



    // const usersRef = collection(db, "users")

    // await setDoc(doc(usersRef, uid), {
    //     newUser
    // })
}

export async function getUser (uid){
    const docRef = doc(db, "users", uid)
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return docSnap.data()
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }
}

export async function addPhotoURLToCurrentUser (user, uid){
    const userRef = doc(db, 'users', uid)
    await setDoc(userRef, { user }, {merge: true})

    // await setDoc(doc(db, 'users', uid), {user})
}

export async function updateUserLocation (user, uid){
    const userRef = doc(db, 'users', uid)
    await setDoc(userRef, { user }, {merge: true})
}

