import Button from '../components/Button'
import Input from '../components/Input'

const Login = ({ toggleNewUser }) => {
    const loginUser = (e) => {
        // todo
    }

    return (
        <div className='w-full py-2 px-4 border-2 border-gray-400 rounded-md'>
            <div className='mx-2 text-2xl text-md'>
                Login
            </div>
            <div className='mx-2 text-sm text-gray-400'>
                Please login to continue
            </div>
            <div className='mt-4'>
                <label className='mx-2'>
                    Email
                </label>
                <Input type='email' name='email' placeholder='email' />
            </div>
            <div className=''>
                <label className='mx-2'>
                    Password
                </label>
                <Input type='password' name='password' placeholder='password' />
            </div>
            <div>
                <Button type='btnGeneral' text='Login' onClick={loginUser} />
            </div>
            <div className='mt-12 text-center text-sm'>
                Don't have an account?&nbsp;
                <button className='text-blue-800 font-bold' onClick={toggleNewUser}>
                    Sign Up
                </button>
            </div>
        </div>
    )
}

export default Login
