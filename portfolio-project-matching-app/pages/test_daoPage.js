import { getAllDocs, getDocumentById } from '../backend/dao'

const test_daoPage = () => {
    const getStuff = async () => {
        var projectSnap = await getDocumentById('projects', '6AqEuYkqrsArfuUEIOCQ')
        // projectSnap.docs.map((doc) => {
        //     console.log(doc.data())
        // })
        console.log(projectSnap.data())
        console.log(projectSnap.id)
    }

    getStuff();


    return (
        <div>
            
        </div>
    )
}

export default test_daoPage
