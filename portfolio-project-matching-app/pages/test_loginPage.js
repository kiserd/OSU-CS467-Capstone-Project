import Login from '../components/Login'
import Signup from '../components/Signup'

const test_loginPage = () => {
    return (
        <div className='m-12 max-w-xs'>
            <div className='m-4'>
                <Login />
            </div>
            <div className='m-4'>
                <Signup />
            </div>
        </div>
    )
}

export default test_loginPage
