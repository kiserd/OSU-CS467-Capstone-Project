import ProjectCard from '../components/ProjectCard'

const projectCardPage = () => {
    const dummyProject = {
        name: 'Wastegram',
        description: 'Local businesses have the ability to document food waste at the end of each day. Users can document quantity, geo-location, and photos of the waste. Users should be able to choose between dark and light mode and are greeted by a list of recent posts',
        capacity: 5,
        census: 3,
        open: true,
        likes: 25,
        owner: {username: 'ylijokic'},
        technologies: [{id: 1, name: 'Javascript'}, {id: 2, name: 'C++'}, {id: 3, name: 'React'}, {id: 4, name: 'Flutter'}],
        users: [{id: 1, username: 'kiserlams'}, {id: 2, username: 'ylijokic'}, {id: 3, username: 'kaiserjo'}]
    }
    return (
        <div className='m-5'>
            <ProjectCard project={dummyProject}/>
        </div>
    )
}

export default projectCardPage
