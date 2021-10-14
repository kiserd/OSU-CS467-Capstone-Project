import styles from '../styles/ProjectCard.module.css'
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
            <div className='w-full'>
                <p className='text-xl font-medium'>{project.name}</p>
            </div>
            <hr className='w-11/12 sm:w-9/12 border-b-2 border-gray-400'/>
            <div className='flex flex-wrap'>
                {project.technologies.map((technology) => {
                    return <Button key={technology.id} text={technology.name}/>
                })}
            </div>
            <div>
                <p>{project.description}</p>
            </div>
            <div className='mt-4'>
                <p>{project.census} out of {project.capacity} ({project.capacity - project.census} positions left)</p>
            </div>
            <div className='flex flex-wrap'>
                {project.users.map((user) => {
                    return <UserIcon key={user.id} imgPath='/../public/user.ico' username={user.username} />
                })}
                <Button text='join' type='btnGeneral' />
            </div>
            <div className='inline'>
                <h3 className='inline'>{project.likes} Likes</h3>
                <Button text='Like' onClick={likeProject} type='btnGeneral' />
            </div>
        </div>
    )
}

export default ProjectCard
