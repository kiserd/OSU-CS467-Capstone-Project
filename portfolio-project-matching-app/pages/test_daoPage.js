import { getAllDocs, getDocSnapshotById, getProjectById } from '../backend/dao'
import { Project } from '../backend/Project'

const test_daoPage = () => {
    const getStuff = async () => {
        var project = await getProjectById('6AqEuYkqrsArfuUEIOCQ')
        // projectSnap.docs.map((doc) => {
        //     console.log(doc.data())
        // })
        console.log(project)
        console.log(project.name)
        // console.log(projectSnap.data())
        // console.log(projectSnap.id)
    }

    getStuff();


    return (
        <div>
            
        </div>
    )
}

export default test_daoPage
