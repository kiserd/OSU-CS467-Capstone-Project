import { useState } from 'react'
import Button from '../components/Button'
import Input from '../components/Input'
import InputDropDown from '../components/InputDropdown'

const Signup = ({ toggleNewUser }) => {
    // typically we would want to pull this from the DB
    // todo
    const timezones = [
        {id: 1, name: 'Pacific'},
        {id: 2, name: 'Central'},
        {id: 3, name: 'Eastern'}
    ]

    // declare a new state variable to manage form input values
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [timezone, setTimezone] = useState('')
    const [password, setPassword] = useState('')
    const [passwordRepeat, setPasswordRepeat] = useState('')

    // declare state variable to indicate passwords match
    const [passwordsMatch, setPasswordsMatch] = useState(true)
    
    const createUser = (e) => {
        // prevent page from reloading
        e.preventDefault()
        
        // handle case where passwords do not match
        if (!isMatching(password, passwordRepeat)) {
            setPasswordsMatch(false)
        }
        else {
            // toggle passwordsMatch if necessary
            !passwordsMatch && setPasswordsMatch(true)
            
            // stage everything in an object to fire off to the DB
            // todo
            console.log('email:', email)
            console.log('password', password)


            // reset state
            setEmail('')
            setUsername('')
            setTimezone('')
            setPassword('')
            setPasswordRepeat('')
        }


        
    }

    // helper function to determine if password meets length requirement
    const isLengthValid = (password) => password.length > 8;

    // helper function to determine if passwords match
    const isMatching = (password, passwordRepeat) => password === passwordRepeat;


    return (
        <div className='w-max p-2 border-2 border-gray-400 rounded-md'>
            <div className='text-2xl text-md'>
                Create Account
            </div>
            <div className='text-sm text-gray-400'>
                Please create account to continue
            </div>
            <div className='mt-4'>
                <label className=''>
                    Email
                </label>
                <Input type='email' name='email' placeholder='email' value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className=''>
                <label className=''>
                    Username
                </label>
                <Input type='text' name='username' placeholder='username' value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
            <div className=''>
                <label className=''>
                    Timezone
                </label>
                <InputDropDown name='timezone' choices={timezones} value={timezone} onChange={(e) => setTimezone(e.target.value)}/>
            </div>
            <div className=''>
                <label className=''>
                    Password
                </label>
                <Input type='password' name='password' placeholder='password' value={password} onChange={(e) => setPassword(e.target.value)} />
                <Input type='password' name='passwordRepeat' placeholder='repeat password' value={passwordRepeat} onChange={(e) => setPasswordRepeat(e.target.value)} />
                {!passwordsMatch && <p className='text-sm text-custom-warm-dark'>Passwords must match</p>}
            </div>
            <div>
                <Button type='btnGeneral' text='Login' onClick={createUser} />
            </div>
            <div className='mt-12 text-center text-sm'>
                Already have an account?&nbsp;
                <button className='text-blue-800 font-bold' onClick={toggleNewUser}>
                    Login
                </button>
            </div>
        </div>
    )
}

export default Signup