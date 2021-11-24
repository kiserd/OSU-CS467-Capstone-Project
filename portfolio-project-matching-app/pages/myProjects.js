// library
import { useState, useEffect } from 'react'
// backend
import { readAssociationObjectsByType } from '../backend/dao.js'
// component
import ProjectCard from '../components/ProjectCard'
// context
import { useAuth } from '../context/AuthContext'

const myProjects = () => {
    // array of projects associated with user
    const [projects, setProjects] = useState([])

    let authUser = useAuth()

    useEffect(() => {
        // tracks whether component mounted, cleanup will assign false
        let isMounted = true
        // handle case where user is NOT logged in
        // let authUser = useAuth()
        if (!authUser.user) {
            alert('must be logged in to view this page')
        }
        // handle case where user is logged in
        else {
            // get projects and set state if component mounted
            readAssociationObjectsByType('projects_users', 'user_id', authUser.user.id, 'projects', 'project_id', true).then((projects) => {
                if (isMounted) setProjects(projects)
            })
        }
        // cleanup function to assign false to isMounted
        return function cleanup() {
            isMounted = false
        }
    }, [])

    return (
        <div className='background'>
            {authUser.user ? 
            projects.map((project) => {
                return (
                    <div key={project.id} className='p-2'>
                        <ProjectCard initialProject={project} />
                    </div>
                )
            })
            :
            <div>must be logged in</div>
            }
        </div>
    )
}

export default myProjects
