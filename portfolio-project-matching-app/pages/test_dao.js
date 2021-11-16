import { useEffect } from 'react'
import {
    createApplication,
    createAssociation,
    createDoc,
    createNewLike,
    createNewProjectDoc,
    createNewProjectsTechnologiesDoc,
    createNewProjectsUsersDoc,
    createNewUserDoc,
    deleteAssociation,
    deleteDoc,
    deleteDocAndAssociations,
    deleteLike,
    deleteProjectsUsersDoc,
    deleteUserDoc,
    getProjectById,
    readAllDocs,
    readApplicationsById,
    readDocIdsByCriteria,
    updateDoc,
    updateProject,
} from '../backend/dao'
import { Project } from '../models/Project'
import { User } from '../models/User'

const test_createProject = () => {
    const runSomeFunc = async () => {
        // DELETE PROJECT
        // const coll = 'projects';
        // const id = 'aI0TV2UfGcUTAWIZLTQp';
        // await deleteDocAndAssociations(coll, id);
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
