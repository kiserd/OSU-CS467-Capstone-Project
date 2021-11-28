// library
import Link from 'next/link'
// components
import Button from '../components/Button'
import ProfileForm from '../components/ProfileForm'
// context
import { useAuth } from '../context/AuthContext'

const myProfile = () => {
    // get logged in user
    let authUser = useAuth()
        
        return (
            <div className='background'>
                {
                // handle case of no logged in user
                !authUser.user ?
                <div></div>
                // handle case of user logged in
                :
                <div>
                    <Link href="/myProjects" passHref>
                        {/* Link's child must take an href, so Button must be wrapped with <a> tags */}
                        <a>
                        <Button text="My Projects" isLink={true} addClassName="bg-white m-2"/>
                        </a>
                    </Link>
                    <Link href="/myApplications" passHref>
                        {/* Link's child must take an href, so Button must be wrapped with <a> tags */}
                        <a>
                        <Button text="My Applications" isLink={true} addClassName="bg-white m-2"/>
                        </a>
                    </Link>
                </div>
                }
                <ProfileForm />
            </div>
    )
}

export default myProfile;