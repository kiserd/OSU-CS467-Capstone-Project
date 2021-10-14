import Image from 'next/image'

const UserIcon = ({ username, imgPath }) => {
    return (
        <div className='grid grid-cols-4 w-36 h-10 object-center box-border border-2 border-solid border-gray-400 rounded-lg'>
            <div className='col-span-1 justify-self-center self-center'>
                <div className='flex justify-self-center self-center'>
                    <Image src={imgPath} width='30' height='30' />
                </div>
            </div>
            <div className='col-start-2 col-span-3 justify-self-center self-center'>
                {username}
            </div>
        </div>
    )
}

export default UserIcon
