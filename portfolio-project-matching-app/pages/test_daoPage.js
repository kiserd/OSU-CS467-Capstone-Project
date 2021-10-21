import { getAllDocs, getAllProjects, getDocSnapshotById, getProjectById } from '../backend/dao'
import { Project } from '../models/Project'

const test_daoPage = () => {
    // const getStuff = async () => {
    //     var project = await getProjectById('lvaaHKqTrt4QWr3rbEXI');
    //     console.log(project);
    // }

    const getStuff = async () => {
        var projects = await getAllProjects();
        console.log(projects);
        projects.forEach((project) => {
            console.log(project.technologies);
        })
    }

    getStuff();


    return (
        <div>
            
        </div>
    )
}

export default test_daoPage
