// library
import { useState, useEffect } from 'react'
// backend
import { readApplicationsById } from '../backend/dao.js';
// component
import ApplicationCard from '../components/ApplicationCard'
// context
import { useAuth } from '../context/AuthContext'

const myApplications = () => {
    // array harboring incoming applications
    const [inApplications, setInApplications] = useState([])

    // array harboring outgoing applications
    const [outApplications, setOutApplications] = useState([])

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

    return (
        <div>
            {outApplications.map((app) => {
                return <ApplicationCard key={app.id} app={app}/>
            })}
        </div>
    )
}

export default myApplications
