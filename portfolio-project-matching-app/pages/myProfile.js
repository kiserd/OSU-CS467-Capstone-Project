// library
import Link from 'next/link'
// components
import Button from '../components/Button'
import ProfileForm from '../components/ProfileForm'

const myProfile = () => {
        
        return (
            <div classname='background'>
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
                <ProfileForm />
            </div>
    )
}

export default myProfile;