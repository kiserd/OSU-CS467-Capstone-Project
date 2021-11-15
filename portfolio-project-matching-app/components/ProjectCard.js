// library
import Link from 'next/link'

import styles from './ProjectCard.module.css'

import { useState, useEffect } from 'react'
// backend
import { createAssociation, getProjectById } from '../backend/dao.js'
// component
import Button from '../components/Button'
// import UserIcon from '../components/UserIcon'
// context
import { useAuth } from '../context/AuthContext'


const ProjectCard = ({ project }) => {
    // get auth'd user
    let authUser = useAuth()

    // state to display changes to project
    // we will end up removing this if we switch to a traditional application 
    // type deal for joining projects because the user wouldn't immediately
    // be added to the project. Just doing this to make it re-render
    const [projectToUse, setProjectToUse] = useState(project)

    const applyToProject = async (e) => {
        // prevent page refresh on submit
        e.preventDefault();
        // handle case where user is not logged in
        if (!authUser.user) {
            console.log(`Please signup/login to join project`)
            alert(`Please signup/login to join project`)
        }
        // handle case where user is logged in
        else {
            const docSnap = await createAssociation('projects_users', project.id, authUser.user.id)
            // handle case where user is already added to project
            if (docSnap === -1) {
                alert(`You have already joined that project`)
            }
            // handle case where user is added to project
            else {
                setProjectToUse(await getProjectById(project.id))
            }
        }
    }

    const likeProject = async (e) => {
        // todo
    }

    return (
        <div className={styles.project}>
            <div className='w-full'>
                <p className='text-xl font-medium'>{projectToUse.name}</p>
            </div>
            <hr className='w-11/12 sm:w-9/12 border-b-2 border-custom-cool-extraDark'/>
            <div className='flex flex-wrap'>
                {projectToUse.technologies.map((technology) => {
                    return (
                        <div key={technology.id} className='py-1 pr-2'>
                            <Button text={technology.name}/>
                        </div>
                )
                })}
            </div>
            <div className=''>
                <p className='line-clamp-3 lg:line-clamp-2 xl:line-clamp-1'>
                    {projectToUse.description}
                </p>
            </div>
            <div className='mt-2 flex flex-wrap'>
                <div className='self-center'>
                    {projectToUse.census} out of {projectToUse.capacity} ({projectToUse.capacity - projectToUse.census} positions left)
                    </div>
                <div className='p-1'>
                    <Button text='join' onClick={applyToProject} type='btnGeneral' />
                </div>
            </div>
            <div className='flex flex-wrap'>
                {/* Commented out, but leaving in just in case we decide to add this back */}
                {/* {project.users.map((user) => {
                    return (
                    <div key={user.id} className='py-1 pr-2'>
                        <UserIcon imgPath='/../public/user.ico' username={user.username} />
                    </div>
                    )
                })} */}
            </div>
            <div className='inline'>
                <h3 className='py-1 inline'>{projectToUse.likes} Likes</h3>
                <div className='p-1 inline'>
                    <Button text='Like' onClick={likeProject} type='btnGeneral' />
                </div>
            </div>
            <Link href={`/project?id=${projectToUse.id}`} passHref>
                <a>
                    <Button text="View More Info" type='btnPurple' addClassName='block mt-2'/>
                </a>
            </Link>
        </div>
    )
}

export default ProjectCard
