import { getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { createNewUserDocWithId, getUserById } from '../backend/daoUser';



const signinWithGoogle = async() => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        // Check if user has a doc collection in the database
        console.log(`${JSON.stringify(user)}`)
        let userDoc = await getUserById(user.uid);
        if (userDoc === -1){
            // If the user is here for the first time, throw an error
            throw({code: "auth/no-user-found"})
        }
        return userDoc;
    } catch (error) {
        throw(error);
    }    
}

const signupWithGoogle = async() => {
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        // Check if user has a doc collection in the database
        console.log(`${JSON.stringify(user)}`)
        let userDoc = await getUserById(user.uid);
        if (userDoc === -1){
            // If the user is here for the first time, make them a new user doc
            await createNewUserDocWithId({
                // Some default values for their username, email, and introduction
                email: user.email,
                username: user.email,
                introduction: `Hi, I'm ${user.displayName}`,
            }, user.uid);
            userDoc = await getUserById(user.uid);
        } else {
            throw({code: 'auth/email-already-in-use'})
        }
        return userDoc;
    } catch (error) {
        throw(error);
    }    
}

const signUpWithEmailAndPassword = async(email, password) => {
    const auth = getAuth();
    try {
        let result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
        // Check if user has a doc collection in the database
        let userDoc = await getUserById(user.uid);
        if (userDoc === -1){
            // If the user is here for the first time, make them a new user doc
            await createNewUserDocWithId({
                // Some default values for their username, email, and introduction
                email: user.email,
                username: user.email,
                introduction: `Hi, I'm anonymous`,
            }, user.uid);
            userDoc = await getUserById(user.uid);
        }
        return userDoc;
    } catch (error) {
        console.error(`Error on sign up with Email and Password:\n${error}`);
        throw(error);
    }    
}

const signinWithEmailAndPassword = async(email, password) => {
    const auth = getAuth();
    try {
        let result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;
        // Check if user has a doc collection in the database
        let userDoc = await getUserById(user.uid);
        if (userDoc === -1){
            // If the user is here for the first time throw an error. This is sign in
            throw({error: "no_user_found"})
        }
        return userDoc;
    } catch (error) {
        console.error(`Error on sign in with Email and Password:\n${error}`);
        throw(error);
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
   

export default { signupWithGoogle, signinWithGoogle, signUpWithEmailAndPassword, signinWithEmailAndPassword, signout }