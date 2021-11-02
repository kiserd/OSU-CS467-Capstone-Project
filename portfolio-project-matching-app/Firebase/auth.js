import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, auth } from "firebase/auth";
import { firebaseApp } from "./clientApp.ts";
const provider = new GoogleAuthProvider();

const signin = async() => {
    const auth = getAuth();
    try {
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        console.log(`${user} logged in.`)
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error(`${errorCode}`);
    }    
}

const signout = async () => {
    const auth = getAuth();
    try {
        let result = await auth.signOut();
        console.log(`${result}`)
    } catch (error) {
        console.error(`${error} on signout`)
    }
}

const getUid = () => {
    // Returns 0 if user is not signed in, otherwise returns uid
    const auth = getAuth();
    return auth.currentUser ? auth.currentUser.uid : 0;
}

const listenForAuthChange = (callback) => {
    const auth = getAuth();
    return auth.onAuthStateChanged((user)=>{
        if (user) {
            callback(user);
        } else {
            callback(0);
        }
    });
}

export default { signin, signout, getUid, listenForAuthChange }