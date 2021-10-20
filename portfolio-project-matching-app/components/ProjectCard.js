import Button from '../components/Button'
import UserIcon from '../components/UserIcon'
import { doc } from '@firebase/firestore'

const ProjectCard = ({ project }) => {
    const applyToProject = async (e) => {
        // todo
    }

    const likeProject = async (e) => {
        // todo
    }
    return (
        <div className='p-2 w-full h-full border-2 border-gray-400 rounded-md'>
            <div className='w-full ml-2'>
                <p className='text-xl font-medium'>{project.name}</p>
            </div>
            <hr className='w-11/12 sm:w-9/12 ml-2 border-b-2 border-gray-400'/>
            <div className='flex flex-wrap'>
                {project.technologies.map((technology) => {
                    return <Button key={technology.id} text={technology.name}/>
                })}
            </div>
            <div className='ml-2'>
                <p>{project.description}</p>
            </div>
            <div className='mt-4 ml-2'>
                <p>{project.census} out of {project.capacity} ({project.capacity - project.census} positions left)</p>
            </div>
            <div className='flex flex-wrap'>
                {project.users.map((user) => {
                    return (
                    <div key={user.id} className='p-1'>
                        <UserIcon imgPath='/../public/user.ico' username={user.username} />
                    </div>
                    )
                })}
                <div className='p-1'>
                    <Button text='join' type='btnGeneral' />
                </div>
            </div>
            <div className='inline ml-2'>
                <h3 className='inline'>{project.likes} Likes</h3>
                <Button text='Like' onClick={likeProject} type='btnGeneral' />
            </div>
        </div>
    )
}

export default ProjectCard
