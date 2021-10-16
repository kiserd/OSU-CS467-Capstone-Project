import Link from 'next/link'
import Button from './Button'
import styles from './Nav.module.css'
// import tailwind from 'tailwind/tailwindcss.css'

const Nav = () => {
    return (
        <div>
        <nav className={styles.nav}>
            <ul className="grid grid-cols-3">
                <li className="col-start-2">
                    <Link href="/">
                        <a class="col-start-2 justify-self-center font-medium text-3xl  text-gray-900">Project Finder</a>
                    </Link>
                </li>
                <li className="justify-self-end">
                    <Link href="/myProfile">
                        <Button text="Profile"/>
                    </Link>
                </li>
            </ul>
        </nav>
        <Button text="hi"/>
        </div>
    )
}

export default Nav
