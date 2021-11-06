import {
    addNewDoc,
    addNewDocWithId,
    deleteDocById,
    getCollectionReference,
    getCollectionSnapshot,
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

const createDoc = async (coll, payload) => {
    /*
    DESCRIPTION:    creates new document in provided Firebase collection with
                    data provided in payload. Similar to INSERT INTO
                    'collection'. Note, only document is created, not 
                    associations.

    INPUT:          coll (string) : name of Firebase collection where the
                    document being updated is located

                    payload (object): keys correspond to document field names
                    and values are the values being inserted into document.
                    Note, any omitted keys will result in the lack of those
                    fields in the new document.

    RETURN:         NA
    */
    // get snapshot of provided collection for error handling
    const collSnap = await getCollectionSnapshot(coll);
    // handle case of invalid collection name
    if (collSnap.empty) {
        console.log(`Collection '${coll}' does not exist.`);
    }
    // handle case where collection name is valid
    else {
        // handle case of creating project document ***this can probably be removed after midpoint archive is graded, we probably can get rid of the reference to owner and just store the ID ***
        let ownerRef;
        if (coll === 'projects') {
            ownerRef = await getDocReferenceById('users', payload.ownerId);
        }
        // add document to Firebase
        const newDocRef = await addNewDoc(coll, payload);
        console.log(`Created '${coll}' document with id: ${newDocRef.id}`);
    }
}

const createAssociation = async (coll, id1, id2) => {
    /*
    DESCRIPTION:    creates new projects_users document for provided project id
                    and user id.

    INPUT:          project id and user id in string format

    RETURN:         NA
    */
    // parse association collection name to get individual collection names
    const [coll1, coll2] = coll.split('_');
    // get document snapshots for invalid input handling
    const id1Snap = await getDocSnapshotById(coll1, id1);
    const id2Snap = await getDocSnapshotById(coll2, id2);
    const collSnap = await getDocSnapshotById(coll, `${id1}_${id2}`);
    // handle case where coll does not exist in database
    if (collSnap.empty) {
        console.log(`Collection '${coll}' does not exist`);
    }
    // handle case where id1 does not exist in coll1
    else if (!id1Snap.exists()) {
        console.log(`Invalid '${coll1}' id: '${id1}' does not exist`);
    }
    // handle case of projects_users where project is not open
    else if (coll === 'projects_users' && !id1Snap.data().open) {
        console.log(`Invalid '${coll1}' id: ${id1} is at capacity`);
    }
    // handle case where id2 does not exist in coll2
    else if (!id2Snap.exists()) {
        console.log(`Invalid '${coll2}' id: '${id2}' does not exist`);
    }
    // handle case where id1_id2 already exists in coll
    else if (collSnap.exists()) {
        console.log(`Invalid id1 id2 combo: '${id1}_${id2}' already exists in '${coll}'`);
    }
    // handle case inputs are valid 
    else {
        // build association document to send to Firebase
        const payload = getPayload(coll, id1, id2);
        const newDocRef = await addNewDocWithId(coll, `${id1}_${id2}`, payload);
        console.log(`Created '${coll}' document with id: ${newDocRef.id}`);
        // handle case of projects_users
        if (coll === 'projects_users') {
            // create update payload for incremented census
            const payload = {
                census: id1Snap.data().census + 1,
            }
            // handle case where project needs closed
            const payloadNeedsUpdated = id1Snap.data().census === id1Snap.data().capacity - 1;
            if (payloadNeedsUpdated){
                payload.open = false;
            }
            const collSnapNew = await updateDoc(coll1, id1, payload);
            console.log(`Updated '${coll1}' document id '${id1}' census to ${collSnapNew.data().census}`);
            if (payloadNeedsUpdated) {
                console.log(`Closed '${coll1}' document id '${id1}'`);
            }
        }
    }
}

const getPayload = (coll, id1, id2) => {
    /*
    DESCRIPTION:    builds association document payload based on coll input

    INPUT:          association collection name, id from collection 1, and id
                    from collection 2

    RETURN:         payload object to be inserted into association collection
    */
    // handle case of projects_users
    if (coll === 'projects_users') {
        return {project_id: id1, user_id: id2};
    }
    // handle case of projects_technologies
    else if (coll === 'projects_technologies') {
        return {project_id: id1, technology_id: id2};
    }
    // handle case of users_technologies
    else if (coll === 'users_technologies') {
        return {user_id: id1, technology_id: id2}
    }
}

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
        return snapNew;
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
    createAssociation,
    createDoc,
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