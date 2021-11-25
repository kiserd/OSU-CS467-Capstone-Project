// library
import { useState, useEffect } from 'react'
// backend
import { readObjectsByCriteria } from '../backend/dao.js';
// component
import ApplicationCard from '../components/ApplicationCard'
import Button from '../components/Button'
import FilterButtons from '../components/FilterButtons.js';
// context
import { useAuth } from '../context/AuthContext'
// models
import { Applications } from '../models/Applications';

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
    const [incoming, setIncoming] = useState({visible: [], filtered: []})

    // array harboring visible outgoing applications
    const [outgoing, setOutgoing] = useState({visible: [], filtered: []})

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
        readObjectsByCriteria('applications', 'user_id', authUser.user.id).then((apps) => {
            if (isMounted) setOutgoing(Applications.fromApplicationArray(apps))
        })
        // get incoming applications and set stgatge
        readObjectsByCriteria('applications', 'owner_id', authUser.user.id).then((apps) => {
            if (isMounted) setIncoming(Applications.fromApplicationArray(apps))
        })
        // cleanup function to assign false to isMounted
        return function cleanup() {
            isMounted = false
        }
    }, [])

    const addFilter = (choice) => {
        /*
        DESCRIPTION:    processes Application objects in Applications object
                        field arrays and sets state with copies

        INPUT:          filter object being added

        RETURN:         NA
        */
        // process Application arrays in Applications objects
        incoming.addFilter(choice);
        outgoing.addFilter(choice);

        // create copies of state objects
        const tempIn = Applications.fromExisting(incoming);
        const tempOut = Applications.fromExisting(outgoing);
        
        // set state based on work done above
        setIncoming(tempIn)
        setOutgoing(tempOut)
    }

    const removeFilter = (choice) => {
        /*
        DESCRIPTION:    processes Application objects in Applications object
                        field arrays and sets state with copies

        INPUT:          filter object being removed

        RETURN:         NA
        */
        // process Application arrays in Applications objects
        incoming.removeFilter(choice);
        outgoing.removeFilter(choice);

        // create copies of state objects
        const tempIn = Applications.fromExisting(incoming);
        const tempOut = Applications.fromExisting(outgoing);
        
        // set state based on work done above
        setIncoming(tempIn)
        setOutgoing(tempOut)
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
                    <ApplicationList apps={isOutgoing ? outgoing.visible : incoming.visible} isOutgoing={isOutgoing} />
                </div>
                <div className='sticky top-4 m-2 p-2 col-span-1 h-auto max-h-96 defaultBorder bg-white shadow-2xl'>
                    <div className='text-xl font-medium text-center'>
                        Filters
                    </div>
                    <hr className='w-full border-b-2 border-custom-cool-extraDark'/>
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
