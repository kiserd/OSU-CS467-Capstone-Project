import { useEffect } from 'react'
import {
    createApplication,
    createAssociation,
    createDoc,
    createNewLike,
    deleteAssociationById,
    deleteAssociationByIds,
    deleteDoc,
    deleteDocAndAssociations,
    deleteLike,
    readAllDocs,
    readAssociationObjectsByType,
    readDocIdsByCriteria,
    readAllObjects,
    readObjectById,
    updateDoc,
} from '../backend/dao'
import { Project } from '../models/Project'
import { User } from '../models/User'

const test_createProject = () => {
    const runSomeFunc = async () => {
        const assocs = await readAssociationObjectsByType('projects_users', 'user_id', '8Ro56x6vPshn2E5XFI2CNfZH5Kg1', 'projects', 'project_id', true)
        console.log('assocs: ', assocs);
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
