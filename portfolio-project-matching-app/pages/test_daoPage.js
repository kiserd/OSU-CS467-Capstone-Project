import { getAllDocs, getDocSnapshotById, getProjectById } from '../backend/dao'
import { Project } from '../models/Project'

const test_daoPage = () => {
    const getStuff = async () => {
        var project = await getProjectById('lvaaHKqTrt4QWr3rbEXI');
        console.log(project);
    }

    getStuff();


    return (
        <div>
            
        </div>
    )
}

export default test_daoPage
