// library
// component
import Button from '../components/Button'
import UserIcon from '../components/UserIcon'


const ApplicationCard = ({ app, isOutgoing }) => {

    const onCancel = () => {
        // todo
    }

    const onApprove = () => {
        // todo
    }

    const onReject = () => {
        // todo
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
            <div className='pt-8'>
                {
                    isOutgoing ?
                    <div>
                        <Button text='Cancel Application' type='btnWarning' onClick={onCancel}/>
                    </div>
                    :
                    <div>
                        <div className='inline pr-2'>
                            <Button text='Approve' type='btnGeneral' onClick={onApprove}/>
                        </div>
                        <div className='inline'>
                            <Button text='Reject' type='btnWarning' onClick={onReject}/>
                        </div>
                    </div>
                }
            </div>
        </div>
    )
}

export default ApplicationCard
