// library
import { useState, useEffect } from 'react'
// backend
import { getAllProjects } from '../backend/dao'
// component
import Button from '../components/Button'
import FilterButtons from '../components/FilterButtons'
import ProjectCard from '../components/ProjectCard'
import Search from '../components/Search'
// model
import { Project } from '../models/Project'

const browseProjects = () => {
    // array of projects that are currently visible to user
    const [visibleProjects, setVisibleProjects] = useState([])

    // array of projects being hidden by filters
    const [hiddenProjects, setHiddenProjects] = useState([])

    // array of technology filter maps
    const [technologyFilters, setTechnologyFilters] = useState([])

    const initializeState = async () => {
        const projects = await getAllProjects()
        setVisibleProjects(projects)
        // loop through projects, adding distinct technologies to state
        for (const project of projects) {
            for (const technology of project.technologies) {
                console.log(technology.id)
                const techFiltersArr = technologyFilters.map((elt) => elt.id)
                console.log(techFiltersArr)
                console.log(!techFiltersArr.includes(technology.id))
                if (!techFiltersArr.includes(technology.id)) {
                    technology.visible = true
                    console.log(technology)
                    setTechnologyFilters([...technologyFilters, technology])
                    console.log(technologyFilters)
                }
            }
        }
    }

    useEffect(() => {
        initializeState();
    }, [])

    const technologies = [{id: 1, name: 'Javascript'}, {id: 2, name: 'C++'}, {id: 3, name: 'React'}, {id: 4, name: 'Flutter'}]


    return (
        <div>
            <div className='px-2 pb-1 pt-2'>
                <div className='w-full flex'>
                    <div className='flex flex-grow justify-center'>
                        <Search />
                    </div>
                    <div className='flex justify-end'>
                        <Button text='New Project' />
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-3'>
                <div className='col-span-2'>
                    {visibleProjects.map((project) => {
                        return (
                            <div key={project.id} className='p-2'>
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
//   const projects = await getAllProjects()
//   return {
    
//     // will be passed to the page component as props
//     props: {
//       projects,
//     },
//   }
// }

export default browseProjects
