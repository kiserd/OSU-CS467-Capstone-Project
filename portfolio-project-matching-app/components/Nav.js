import Link from 'next/link'
// import tailwind from 'tailwind/tailwindcss.css'

const Nav = () => {
    return (
        <ul className="flex">
            <li className="mr-6">
                <Link href='/' >
                    <a className="text-blue-500 hover:text-blue-800">Home</a>
                </Link>
            </li>
            <li className="mr-6">
                <Link href='/sillyPage' >
                    <a className="text-blue-500 hover:text-blue-800">sillyPage</a>
                </Link>
            </li>
        </ul>
    )
}

export default Nav
