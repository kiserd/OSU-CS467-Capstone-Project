import { getAuth, 
    signInWithPopup, 
    GoogleAuthProvider, 
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
} from "firebase/auth";
import { readObjectById, createDocWithId } from "../backend/dao";



const signinWithGoogle = async() => {
    /* Signs the user in with google.
        
    User must already have an account.
        
    If the user doesn't have an account or firebase throws an error, 
    this function will throw an error.
    */
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        // Check if user has a doc collection in the database
        console.log(`${JSON.stringify(user)}`)
        let userDoc = await readObjectById('users', user.uid, true);
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
    /* Signs the user up with google.
        
    User must not yet have an account.
        
    If the user does have an account or firebase throws an error, 
    this function will throw an error.
    */
    const provider = new GoogleAuthProvider();
    const auth = getAuth();
    try {
        const result = await signInWithPopup(auth, provider);
        const user = result.user;
        // Check if user has a doc collection in the database
        console.log(`${JSON.stringify(user)}`)
        let userDoc = await readObjectById('users', user.uid, true);
        if (userDoc === -1){
            // If the user is here for the first time, make them a new user doc
            const payload = {
                email: user.email,
                username: user.email,
                introduction: `Hi, I'm ${user.displayName}`,
            }
            await createDocWithId('users', payload, user.uid);
            userDoc = await readObjectById('users', user.uid, true);
        } else {
            throw({code: 'auth/email-already-in-use'})
        }
        return userDoc;
    } catch (error) {
        throw(error);
    }    
}

const signUpWithEmailAndPassword = async(email, password) => {
    /* Signs the user in with username and password.
        
    User must not have an account.
        
    If the user doesn have an account or firebase throws an error, 
    this function will throw an error.
    */
    const auth = getAuth();
    try {
        let result = await createUserWithEmailAndPassword(auth, email, password);
        const user = result.user;
        // Check if user has a doc collection in the database
        let userDoc = await readObjectById('users', user.uid, true);
        if (userDoc === -1){
            // If the user is here for the first time, make them a new user doc
            const payload = {
                email: user.email,
                username: user.email,
                introduction: `Hi, I'm anonymous`
            }
            await createDocWithId('users', payload, user.uid);
            userDoc = await readObjectById('users', user.uid, true);
        }
        return userDoc;
    } catch (error) {
        console.error(`Error on sign up with Email and Password:\n${error}`);
        throw(error);
    }    
}

const signinWithEmailAndPassword = async(email, password) => {
    /* Signs the user in with username and password.
        
    User must already have an account.
        
    If the user doesn't have an account or firebase throws an error, 
    this function will throw an error.
    */
    const auth = getAuth();
    try {
        let result = await signInWithEmailAndPassword(auth, email, password);
        const user = result.user;
        // Check if user has a doc collection in the database
        let userDoc = await readObjectById('users', user.uid, true);
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
    /* 
    Signs the user out 
    */
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