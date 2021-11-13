// library
// component
import Button from '../components/Button'


const ApplicationCard = ({ app, isOutgoing }) => {
    return (
        <div className='p-2 w-full h-full border-2 border-gray-400 rounded-md'>
            <div className='w-full'>
                <p className='text-xl font-medium'>{app.project.name}</p>
            </div>
            <hr className='w-11/12 sm:w-9/12 border-b-2 border-gray-400'/>
            <div>
                Project Owner: {app.owner.username}
            </div>
            <div>
                <Button text='Cancel Application' type='btnWarning' onClick={() => {}}/>
            </div>
            {/* <div className='flex flex-wrap'>
                {projectToUse.technologies.map((technology) => {
                    return (
                        <div key={technology.id} className='py-1 pr-2'>
                            <Button text={technology.name}/>
                        </div>
                )
                })}
            </div>
            <div className=''>
                <p className='line-clamp-3 lg:line-clamp-2 xl:line-clamp-1'>
                    {projectToUse.description}
                </p>
            </div>
            <div className='mt-2 flex flex-wrap'>
                <div className='self-center'>
                    {projectToUse.census} out of {projectToUse.capacity} ({projectToUse.capacity - projectToUse.census} positions left)
                    </div>
                <div className='p-1'>
                    <Button text='join' onClick={applyToProject} type='btnGeneral' />
                </div>
            </div>
            <div className='flex flex-wrap'>
                Commented out, but leaving in just in case we decide to add this back
                {project.users.map((user) => {
                    return (
                    <div key={user.id} className='py-1 pr-2'>
                        <UserIcon imgPath='/../public/user.ico' username={user.username} />
                    </div>
                    )
                })}
            </div>
            <div className='inline'>
                <h3 className='py-1 inline'>{projectToUse.likes} Likes</h3>
                <div className='p-1 inline'>
                    <Button text='Like' onClick={likeProject} type='btnGeneral' />
                </div>
            </div>
            <Link href={`/project?id=${projectToUse.id}`} passHref>
                <a>
                    <Button text="View More Info" addClassName='block mt-2'/>
                </a>
            </Link> */}
        </div>
    )
}

export default ApplicationCard
