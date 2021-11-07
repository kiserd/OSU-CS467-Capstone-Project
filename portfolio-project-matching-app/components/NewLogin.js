import Button from './Button';
import auth from '../Firebase/auth';
import { useEffect, useState } from 'react';
import { useAuth, useAuthUpdate } from '../context/AuthContext';



const SignInButton = () => {
    let updateAuth = useAuthUpdate();
    async function signIn(){
        let result = await auth.signin();
        updateAuth(result);
    }
    return (
        <Button text="Sign In" onClick={signIn}/>
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
    
    return (
        <div>
            { uid.user ?
                    <SignOutButton />
                :
                    <SignInButton />
            }
        </div>
    )
}

export default NewLogin;