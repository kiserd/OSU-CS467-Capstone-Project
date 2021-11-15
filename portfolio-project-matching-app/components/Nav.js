import { useRouter } from 'next/router'
import Link from 'next/link'
import Button from './Button'
import styles from './Nav.module.css'
import { useEffect, useState } from 'react'
import { useAuth } from '../context/AuthContext'
import auth from '../Firebase/auth'
// import tailwind from 'tailwind/tailwindcss.css'

const Nav = () => {
    let router = useRouter();
    const [path, setPath] = useState('');
    let authUser = useAuth();
    useEffect(
        () => {
            setPath(router.pathname);
        }
    )
    return (
        <nav className={styles.navWarm}>
            <ul className="grid grid-cols-3">
                <li className="col-start-2 justify-self-center m-2">
                    <Link href="/">
                        <a className="col-start-2 font-medium text-3xl  text-gray-900">Project Finder</a>
                    </Link>
                </li>
                <li className="justify-self-end">
                    {   path === "/myProfile" ?
                        <Link href="/browseProjects" passHref>
                            {/* Link's child must take an href, so Button must be wrapped with <a> tags */}
                            <a>
                            <Button text="Browse" isLink={true} addClassName="bg-white m-2"/>
                            </a>
                        </Link>
                        : authUser.user ?
                        <Link href="/myProfile" passHref>
                            <a>
                            <Button text="Profile" isLink={true} addClassName="bg-white m-2"/>
                            </a>
                        </Link>
                        :
                        <div>
                            <Link href="/signUp" passHref>
                                <a>
                                    <Button text="Sign Up" isLink={true} addClassName="bg-white m-2"/>
                                </a>
                            </Link>
                            <Link href="/myProfile" passHref>
                                <a>
                                <Button text="Sign In" isLink={true} addClassName="bg-white m-2"/>
                                </a>
                            </Link>
                        </div>
                    }
                </li>
            </ul>
        </nav>
    )
}

export default Nav
