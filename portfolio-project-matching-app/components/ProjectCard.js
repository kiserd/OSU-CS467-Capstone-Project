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
                    return (
                        <div key={technology.id} className='py-1 pr-2'>
                            <Button text={technology.name}/>
                        </div>
                )
                })}
            </div>
            <div className=''>
                <p>{project.description}</p>
            </div>
            <div className='mt-4'>
                <p>{project.census} out of {project.capacity} ({project.capacity - project.census} positions left)</p>
            </div>
            <div className='flex flex-wrap'>
                {project.users.map((user) => {
                    return (
                    <div key={user.id} className='py-1 pr-2'>
                        <UserIcon imgPath='/../public/user.ico' username={user.username} />
                    </div>
                    )
                })}
                <div className='p-1'>
                    <Button text='join' type='btnGeneral' />
                </div>
            </div>
            <div className='inline'>
                <h3 className='py-1 inline'>{project.likes} Likes</h3>
                <div className='p-1 inline'>
                    <Button text='Like' onClick={likeProject} type='btnGeneral' />
                </div>
            </div>
        </div>
    )
}

export default ProjectCard
