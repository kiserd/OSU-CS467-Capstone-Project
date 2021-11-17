import { useEffect } from 'react'
import {
    createApplication,
    createAssociation,
    createDoc,
    createNewLike,
    deleteAssociation,
    deleteDoc,
    deleteDocAndAssociations,
    deleteLike,
    readAllDocs,
    readAssociationsByType,
    readDocIdsByCriteria,
    readAllObjects,
    readObjectById,
    updateDoc,
} from '../backend/dao'
import { Project } from '../models/Project'
import { User } from '../models/User'

const test_createProject = () => {
    const runSomeFunc = async () => {
        // const assocColl = 'projects_users';
        // const assocField = 'project_id';
        // const assocId = '6AqEuYkqrsArfuUEIOCQ'
        // const coll = 'users';
        // const field = 'user_id';
        // const objects = await readAssociationsByType(assocColl, assocField, assocId, coll, field, true);
        // console.log('objects: ', objects);

        const coll = 'dummy';
        const docs = await readAllDocs(coll);
        console.log('docs: ', docs);

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
