import { useState } from 'react'
// components
import Button from '../components/Button'
import FilterButtons from '../components/FilterButtons'
import ProjectCard from '../components/ProjectCard'
import Search from '../components/Search'

const browseProjects = () => {
    const projects = [
        {
            name: 'Wastegram',
            description: 'Tracks amount of food wasted by local businesses at the end of each day. Allows user to post photos, geoLocation, quantity describing the waste',
            capacity: 4,
            census: 3,
            open: true,
            likes: 22,
            owner: {username: 'ylijokic'},
            technologies: [{id: 1, name: 'Javascript'}, {id: 2, name: 'C++'}, {id: 3, name: 'React'}, {id: 4, name: 'Flutter'}],
            users: [{id: 1, username: 'kiserlams'}, {id: 2, username: 'ylijokic'}, {id: 3, username: 'kaiserjo'}]
        },
        {
            name: 'Bet With Friends',
            description: 'Allows users to place friendly wagers against each other. The application does the heavy lifting in calculating payouts, binding users to terms of agreement, and providing updates on the state of the wager. Users can choose from a complex catalog of wager and event types. In the event of a user failing to settle a loss (or roll loss into new wager), the local authorities are automatically contacted.',
            capacity: 3,
            census: 2,
            open: true,
            likes: 144,
            owner: {username: 'ylijokic'},
            technologies: [{id: 1, name: 'C'}, {id: 2, name: 'Python'}, {id: 3, name: 'CSS'}, {id: 4, name: 'Golang'}],
            users: [{id: 1, username: 'kiserlams'}, {id: 2, username: 'ylijokic'}, {id: 3, username: 'kaiserjo'}]
        },
    ]

    const technologies = [{id: 1, name: 'Javascript'}, {id: 2, name: 'C++'}, {id: 3, name: 'React'}, {id: 4, name: 'Flutter'}]

    // array of projects that are currently visible to user
    const [visibleProjects, setVisibleProjects] = useState(projects)

    // array of projects being hidden by filters
    const [hiddenProjects, setHiddenProjects] = useState([])

    return (
        <div>
            <div className='p-2 bg-custom-warm-light'>
                <div className='w-full flex'>
                    <div className='flex justify-start'>
                        <Search />
                    </div>
                    <div className='flex flex-grow justify-end'>
                        <Button text='New Project' />
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-3'>
                <div className='col-span-2'>
                    {projects.map((project) => {
                        return (
                            <div className='p-2'>
                                <ProjectCard project={project} />
                            </div>
                        )
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
