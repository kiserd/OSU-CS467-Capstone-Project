import Link from 'next/link'
// import tailwind from 'tailwind/tailwindcss.css'

const Nav = () => {
    return (
        <nav className="mySillyStyle">
            <ul className="flex">
                <li className="mr-6">
                    <Link href='/' >
                        <a className="text-white text-lg hover:text-blue-100">Home</a>
                    </Link>
                </li>
                <li className="mr-6">
                    <Link href='/sillyPage' >
                        <a className="text-white text-lg hover:text-blue-100">sillyPage</a>
                    </Link>
                </li>
            </ul>
        </nav>
    )
}

export default Nav
