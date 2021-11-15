// library
import { useState, useEffect } from 'react'
// backend
import { readApplicationsById, readApplicationIdsById, readDocIdsByCriteria } from '../backend/dao.js';
// component
import ApplicationCard from '../components/ApplicationCard'
import Button from '../components/Button'
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

    return (
        <div className='p-2'>
            <div className='pb-2'>
                <Button text={isOutgoing ? 'Show Incoming' : 'Show Outgoing'} type='btnGeneral' onClick={toggleOutgoing}/>
            </div>
            {
                isOutgoing ?
                    // if outGoing is set, show outgoing applications
                    <div className=''>
                        {outApplications.map((app) => {
                            return (
                                <div key={app} className='p-2'>
                                    <ApplicationCard appId={app} isOutgoing={isOutgoing}/>
                                </div>
                            )
                        })}
                    </div>
                :
                    // if outGoing is clear, show incoming applications
                    <div>
                        {inApplications.map((app) => {
                            return (
                                <div key={app} className='p-2'>
                                    <ApplicationCard appId={app} isOutgoing={isOutgoing}/>
                                </div>
                            )
                        })}
                    </div>
            }
        </div>
    )
}

export default myApplications
