import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, auth } from "firebase/auth";
import { useAuthUpdate } from '../context/AuthContext';
import { firebaseApp } from "./clientApp.ts";
const provider = new GoogleAuthProvider();


const signin = async() => {
    const auth = getAuth();
    try {
        const result = await signInWithPopup(auth, provider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const token = credential.accessToken;
        const user = result.user;
        // Check if user in db here
        return user;
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error(`Error on sign in:\n${errorCode}`);
        return null;
    }    
}

const signout = async () => {
    const auth = getAuth();
    try {
        let result = await auth.signOut();
        return result;
    } catch (error) {
        console.error(`Error on sign out:\n${error}`)
        return error;
    }
}
   

export default { signin, signout }