import Button from '../components/Button';
import Input from '../components/Input';
import auth from '../Firebase/auth';
import { useAuth, useAuthUpdate } from '../context/AuthContext';
import { useState } from 'react';
import Link from 'next/link';

function ErrorHandler(props){
    let error = props.error;
    console.log(`Handling error in NewLogin \n${JSON.stringify(error)}`)
    if(error.code){
        return (
            <div>
                <p className="text-red-700">Error on sign in.</p>
                <Link href="/myProfile" passHref><a className="underline">go to sign up</a></Link>
            </div>
        );
    } else {
        return (
            <div></div>
        );
    }
}

function EmailPasswordSignIn(){
    let updateAuth = useAuthUpdate();
    let [formValues, setFormValues] = useState({
        email: '',
        password: ''
    });
    let [errorState, setErrorState] = useState({});

    function handleInputChange(e){
        let {name, value} = e.target;
        setFormValues({...formValues, [name]: value})
    }
    
    async function signInUser(){
        try {
            let result = await auth.signinWithEmailAndPassword(formValues.email, formValues.password);
            updateAuth(result);
        } catch (error) {
            throw(error);
        }
    }
    
    return (
        <div>
            <ErrorHandler error={errorState} />
            <form>
                <label className="my-2">Email:</label>
                <Input type="text" name="email" value={formValues.email} onChange={handleInputChange} />
                <label className="my-2">Password:</label>
                <Input type="password" name="password" value={formValues.password} onChange={handleInputChange} />
                <Button text="Sign In" onClick={async(e) => {
                    e.preventDefault();
                    try {
                        await signInUser();
                    }catch(error){
                        setErrorState(error);
                    }
                }} addClassName="my-2" />
            </form>
        </div>
    )
}

const GoogleSignInButton = () => {
    let updateAuth = useAuthUpdate();
    let [ errorState, setErrorState ] = useState({});
    
    async function signIn(){
        try {
            let result = await auth.signinWithGoogle();
            updateAuth(result);
        } catch (error) {
            console.error(`Error with GoogleSignUpButton\n${JSON.stringify(error)}`)
            throw(error);
        }
    }

    return (
        <div className='grid py-2'>
            <ErrorHandler error={errorState} />
            <Button text="Sign In with Google" onClick={async()=>{
                try{
                    await signIn();
                } catch (error) {
                    setErrorState(error);
                }
            }} addClassName="m-2"/>
        </div>
    )
}

const SignOutButton = () => {
    let updateAuth = useAuthUpdate();
    
    async function signOut(){
        await auth.signout();
        updateAuth(null);
    }

    return (
        <Button text="Sign Out" onClick={signOut} addClassName="m-2" />
    )
}

const NewLogin = () => {
    let authUser = useAuth();

    function showUser (){
        // Temporary function to show user in the console for development purposes
        console.log(`${JSON.stringify(authUser)}`);
    }
    
    return (
        <div className='px-10 py-2'>
            { authUser.user ?
                    <SignOutButton />
                :
                    <div className="">
                        <EmailPasswordSignIn />
                        <p className='text-center'>or</p>
                        <GoogleSignInButton />
                    </div>
            }
            <button onClick={showUser}>Show user</button>
        </div>
    )
}

export default NewLogin;