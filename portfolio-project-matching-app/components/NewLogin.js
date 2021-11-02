import Button from './Button';
import auth from '../Firebase/auth';
import { useEffect, useState } from 'react';

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
    let [uid, setuid] = useState();

    useEffect(async()=>{
        const unsubscribe = auth.listenForAuthChange((user)=>{
            setuid(user);
        });
        return unsubscribe;
    }, []);

    return (
        <div>
            { uid ?
                    <SignOutButton />
                :
                    <SignInButton />
            }
        </div>
    )
}

export default NewLogin;