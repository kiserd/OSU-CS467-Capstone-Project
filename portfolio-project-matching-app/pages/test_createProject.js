import { getProjectById, createNewProject, createNewProjectsUsers } from '../backend/dao'
import { Project } from '../models/Project';

const test_createProject = () => {
    const runSomeFunc = async () => {
        // const myProject = await getProjectById('invalid id');
        // const project = new Project();
        // console.log('project: ', project);
        const projectId = 'mfDi4Ijwt9GDUsqAppQc';
        const userId = 'C7UvzLR6Dj1g45QV6q4B';
        await createNewProjectsUsers(projectId, userId);
    }

    // runSomeFunc();

    return (
        <div>
            
        </div>
    )
}

export default test_createProject
