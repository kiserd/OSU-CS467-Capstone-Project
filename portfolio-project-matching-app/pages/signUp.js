import Button from '../components/Button';
import Input from '../components/Input';
import auth from '../Firebase/auth';
import { useAuth, useAuthUpdate } from '../context/AuthContext';
import { useState } from 'react';
import router, { useRouter } from 'next/router';
import Link from 'next/link';

const ErrorHandler = (props) => {
    const error = props.error;
    console.log(`In handleSignUpError\n${JSON.stringify(error)}`)
    if (error.code === 'auth/email-already-in-use'){
        return(
            <div className="mx-10">
                <p className="text-red-700">That Email is already associated with an account. Please sign in instead of signing up.</p>
                <Link href="/myProfile" passHref><a className="underline">go to sign in</a></Link>
            </div>
        )
    } else if (error.code === 'auth/invalid-email'){
        return(
            <div className="mx-10">
                <p className="text-red-700">Invalid email address.</p>
            </div>
        )
    } else if (error.code === 'auth/weak-password'){
        return(
            <div className="mx-10">
                <p className="text-red-700">Password too weak.</p>
            </div>
        )
    } else if (error.code === 'auth/internal-error'){
        return(
            <div className="mx-10">
                <p className="text-red-700">Something went wrong. Please try again.</p>
            </div>
        )
    } else { 
        return <></>
    }
}

const EmailPasswordSignUp = () => {
    let router = useRouter();
    let updateAuth = useAuthUpdate();
    let [formValues, setFormValues] = useState({
        email: '',
        password: '',
        passwordRepeat: ''
    });
    let [errorState, setErrorState]  = useState({});

    function handleInputChange(e){
        let {name, value} = e.target;
        setFormValues({...formValues, [name]: value})
    }

    function clearFormValues(){
        setFormValues({
            email: '',
            password: '',
            passwordRepeat: ''
        });
    }

    async function signUpUser(){
        if (formValues.password != formValues.passwordRepeat) {
            console.log('passwords don\'t match')
            return false;
        }
        try{
            let result = await auth.signUpWithEmailAndPassword(formValues.email, formValues.password);
            updateAuth(result);
            return true;
        }
        catch (error){
            throw(error)
        }
    }
    
    return (
        <>
        <ErrorHandler error={errorState} />
        <form className="mx-10">
            <label>Email:</label>
            <Input type="text" name="email" value={formValues.email} onChange={handleInputChange}/>
            <label>Password:</label>
            <Input type="password" name="password" value={formValues.password} onChange={handleInputChange} />
            <label>Repeat Password:</label>
            <Input type="password" name="passwordRepeat" value={formValues.passwordRepeat} onChange={handleInputChange} />
            { formValues.password === formValues.passwordRepeat ?
            <></>
            :
            <p className="font-medium text-red-700">Passwords do not match</p>
            }
            <Button text="Sign Up" onClick={async(e) => {
                e.preventDefault();
                try{
                    let result = await signUpUser();
                    if(result){
                        router.push('/myProfile');
                    }
                }
                catch(error){
                    setErrorState(error);
                    clearFormValues();
                }
                }} addClassName="m-2" />
        </form>
        </>
    )
}

const GoogleSignUpButton = () => {
    let updateAuth = useAuthUpdate();
    let [errorState, setErrorState] = useState({});

    async function signUpUser(){
        try{
            let result = await auth.signupWithGoogle();
            updateAuth(result);
            return true;
        }catch(error){
            throw(error)
        }
        
    }

    return (
        <>
            <ErrorHandler error={errorState} />
            <div className="grid px-10 py-2">
            <Button text="Sign Up with Google" 
            onClick={async(e) => {
                e.preventDefault();
                try{
                    let result = await signUpUser();
                    if(result){
                        router.push('/myProfile');
                    }
                }
                catch(error){
                    // Sign the user out
                    await auth.signout();
                    setErrorState(error);
                }
                }} addClassName="self-center"/>
                </div>
        </>
    )
}

const SignUp = () => {
    return (
        <div className='bg-gray-200 p-2 w-full h-full'>
            <div className='w-full mx-auto max-w-md border-2 border-gray-400 rounded-md shadow-md'>
                <div className='p-2 divide-y divide-gray-700'></div>
                <EmailPasswordSignUp />
                <p className='text-center'>or</p>
                <GoogleSignUpButton />
            </div>
        </div>
    )
}

export default SignUp;