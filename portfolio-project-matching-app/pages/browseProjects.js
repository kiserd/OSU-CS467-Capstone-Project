// library
import { useState, useEffect } from 'react'
import Link from 'next/link'
// backend
import { getAllProjects, getAllTechnologies } from '../backend/dao'
// component
import Button from '../components/Button'
import FilterButtons from '../components/FilterButtons'
import ProjectCard from '../components/ProjectCard'
import Search from '../components/Search'
// model
import { FilteredProject } from '../models/FilteredProject'
import { Project } from '../models/Project'
import { Technology } from '../models/Technology'

const browseProjects = () => {
    // array of projects that are currently visible to user
    const [visibleProjects, setVisibleProjects] = useState([])

    // array of projects being hidden by filters
    const [hiddenProjects, setHiddenProjects] = useState([])

    // array of all technologies
    const [allTechnologies, setAllTechnologies] = useState([])

    const [isSearching, setIsSearching] = useState(false)

    useEffect(() => {
        initializeProjects()
        initializeTechnologies()
    }, [])

    const initializeProjects = async () => {
        const projects = await getAllProjects()
        setVisibleProjects(projects)
    }

    const initializeTechnologies = async () => {
        const technologies = await getAllTechnologies()
        setAllTechnologies(technologies)
    }

    const addFilter = (choice) => {
        /*
        DESCRIPTION:    moves projects lacking the provided technology from
                        visibleProjects to hiddenProjects and converts them
                        from Project objects to FilteredProject objects

        INPUT:          Technology object representing filter being added

        RETURN:         NA
        */
        // helper arrays to harbor projects during staging
        const newHidden = hiddenProjects
        let newVisible = visibleProjects

        // loop through hidden projects and potentially add additional filter
        for (const project of hiddenProjects) {
            project.addFilter(choice)
        }

        // loop through visible projects and determine whether they need hidden
        for (const project of visibleProjects) {
            if (!project.hasTechnology(choice.id)) {
                // create FilteredProject to add to hiddenProjects list
                const filteredProject = new FilteredProject(project, choice)
                newHidden.push(filteredProject)
                newVisible = newVisible.filter((element) => {
                    return element.id !== project.id
                })
            }
        }
        // set state based on work done above
        setVisibleProjects(newVisible)
        setHiddenProjects(newHidden)
    }

    const removeFilter = (choice) => {
        /*
        DESCRIPTION:    moves projects lacking the provided technology from
                        hiddenProjects to visibleProjects and converts them
                        from FilteredProject objects to Project objects

        INPUT:          Technology object representing filter being removed

        RETURN:         NA
        */
        // helper arrays to harbor projects during staging
        let newHidden = hiddenProjects
        const newVisible = visibleProjects

        // loop through hidden projects to see if they need moved to visible
        for (const project of hiddenProjects) {
            // remove filter if applicable
            project.removeFilter(choice)
            // if last remaining filter removed, move project to visible
            if (project.filtersIsEmpty()) {
                newVisible.push(project.project)
                newHidden = newHidden.filter((element) => {
                    return element.project.id !== project.project.id
                })
            }
        }
        // set state based on work done above
        setVisibleProjects(newVisible)
        setHiddenProjects(newHidden)
    }

    const onSearch = (searchFilter) => {
        const updatedProjects = visibleProjects.filter((project) => {
            return project.name.includes(searchFilter)
        })
        setVisibleProjects(updatedProjects)
        setIsSearching(true)
    }

    const clearSearch = () => {
        initializeProjects()
        setIsSearching(false)
    }

    return (
        <div>
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
