// library
import { useState, useEffect } from 'react'
// backend
import { readApplicationsById, readApplicationIdsById, readDocIdsByCriteria, readDocsByCriteria } from '../backend/dao.js';
// component
import ApplicationCard from '../components/ApplicationCard'
import Button from '../components/Button'
import FilterButtons from '../components/FilterButtons.js';
// context
import { useAuth } from '../context/AuthContext'
// models
import { FilteredApplication } from '../models/FilteredApplication.js';

const myApplications = () => {
    // get auth'd user
    let authUser = useAuth()

    // array harboring available open status filter choices
    const [openChoices, setOpenChoices] = useState([
        {id: 1, name: 'Open', open: true, type: 'open'},
        {id: 2, name: 'Closed', open: false, type: 'open'},
    ])

    // array harboring available response status filter choices
    const [responseChoices, setResponseChoies] = useState([
        {id: 1, name: 'Pending', type: 'response'},
        {id: 2, name: 'Accepted', type: 'response'},
        {id: 3, name: 'Cancelled', type: 'response'},
        {id: 4, name: 'Rejected', type: 'response'},
    ])

    // array harboring visible incoming applications
    const [visibleInApplications, setVisibleInApplications] = useState([])

    // array harboring visible outgoing applications
    const [visibleOutApplications, setVisibleOutApplications] = useState([])

    // array harboring hidden incoming applications
    const [hiddenInApplications, setHiddenInApplications] = useState([])

    // array harboring hidden outgoing applications
    const [hiddenOutApplications, setHiddenOutApplications] = useState([])

    // determines whether incoming or outgoing applications are displayed
    const [isOutgoing, setIsOutgoing] = useState(true)

    useEffect(() => {
        // tracks whether component mounted, cleanup will assign false
        let isMounted = true
        // handle case where user is NOT logged in
        if (!authUser.user) {
            alert('must be logged in to view this page')
        }
        // get outgoing applications and set statge
        readDocsByCriteria('applications', 'user_id', authUser.user.id).then((apps) => {
            if (isMounted) setVisibleOutApplications(apps)
        })
        // get incoming applications and set stgatge
        readDocsByCriteria('applications', 'owner_id', authUser.user.id).then((apps) => {
            if (isMounted) setVisibleInApplications(apps)
        })
        // cleanup function to assign false to isMounted
        return function cleanup() {
            isMounted = false
        }
    }, [])

    const addFilter = (choice) => {
        /*
        DESCRIPTION:    moves applications lacking the provided filter from
                        visibleApplications to hiddenApplications and converts
                        them from Application objects to FilteredApplication
                        objects

        INPUT:          filter object being added

        RETURN:         NA
        */
        // helper arrays to harbor Applications during staging
        console.log('addFilter choice: ', choice)
        let newOutHidden = hiddenOutApplications
        let newOutVisible = visibleOutApplications
        let newInHidden = hiddenInApplications
        let newInVisible = visibleInApplications

        // handle case of open status filter
        if (choice.type === 'open') {
            // loop through hidden applications and potentially add filter
            for (const app of newOutHidden) app.addOpenFilter(choice)
            for (const app of newInHidden) app.addOpenFilter(choice)
            // loop through visible incoming applications and process
            for (const visibleApp of newInVisible) {
                if (visibleApp.isOpen() !== choice.open) {
                    // create FilteredApplication to add to hidden array
                    const filteredApp = FilteredApplication.fromOpen(visibleApp, choice)
                    newInHidden.push(filteredApp)
                    newInVisible = newInVisible.filter((element) => {
                        return element.id !== visibleApp.id
                    })
                }
            }
            // loop through visible outgoing applications and process
            for (const visibleApp of newOutVisible) {
                if (visibleApp.isOpen() !== choice.open) {
                    // create FilteredApplication to add to hidden array
                    const filteredApp = FilteredApplication.fromOpen(visibleApp, choice)
                    newOutHidden.push(filteredApp)
                    newOutVisible = newOutVisible.filter((element) => {
                        return element.id !== visibleApp.id
                    })
                }
            }
        }
        // handle case of response filter
        if (choice.type === 'response') {
            // loop through hidden applications and potentially add filter
            for (const app of newOutHidden) app.addResponseFilter(choice)
            for (const app of newInHidden) app.addResponseFilter(choice)
            // loop through visible incoming applications and process
            for (const visibleApp of newInVisible) {
                if (!visibleApp.hasResponse(choice)) {
                    // create FilteredApplication to add to hidden array
                    const filteredApp = FilteredApplication.fromResponse(visibleApp, choice)
                    newInHidden.push(filteredApp)
                    newInVisible = newInVisible.filter((element) => {
                        return element.id !== visibleApp.id
                    })
                }
            }
            // loop through visible outgoing applications and process
            for (const visibleApp of newOutVisible) {
                if (!visibleApp.hasResponse(choice)) {
                    // create FilteredApplication to add to hidden array
                    const filteredApp = FilteredApplication.fromResponse(visibleApp, choice)
                    newOutHidden.push(filteredApp)
                    newOutVisible = newOutVisible.filter((element) => {
                        return element.id !== visibleApp.id
                    })
                }
            }
        }
        // set state based on work done above
        setVisibleInApplications(newInVisible)
        setVisibleOutApplications(newOutVisible)
        setHiddenInApplications(newInHidden)
        setHiddenOutApplications(newOutHidden)
        console.log('ADD FILTER')
        console.log('visibleIn: ', newInVisible)
        console.log('hiddenIn: ', newInHidden)
        console.log('visibleOut: ', newOutVisible)
        console.log('hiddenOut: ', newOutHidden)
    }

    const removeFilter = (choice) => {
        /*
        DESCRIPTION:    moves applications lacking the provided filter from
                        hidden array to visible array and converts them
                        from FilteredApplication objects to Application objects

        INPUT:          choice (object): represents filter being removed

        RETURN:         NA
        */
        // helper arrays to harbor Applications during staging
        console.log('removeFilter choice: ', choice)
        let newOutHidden = hiddenOutApplications
        const newOutVisible = visibleOutApplications
        let newInHidden = hiddenInApplications
        const newInVisible = visibleInApplications

        // loop through hidden incoming applications and process
        for (const hiddenApp of newInHidden) {
            // remove filter if applicable
            if (choice.type === 'open') hiddenApp.removeOpenFilter(choice)
            if (choice.type === 'response') hiddenApp.removeResponseFilter(choice)
            // if last remaining filter removed, move project to visible
            if (hiddenApp.filtersIsEmpty()) {
                newInVisible.push(hiddenApp.application)
                newInHidden = newInHidden.filter((element) => {
                    return element.application.id !== hiddenApp.application.id
                })
            }
        }
        // loop through hidden outgoing applications and process
        for (const hiddenApp of newOutHidden) {
            // remove filter if applicable
            if (choice.type === 'open') hiddenApp.removeOpenFilter(choice)
            if (choice.type === 'response') hiddenApp.removeResponseFilter(choice)
            // if last remaining filter removed, move project to visible
            if (hiddenApp.filtersIsEmpty()) {
                newOutVisible.push(hiddenApp.application)
                newOutHidden = newInHidden.filter((element) => {
                    return element.application.id !== hiddenApp.application.id
                })
            }
        }
        // set state based on work done above
        setVisibleInApplications(newInVisible)
        setVisibleOutApplications(newOutVisible)
        setHiddenInApplications(newInHidden)
        setHiddenOutApplications(newOutHidden)
        console.log('REMOVE FILTER')
        console.log('visibleIn: ', newInVisible)
        console.log('hiddenIn: ', newInHidden)
        console.log('visibleOut: ', newOutVisible)
        console.log('hiddenOut: ', newOutHidden)
    }

    const toggleOutgoing = () => {
        setIsOutgoing(isOutgoing ? false : true)
    }



    return (
        <div className='background'>
            <div className='grid grid-cols-3'>
                <div className='col-span-2'>
                    <div className='p-2'>
                        <Button text={isOutgoing ? 'Show Incoming' : 'Show Outgoing'} type='btnGeneral' onClick={toggleOutgoing}/>
                    </div>
                    <ApplicationList apps={isOutgoing ? visibleOutApplications : visibleInApplications} isOutgoing={isOutgoing} />
                </div>
                <div className='sticky top-4 m-2 p-2 col-span-1 h-auto defaultBorder bg-white shadow-2xl'>
                    <div className='text-xl font-medium text-center'>
                        Filters
                    </div>
                    <hr className='w-full border-b-2 border-custom-cool-extraDark'/>
                    {/* <div className='py-1'>
                        <FilterButtons 
                        category='Incoming / Outgoing'
                        choices={inOutChoices}
                        onAdd={() => {}}
                        onRemove={() => {}}
                        />
                    </div> */}
                    <div className='py-1'>
                        <FilterButtons 
                        category='Open Status'
                        choices={openChoices}
                        onAdd={addFilter}
                        onRemove={removeFilter}
                        />
                    </div>
                    <div className='py-1'>
                        <FilterButtons 
                        category='Response'
                        choices={responseChoices}
                        onAdd={addFilter}
                        onRemove={removeFilter}
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

const ApplicationList = ({ apps, isOutgoing }) => {
    return (
        <div className=''>
            {apps.map((app) => {
                return (
                    <div key={app.id} className='p-2'>
                        <ApplicationCard appId={app.id} isOutgoing={isOutgoing}/>
                    </div>
                )
            })}
        </div>
    )
}

export default myApplications
