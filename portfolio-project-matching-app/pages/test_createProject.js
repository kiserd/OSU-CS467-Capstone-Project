import { getProjectById } from '../backend/dao'
import { Project } from '../models/Project';

const test_createProject = () => {
    const runSomeFunc = async () => {
        const myProject = await getProjectById('invalid id');
        const project = new Project();
        console.log('project: ', project);
    }

    runSomeFunc();
    
    return (
        <div>
            
        </div>
    )
}

export default test_createProject
