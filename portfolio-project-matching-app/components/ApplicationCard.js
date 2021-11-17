// library
import { useState, useEffect } from 'react'
// backend
import { updateDoc, createAssociation, readObjectById } from '../backend/dao'
// component
import Button from '../components/Button'
import UserIcon from '../components/UserIcon'


const ApplicationCard = ({ appId, isOutgoing }) => {
    // state to force re-rendering of application data on reject, approve, etc
    // probably better way to do this, but wanted to avoid re-querying the
    // db from the parent and re-rendering the entire list
    const [app, setApp] = useState()

    const onAction = async (response) => {
        // build payload to update application document
        const payload = {open: false, response: response}
        // handle case of re-opened application
        if (response === 'Pending') {
            payload.open = true
        }
        // update Firebase document and get updated Application object
        await updateDoc('applications', app.id, payload)
        const updatedApp = await readObjectById('applications', app.id, true)
        // handle case of approved application
        if (response === 'Approved') {
            createAssociation('projects_users', app.project_id, app.user_id)
        }
        setApp(updatedApp)
    }

    useEffect(() => {
        // tracks whether component mounted, cleanup will assign false
        let isMounted = true
        // get Application object and set state if component mounted
        readObjectById('applications', appId, true).then((app) => {
            if (isMounted) setApp(app)
        })
        // cleanup function to assign false to isMounted
        return function cleanup() {
            isMounted = false
        }
    }, [])

    return (
        <div className='p-2 w-full h-full border-2 border-gray-400 rounded-md'>
            {
                // handle case where application fetched and state set
                app ?
                    <div>
                        <div className='w-full'>
                            <p className='text-xl font-medium'>{app.project.name}</p>
                        </div>
                        <hr className='w-11/12 sm:w-9/12 border-b-2 border-gray-400'/>
                        <div className='pt-2'>
                            {
                                isOutgoing ?
                                    <div>
                                        Project Owner:{'  '}
                                        <UserIcon username={app.owner.username} />
                                    </div>
                                :
                                    <div>
                                        Applicant:{'  '}
                                        <UserIcon username={app.user.username}/>
                                    </div>
                            }
                        </div>
                        <div className='pt-2'>
                            Response: {app.response}
                        </div>
                        <div className='pt-2'>
                            Status: {app.open ? 'Open' : 'Closed'}
                        </div>
                        <div className='pt-8'>
                            {
                                !app.open && app.response === 'Cancelled' ?
                                <div>
                                    <Button text='Re-Open Application' type='btnGeneral' onClick={() => onAction('Pending')}/>
                                </div>
                                :
                                !app.open ?
                                <div></div>
                                :
                                isOutgoing ?
                                <div>
                                    <Button text='Cancel Application' type='btnWarning' onClick={() => onAction('Cancelled')}/>
                                </div>
                                :
                                <div>
                                    <div className='inline pr-2'>
                                        <Button text='Approve' type='btnGeneral' onClick={() => onAction('Approved')}/>
                                    </div>
                                    <div className='inline'>
                                        <Button text='Reject' type='btnWarning' onClick={() => onAction('Rejected')}/>
                                    </div>
                                </div>
                            }
                        </div>
                    </div>
                // handle case where app is still being fetched and state empty
                :
                    <div>
                    Loading...
                    </div>
            }
        </div>
    )
}

export default ApplicationCard
