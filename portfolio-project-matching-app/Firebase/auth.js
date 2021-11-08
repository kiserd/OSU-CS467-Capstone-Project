import { getAuth, signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, auth } from "firebase/auth";
import { createNewUserDocWithId, getUserById } from '../backend/daoUser';
import { useAuthUpdate } from '../context/AuthContext';
import { firebaseApp } from "./clientApp.ts";



const signinWithGoogle = async() => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        // Check if user has a doc collection in the database
        let userDoc = await getUserById(user.uid);
        if (userDoc === -1){
            const newUser = await createNewUserDocWithId({
                email: user.email,
                username: user.email,
                introduction: `Hi, I'm ${user.displayName}`,
            }, user.uid);
            userDoc = await getUserById(user.uid);
        }
        return userDoc;
    } catch (error) {
        console.error(`Error on sign in:\n${error}`);
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
   

export default { signinWithGoogle, signout }