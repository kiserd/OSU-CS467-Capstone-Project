// library
import { useState, useEffect } from 'react'
// backend
import { updateDoc, createAssociation } from '../backend/dao'
// component
import Button from '../components/Button'
import UserIcon from '../components/UserIcon'


const ApplicationCard = ({ app, isOutgoing }) => {
    // state to force re-rendering of application data on reject, approve, etc
    // probably better way to do this, but wanted to avoid re-querying the
    // db from the parent and re-rendering the entire list
    const [appToUse, setAppToUse] = useState(app)

    const onAction = async (response) => {
        // build payload to update application document
        const payload = {open: false, response: response}
        // update Firebase document
        await updateDoc('applications', app.id, payload)
        // handle case of approved application
        if (response === 'Approved') {
            await createAssociation('projects_users', app.project_id, app.user_id)
        }
        const updatedApp = appToUse
        updatedApp.response = response
        updatedApp.open = false
        setAppToUse(updatedApp)
    }

    return (
        <div className='p-2 w-full h-full border-2 border-gray-400 rounded-md'>
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
    )
}

export default ApplicationCard
