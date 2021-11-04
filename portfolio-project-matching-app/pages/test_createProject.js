import { useEffect } from 'react'
import {
    getProjectById,
    createNewProject,
    createNewProjectsUsersDoc,
    deleteProjectsUsersDoc,
    createNewProjectsTechnologiesDoc,
} from '../backend/dao'
import { Project } from '../models/Project';

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
