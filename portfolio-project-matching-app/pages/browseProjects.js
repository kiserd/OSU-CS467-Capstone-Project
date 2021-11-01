// library
import { useState, useEffect } from 'react'
// backend
import { getAllProjects, getAllTechnologies } from '../backend/dao'
// component
import Button from '../components/Button'
import FilterButtons from '../components/FilterButtons'
import ProjectCard from '../components/ProjectCard'
import Search from '../components/Search'
// model
import { Project } from '../models/Project'
import { Technology } from '../models/Technology'

const browseProjects = () => {
    // array of projects that are currently visible to user
    const [visibleProjects, setVisibleProjects] = useState([])

    // array of projects being hidden by filters
    const [hiddenProjects, setHiddenProjects] = useState([])

    // array of all technologies
    const [allTechnologies, setAllTechnologies] = useState([])

    // array of visible technology
    const [visibleTechnologies, setVisibleTechnologies] = useState([])

    // array of hidden technology objects
    const [hiddenTechnologies, setHiddenTechnologies] = useState([])

    const initializeProjects = async () => {
        const projects = await getAllProjects()
        setVisibleProjects(projects)
    }

    const initializeTechnologies = async () => {
        const technologies = await getAllTechnologies()
        setAllTechnologies(technologies)
    }

    const onFilterClick = (choice) => {
        // this should most likely be handled by FilterButtons
        // hand work off to other functions based on whether add/remove
        hiddenTechnologies.includes(choice) ? removeFilter(choice) : addFilter(choice)
    }

    const addFilter = (choice) => {
        // helper arrays to harbor projects during staging
        const newHidden = hiddenProjects
        let newVisible = visibleProjects

        // loop through hidden projects and potentially add additional filter
        for (const project of hiddenProjects) {
            if (!project.project.hasTechnology(choice.id)) {
                project.filters.push(choice)
            }
        }

        // loop through visible projects and determine whether they need hidden
        for (const project of visibleProjects) {
            if (!project.hasTechnology(choice.id)) {
                // create map to keep track of filters that are applied
                newHidden.push({project: project, filters: [choice]})
                newVisible = newVisible.filter((element) => element.id != project.id)
            }
        }
        // set state based on work done above
        setVisibleProjects(newVisible)
        setHiddenProjects(newHidden)
        setVisibleTechnologies(visibleTechnologies.filter((element) => element.id === choice.id))
        setHiddenTechnologies([...hiddenTechnologies, choice])
    }

    const removeFilter = (choice) => {
        // helper arrays to harbor projects during staging
        let newHidden = hiddenProjects
        const newVisible = visibleProjects

        // loop through hidden projects to see if they need moved to visible
        for (const project of hiddenProjects) {
            for (const technology of project.filters) {
                // remove filter choice from filters tracking property if necessary
                if (technology.id === choice.id) {
                    project.filters = project.filters.filter((element) => element.id != choice.id)
                }
                // if last remaining filter removed, move project to visible
                if (project.filters.length === 0) {
                    newVisible.push(project.project)
                    newHidden = hiddenProjects.filter((element) => element.id === choice.id)
                }
            }
        }
        // set state based on work done above
        setVisibleProjects(newVisible)
        setHiddenProjects(newHidden)
        setVisibleTechnologies([...visibleTechnologies, choice])
        setHiddenTechnologies(hiddenTechnologies.filter((element) => element.id != choice.id))
    }

    useEffect(() => {
        initializeProjects()
        initializeTechnologies()
    }, [])

    // const technologies = [{id: 1, name: 'Javascript'}, {id: 2, name: 'C++'}, {id: 3, name: 'React'}, {id: 4, name: 'Flutter'}]


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
                    <FilterButtons category='Technologies' choices={allTechnologies} onClick={onFilterClick}/>
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
