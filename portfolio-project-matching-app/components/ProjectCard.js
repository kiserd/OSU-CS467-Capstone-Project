// library
import Link from 'next/link'

import styles from './ProjectCard.module.css'

import { useState, useEffect } from 'react'
// backend
import {
    createAssociation,
    createApplication,
    createDocWithId,
    createNewLike,
    deleteLike,
    getProjectById,
    readAssociationById
} from '../backend/dao.js'
// component
import Button from '../components/Button'
// import UserIcon from '../components/UserIcon'
// context
import { useAuth } from '../context/AuthContext'


const ProjectCard = ({ initialProject }) => {
    // get auth'd user
    let authUser = useAuth()

    // indicates whether current user has liked the project
    const [hasLiked, setHasLiked] = useState(false)

    // harbors updated project (helps with like function)
    const [project, setProject] = useState(initialProject)

    useEffect(() => {
        // handle case where user is logged in
        if (authUser.user) {
            // get like doc snapshot and set hasLiked accordingly
            readAssociationById('likes', `${project.id}_${authUser.user.id}`)
            .then((likeSnap) => {if (likeSnap !== -1) setHasLiked(true)})
        }
    })

    const applyToProject = async (e) => {
        /*
        DESCRIPTION:    creates appropriate application document

        INPUT:          e (event)

        RETURN:         NA
        */
        // prevent page refresh on submit
        e.preventDefault();
        // handle case where user is not logged in
        if (!authUser.user) {
            console.log(`Please signup/login to join project`)
            alert(`Please signup/login to join project`)
        }
        // handle case where user is logged in
        else {
            const docSnap = await createApplication(project.id, authUser.user.id)
            // handle case where user is already added to project
            if (docSnap === -1) {
                alert(`Error creating application`)
            }
            // raise alert to indicate successful application
            alert(`Application '${docSnap.id}' created successfully. See application in My Profile -> My Applications`)
        }
    }

    const likeProject = async () => {
        /*
        DESCRIPTION:    creates like document associating project and current
                        user

        INPUT:          NA

        RETURN:         NA
        */
        // handle case where user is NOT logged in
        if (!authUser.user) {
            alert(`You must be logged in to like a project`)
            // todo, potentially route user to login page
        }
        // handle case where user is logged in
        else {
            // attempt create new like
            const likeSnap = await createNewLike(`${project.id}`, `${authUser.user.id}`)
            // handle case of successful createNewLike()
            if (likeSnap !== -1) setHasLiked(true)
            // get updated project and set state
            const updatedProject = await getProjectById(project.id)
            setProject(updatedProject)
        }
    }

    const dislikeProject = async () => {
        /*
        DESCRIPTION:    deletes like document associating user and project

        INPUT:          NA

        RETURN:         NA
        */
        // handle case where user is NOT logged in
        if (!authUser.user) {
            alert(`You must be logged in to dislike a project`)
            // todo, potentially route user to login page
        }
        // handle case where user is logged in
        else {
            // attempt to delete like
            const likeRef = await deleteLike(`${project.id}`, `${authUser.user.id}`)
            // handle case of successful deleteLike()
            if (likeRef !== -1) setHasLiked(false)
            // get updated project and set state
            const updatedProject = await getProjectById(project.id)
            setProject(updatedProject)
        }
    }

    return (
        <div className={styles.project}>
            <div className='w-full'>
                <p className='text-xl font-medium'>{project.name}</p>
            </div>
            <hr className='w-11/12 sm:w-9/12 border-b-2 border-custom-cool-extraDark'/>
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
                <p className='line-clamp-3 lg:line-clamp-2 xl:line-clamp-1'>
                    {project.description}
                </p>
            </div>
            <div className='mt-2 flex flex-wrap'>
                <div className='self-center'>
                    {project.census} out of {project.capacity} ({project.capacity - project.census} positions left)
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
                <h3 className='py-1 inline'>{project.likes} Likes</h3>
                <div className='p-1 inline'>
                    <Button text={hasLiked ? 'Dislike' : 'Like'} onClick={hasLiked ? dislikeProject : likeProject} type={hasLiked ? 'btnWarning' : 'btnGeneral'} />
                </div>
            </div>
            <Link href={`/project?id=${project.id}`} passHref>
                <a>
                    <Button text="View More Info" type='btnPurple' addClassName='block mt-2'/>
                </a>
            </Link>
        </div>
    )
}

export default ProjectCard
