import { getProjectById } from '../backend/dao'

const test_createProject = () => {
    const runSomeFunc = async () => {
        const myProject = await getProjectById('invalid id');
    }

    runSomeFunc();
    return (
        <div>
            
        </div>
    )
}

export default test_createProject
