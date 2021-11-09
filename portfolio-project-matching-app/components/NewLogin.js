import Button from './Button';
import auth from '../Firebase/auth';
import { useAuth, useAuthUpdate } from '../context/AuthContext';


const GoogleSignInButton = () => {
    let updateAuth = useAuthUpdate();
    async function signIn(){
        let result = await auth.signinWithGoogle();
        updateAuth(result);
    }
    return (
        <Button text="Sign In with Google" onClick={signIn} addClassName="m-2"/>
    )
}

const SignOutButton = () => {
    let updateAuth = useAuthUpdate();
    async function signOut(){
        let result = await auth.signout();
        updateAuth(null);
    }
    return (
        <Button text="Sign Out" onClick={signOut} addClassName="m-2"/>
    )
}

const NewLogin = () => {
    let authUser = useAuth();

    function showUser (){
        // Temporary function to show user in the console for development purposes
        console.log(`${JSON.stringify(authUser)}`);
    }
    
    return (
        <div>
            { authUser.user ?
                    <SignOutButton />
                :
                    <GoogleSignInButton />
            }
            <button onClick={showUser}>Show user</button>
        </div>
    )
}

export default NewLogin;