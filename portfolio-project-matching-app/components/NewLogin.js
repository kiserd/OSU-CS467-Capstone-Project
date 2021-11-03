import Button from './Button';
import auth from '../Firebase/auth';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';

const SignInButton = () => {
    return (
        <Button text="Sign In" onClick={auth.signin}/>
    )
}

const SignOutButton = () => {
    return (
        <Button text="Sign Out" onClick={auth.signout}/>
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