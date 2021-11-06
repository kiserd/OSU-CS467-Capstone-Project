import {
    getDocSnapshotById,
    updateDocument,
} from '../Firebase/clientApp.ts'

import {
    createNewLike,
    createNewProjectDoc,
    createNewProjectsUsersDoc,
    createNewProjectsTechnologiesDoc,
    deleteLike,
    deleteProjectDoc,
    deleteProjectsTechnologiesDoc,
    deleteProjectsUsersDoc,
    getAllProjects,
    getOwnerByUserId,
    getProjectById,
    getTechnologiesByProjectId,
    getUsersByProjectId,
    updateProject,
} from '../backend/daoProject'

import {
    getAllTechnologies,
    getTechnologyById,
} from '../backend/daoTechnology'

import {
    createNewUserDoc,
    createNewUsersTechnologiesDoc,
    deleteUserDoc,
    getAllUsers,
    getProjectsByUserId,
    getTechnologiesByUserId,
    getUserById,
} from '../backend/daoUser'

/*
    CREATE
*/

/*
    READ
*/

/*
    UPDATE
*/

const updateDoc = async (coll, id, payload) => {
    /*
    DESCRIPTION:    updates Firebase document from provided collection, with
                    provided document id, with data provided in payload

    INPUT:          coll (string) : name of Firebase collection where the
                    document being updated is located

                    id (string) : document ID of document being updated

                    payload (object): keys correspond to document field names
                    and values are the new values being inserted into document.
                    Note, any omitted keys/values will be left unchanged.

    RETURN:         NA
    */
    // get document snapshot for invalid input handling
    const snap = await getDocSnapshotById(coll, id);
    // handle case where id does not exist in provided Firebase collection
    if (!snap.exists()) {
        console.log(`invalid ${coll} document: '${id}' does not exist`);
    }
    // handle case where input is valid
    else {
        // update document and indicate success to user
        const snapNew = await updateDocument(coll, id, payload);
        console.log(`Updated project '${snapNew.id}'`);
    }
}

/*
    DELETE
*/

const deleteDoc = async (coll, id) => {
    /*
    DESCRIPTION:    deletes document with provided document ID from provided
                    collection

    INPUT:          coll (string) : name of Firebase collection where the
                    document being updated is located

                    id (string) : document ID of document being updated

    RETURN:         NA
    */
    // get document snapshot for invalid input handling
    const snap = await getDocSnapshotById(coll, id);
    // handle case where id does not exist in provided Firebase collection
    if (!snap.exists()) {
        console.log(`invalid ${coll} document: '${id}' does not exist`);
    }
    // handle case where inputs are valid
    else {
        const ref = await deleteDocById(coll, id);
        console.log(`Deleted ${coll} document with id: ${ref.id}`);
    }
}

export {
    createNewLike,
    createNewProjectDoc,
    createNewProjectsUsersDoc,
    createNewProjectsTechnologiesDoc,
    createNewUserDoc,
    createNewUsersTechnologiesDoc,
    deleteDoc,
    deleteLike,
    deleteProjectDoc,
    deleteProjectsTechnologiesDoc,
    deleteProjectsUsersDoc,
    deleteUserDoc,
    getAllProjects,
    getAllTechnologies,
    getAllUsers,
    getOwnerByUserId,
    getProjectById,
    getProjectsByUserId,
    getTechnologiesByProjectId,
    getTechnologiesByUserId,
    getTechnologyById,
    getUserById,
    getUsersByProjectId,
    updateDoc,
    updateProject,
}