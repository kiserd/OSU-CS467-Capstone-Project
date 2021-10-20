import { useState } from 'react'
import ProjectCard from '../components/ProjectCard'

const browseProjects = () => {
    const projects = [
        {
            name: 'Wastegram',
            description: 'Tracks amount of food wasted by local businesses at the end of each day. Allows user to post photos, geoLocation, quantity describing the waste',
            capacity: 4,
            census: 1,
            open: true,
            likes: 22,
            owner: 1,
            owner: {username: 'ylijokic'},
            technologies: [{id: 1, name: 'Javascript'}, {id: 2, name: 'C++'}, {id: 3, name: 'React'}, {id: 4, name: 'Flutter'}],
            users: [{id: 1, username: 'kiserlams'}, {id: 2, username: 'ylijokic'}, {id: 3, username: 'kaiserjo'}]
        },
    ]
    return (
        <div>
            <span className=''>Search Bar and Add Project</span>
            <div className='grid grid-cols-3'>
                <div className='p-2 col-span-2 bg-custom-warm-light'>
                    {projects.map((project) => {
                        return <ProjectCard project={project} />
                    })}
                </div>
                <div className='p-2 col-span-1 bg-custom-cool-light'>
                    filters
                </div>
            </div>
        </div>
    )
}

// yanked from https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
// export async function getServerSideProps(context) {
//   const projectList = await getAllDocs('projects')
//   return {
    
//     // will be passed to the page component as props
//     props: {
//       projectList,
//     },
//   }
// }

export default browseProjects
