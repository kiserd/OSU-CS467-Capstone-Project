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
        console.log(`${JSON.stringify(user)} logged in.`)
        return user;
    } catch (error) {
        const errorCode = error.code;
        const errorMessage = error.message;
        const email = error.email;
        const credential = GoogleAuthProvider.credentialFromError(error);
        console.error(`${errorCode}`);
        return null;
    }    
}

const signout = async () => {
    const auth = getAuth();
    try {
        let result = await auth.signOut();
        return result;
    } catch (error) {
        console.error(`${error} on signout`)
        return error;
    }
}
   

export default { signin, signout }