import Image from 'next/image'

const UserIcon = ({ username, imgPath }) => {
    return (
        <div className='m-2 inline-block p-1 box-border border-2 border-solid border-gray-400 rounded-lg'>
            <span className='align-middle'>
                <span className=''>
                    <Image src={imgPath} width='30' height='30' />
                </span>
            </span>
            <span className='align-middle px-1'>
                {username}
            </span>
        </div>
    )
}

export default UserIcon
