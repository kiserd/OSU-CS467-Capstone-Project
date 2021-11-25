// library
import { useState, useEffect } from 'react'
import Link from 'next/link'
// backend
import { readAllObjects } from '../backend/dao'
// component
import Button from '../components/Button'
import FilterButtons from '../components/FilterButtons'
import ProjectCard from '../components/ProjectCard'
import Search from '../components/Search'
// context
import { useAuth } from '../context/AuthContext'
// model
import { Projects } from '../models/Projects'
import { FilteredProject } from '../models/FilteredProject'
import { Project } from '../models/Project'
import { Technology } from '../models/Technology'

const browseProjects = () => {
    // array of projects that are currently visible to user
    const [projects, setProjects] = useState({visible: [], filtered: []})

    // array of all technologies
    const [allTechnologies, setAllTechnologies] = useState([])

    // helps to determine whether "clear search" button is visible
    const [isSearching, setIsSearching] = useState(false)

    useEffect(() => {
        // tracks whether component mounted, cleanup will assign false
        let isMounted = true
        // get projects and set state if component mounted
        readAllObjects('projects', true).then((projects) => {
            if (isMounted) setProjects(Projects.fromProjectArray(projects))
        })
        // get technologies and set state if component mounted
        readAllObjects('technologies').then((technologies) => {
            if (isMounted) setAllTechnologies(technologies)
        })
        // cleanup function to assign false to isMounted
        return function cleanup() {
            isMounted = false
        }
    }, [])

    const addFilter = (choice) => {
        /*
        DESCRIPTION:    moves projects lacking the provided technology from
                        visibleProjects to hiddenProjects and converts them
                        from Project objects to FilteredProject objects

        INPUT:          Technology object representing filter being added

        RETURN:         NA
        */
        // process Project arrays in Projects object
        projects.addFilter(choice)
        // create copy of state object
        const temp = Projects.fromExisting(projects)
        // set state based on work done above
        setProjects(temp);
    }

    const removeFilter = (choice) => {
        /*
        DESCRIPTION:    moves projects lacking the provided technology from
                        hiddenProjects to visibleProjects and converts them
                        from FilteredProject objects to Project objects

        INPUT:          Technology object representing filter being removed

        RETURN:         NA
        */
        // process Project arrays in Projects object
        projects.removeFilter(choice)
        // create copy of state object
        const temp = Projects.fromExisting(projects)
        // set state based on work done above
        setProjects(temp)
    }

    const onSearch = (searchFilter) => {
        /*
        DESCRIPTION:    instructs Projects object to filter the visible
                        projects field based on search filter provided

        INPUT:          searchFilter (string): search filter to apply to
                        visible projects

        RETURN:         NA
        */
        // process Project arrays in Projects object
        projects.onSearch(searchFilter)
        // create copy of state object
        const temp = Projects.fromExisting(projects)
        // set state based on work done above
        setProjects(temp)
        setIsSearching(true)
    }

    const clearSearch = () => {
        /*
        DESCRIPTION:    instructs Projects object to remove filter currently
                        applied to projects in filtered field

        INPUT:          NA

        RETURN:         NA
        */
        // process Project arrays in Projects object
        projects.clearSearch()
        // create copy of state object
        const temp = Projects.fromExisting(projects)
        // set state based on work done above
        setProjects(temp)
        setIsSearching(false)
    }

    return (
        <div className='background'>
            <div className='px-2 pb-1 pt-2'>
                <div className='w-full flex'>
                    <div className='flex flex-grow justify-center'>
                        {isSearching ? <Button text='Clear Search' onClick={clearSearch} type='btnWarning'/> : <Search onSearch={onSearch}/>}
                    </div>
                    <div className='flex justify-end'>
                        <Link href={'/newProject'} passHref>
                            <a>
                                <Button text='New Project' />
                            </a>
                        </Link> 
                    </div>
                </div>
            </div>
            <div className='grid grid-cols-3'>
                <div className='col-span-2'>
                    {projects.visible.map((project) => {
                        return (
                            <div key={project.id} className='p-2'>
                                <ProjectCard initialProject={project} />
                            </div>
                        )
                    })}
                </div>
                <div className='sticky top-4 m-2 p-2 col-span-1 h-auto max-h-80 defaultBorder bg-white shadow-2xl'>
                    <div className='text-xl font-medium text-center'>
                        Filters
                    </div>
                    <hr className='w-full border-b-2 border-custom-cool-extraDark'/>
                    <FilterButtons
                    category='Technologies'
                    choices={allTechnologies}
                    onAdd={addFilter}
                    onRemove={removeFilter}
                    />
                </div>
            </div>
        </div>
    )
}

export default browseProjects
