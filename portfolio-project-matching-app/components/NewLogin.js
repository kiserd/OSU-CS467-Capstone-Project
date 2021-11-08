import Button from './Button';
import auth from '../Firebase/auth';
import { useEffect, useState, useContext } from 'react';
import { useAuth, useAuthUpdate, AuthContext } from '../context/AuthContext';
import { updateDoc } from '../backend/dao';



const GoogleSignInButton = () => {
    let updateAuth = useAuthUpdate();
    async function signIn(){
        let result = await auth.signinWithGoogle();
        updateAuth(result);
        // Check if user is in user collection using uid
    }
    return (
        <Button text="Sign In with Google" onClick={signIn}/>
    )
}

const SignOutButton = () => {
    let updateAuth = useAuthUpdate();
    async function signOut(){
        let result = await auth.signout();
        updateAuth(null);
    }
    return (
        <Button text="Sign Out" onClick={signOut}/>
    )
}

const NewLogin = () => {
    let uid = useAuth();

    function showUser (){
        console.log(`${JSON.stringify(uid)}`);
    }
    
    return (
        <div>
            { uid.user ?
                    <SignOutButton />
                :
                    <GoogleSignInButton />
            }
            <button onClick={showUser}>Show user</button>
        </div>
    )
}

export default NewLogin;