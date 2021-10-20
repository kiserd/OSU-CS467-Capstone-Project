import { useState } from 'react'
import FilterButtons from '../components/FilterButtons'
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

    const technologies = [
        {id: 1, name: 'Javascript'}, {id: 2, name: 'C++'}, {id: 3, name: 'React'}, {id: 4, name: 'Flutter'}
    ]
    return (
        <div>
            <div className='p-2 bg-custom-warm-med'>
                Search Bar and Add Project
            </div>
            <div className='p-2 grid grid-cols-3'>
                <div className='p-2 col-span-2'>
                    {projects.map((project) => {
                        return <ProjectCard project={project} />
                    })}
                </div>
                <div className='m-2 p-2 col-span-1 border-2 border-gray-400 rounded-md'>
                    <div className='text-xl font-medium text-center'>
                        Filters
                    </div>
                    <hr className='w-full border-b-2 border-gray-400'/>
                    <FilterButtons category='Technologies' choices={technologies} />
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
