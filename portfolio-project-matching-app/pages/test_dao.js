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
