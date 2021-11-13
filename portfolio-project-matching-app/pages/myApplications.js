// library
import { useState, useEffect } from 'react'
// backend
import { readApplicationsById } from '../backend/dao.js';
// component
import ApplicationCard from '../components/ApplicationCard'
import Button from '../components/Button'
// context
import { useAuth } from '../context/AuthContext'

const myApplications = () => {
    // array harboring incoming applications
    const [inApplications, setInApplications] = useState([])

    // array harboring outgoing applications
    const [outApplications, setOutApplications] = useState([])

    // determines whether incoming or outgoing applications are displayed
    const [isOutgoing, setIsOutgoing] = useState(true)

    // get auth'd user
    let authUser = useAuth()

    useEffect(() => {
        // tracks whether component mounted, cleanup will assign false
        let isMounted = true
        // handle case where user is NOT logged in
        console.log(authUser);
        console.log(authUser.user.id);
        if (!authUser.user) {
            alert('must be logged in to view this page')
        }
        // get outgoing applications and set statge
        readApplicationsById('user_id', authUser.user.id).then((apps) => {
            if (isMounted) setOutApplications(apps)
        })
        // get incoming applications and set stgatge
        readApplicationsById('owner_id', authUser.user.id).then((apps) => {
            if (isMounted) setInApplications(apps)
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
                                <div key={app.id} className='p-2'>
                                    <ApplicationCard app={app} isOutgoing={isOutgoing}/>
                                </div>
                            )
                        })}
                    </div>
                :
                    // if outGoing is clear, show incoming applications
                    <div>
                        {inApplications.map((app) => {
                            return (
                                <div key={app.id} className='p-2'>
                                    <ApplicationCard app={app} isOutgoing={isOutgoing}/>
                                </div>
                            )
                        })}
                    </div>
            }
        </div>
    )
}

export default myApplications
