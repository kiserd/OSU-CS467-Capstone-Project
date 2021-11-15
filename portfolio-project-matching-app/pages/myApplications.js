// library
import { useState, useEffect } from 'react'
// backend
import { readApplicationsById, readApplicationIdsById, readDocIdsByCriteria } from '../backend/dao.js';
// component
import ApplicationCard from '../components/ApplicationCard'
import Button from '../components/Button'
import FilterButtons from '../components/FilterButtons.js';
// context
import { useAuth } from '../context/AuthContext'

const myApplications = () => {
    // get auth'd user
    let authUser = useAuth()

    // array harboring incoming applications
    const [inApplications, setInApplications] = useState([])

    // array harboring outgoing applications
    const [outApplications, setOutApplications] = useState([])

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
        readDocIdsByCriteria('applications', 'user_id', authUser.user.id).then((appIds) => {
            if (isMounted) setOutApplications(appIds)
        })
        // get incoming applications and set stgatge
        readDocIdsByCriteria('applications', 'owner_id', authUser.user.id).then((appIds) => {
            if (isMounted) setInApplications(appIds)
        })
        // cleanup function to assign false to isMounted
        return function cleanup() {
            isMounted = false
        }
    }, [])

    const toggleOutgoing = () => {
        setIsOutgoing(isOutgoing ? false : true)
    }

    const inOutChoices = [
        {id: 1, name: 'Incoming'},
        {id: 2, name: 'Outgoing'},
    ]

    const responseChoices = [
        {id: 1, name: 'Pending'},
        {id: 2, name: 'Accepted'},
        {id: 3, name: 'Cancelled'},
        {id: 4, name: 'Rejected'},
    ]

    const openChoices = [
        {id: 1, name: 'Open'},
        {id: 2, name: 'Closed'},
    ]

    return (
        <div className='background'>
            <div className='grid grid-cols-3'>
                <div className='col-span-2'>
                    <Button text={isOutgoing ? 'Show Incoming' : 'Show Outgoing'} type='btnGeneral' onClick={toggleOutgoing}/>
                    <ApplicationList apps={isOutgoing ? outApplications : inApplications} isOutgoing={isOutgoing} />
                </div>
                <div className='sticky top-4 m-2 p-2 col-span-1 h-auto defaultBorder bg-white shadow-2xl'>
                    <div className='text-xl font-medium text-center'>
                        Filters
                    </div>
                    <hr className='w-full border-b-2 border-custom-cool-extraDark'/>
                    <FilterButtons 
                    category='Incoming / Outgoing'
                    choices={inOutChoices}
                    onAdd={() => {}}
                    onRemove={() => {}}
                    />
                    <FilterButtons 
                    category='Open / Closed'
                    choices={openChoices}
                    onAdd={() => {}}
                    onRemove={() => {}}
                    />
                    <FilterButtons 
                    category='Response'
                    choices={responseChoices}
                    onAdd={() => {}}
                    onRemove={() => {}}
                    />
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
                    <div key={app} className='p-2'>
                        <ApplicationCard appId={app} isOutgoing={isOutgoing}/>
                    </div>
                )
            })}
        </div>
    )
}

export default myApplications
