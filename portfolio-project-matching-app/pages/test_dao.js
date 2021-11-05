import { useEffect } from 'react'
import {
    getProjectById,
    createNewProjectDoc,
    createNewProjectsUsersDoc,
    createNewUserDoc,
    deleteProjectsUsersDoc,
    deleteUserDoc,
    createNewProjectsTechnologiesDoc,
} from '../backend/dao'
import { Project } from '../models/Project'
import { User } from '../models/User'

const test_createProject = () => {
    const runSomeFunc = async () => {
        // const myProject = await getProjectById('invalid id');
        // const project = new Project();
        // console.log('project: ', project);

        // const projectId = 'mfDi4Ijwt9GDUsqAppQc';
        // const userId = 'C7UvzLR6Dj1g45QV6q4B';
        // await createNewProjectsUsersDoc(projectId, userId);

        // const projectId = 'mfDi4Ijwt9GDUsqAppQc';
        // const userId = 'C7UvzLR6Dj1g45QV6q4B';      
        // await deleteProjectsUsersDoc(projectId, userId);  

        // const projectId = '6AqEuYkqrsArfuUEIOCQ';
        // const technologyId = 'X5S4dzoet7xCwTDwce4J';
        // await createNewProjectsTechnologiesDoc(projectId, technologyId);

        // const projectId = '6AqEuYkqrsArfuUEIOCQ';
        // const technologyId = 'GjGjYTX2uIRrfKrLpSID';
        // await createNewProjectsTechnologiesDoc(projectId, technologyId);

        // const projectMap = {
        //     name: 'Silly Project',
        //     description: 'Helps users carry out all sorts of silly tasks. Tasks can be planned for silly days and silly times',
        //     capacity: 7,
        //     census: 1,
        //     open: true,
        //     likes: 25,
        //     ownerId: 'Ipru4NtHrmGja7zl26Un',
        // };
        // const project = Project.fromObject(projectMap);
        // await createNewProjectDoc(projectMap);

        // const userMap = {
        //     email: 'darren.mcfadden@raiders.org',
        //     username: 'rollTideRB',
        //     introduction: 'Love running and coding'
        // };
        // const user = User.fromObject(userMap);
        // await createNewUserDoc(user);

        // const userId = 'rDwUUWUW0td9wBbQ0SbB';
        // await deleteUserDoc(userId);
        
    }

    useEffect(() => {
        runSomeFunc();
    }, [])

    return (
        <div>
            
        </div>
    )
}

export default test_createProject
