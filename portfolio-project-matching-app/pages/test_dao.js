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
        const coll = 'likes';
        const id1 = 'mfDi4Ijwt9GDUsqAppQc_8Ro56x6vPshn2E5XFI2CNfZH5Kg1';
        const id2 = 'yvTe6dXXciIDITK15BJN';
        await deleteAssociationById(coll, id1);
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
