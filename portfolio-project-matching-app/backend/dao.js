import {
    // CREATE
    addNewDoc,
    addNewDocWithId,
    // READ
    getCollectionReference,
    getCollectionSnapshot,
    getCollectionSnapshotByCriteria,
    getDocSnapshotById,
    // UPDATE
    updateDocument,
    // DELETE
    deleteDocById,
} from '../Firebase/clientApp.ts'

import {
    // CREATE
    createNewLike,
    // READ
    getAllProjects,
    getOwnerByUserId,
    getProjectById,
    getTechnologiesByProjectId,
    getUsersByProjectId,
    // DELETE
    deleteLike,
} from '../backend/daoProject'

import {
    // READ
    getAllTechnologies,
    getTechnologyById,
} from '../backend/daoTechnology'

import {
    // READ
    getAllUsers,
    getProjectsByUserId,
    getTechnologiesByUserId,
    getUserById,
} from '../backend/daoUser'
import { Project } from '../models/Project'
import { User } from '../models/User'
import { Technology } from '../models/Technology'

/*
    CREATE
*/

const createDoc = async (coll, payload) => {
    /*
    DESCRIPTION:    creates new document in provided Firebase collection with
                    data provided in payload. Similar to INSERT INTO
                    'collection'. Note, only document is created, not 
                    associations.

    INPUT:          coll (string): name of Firebase collection where the
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
        return -1;
    }
    // handle case where collection name is valid
    else {
        // handle case of creating project document ***this can probably be removed after midpoint archive is graded, we probably can get rid of the reference to owner and just store the ID ***
        let ownerRef;
        if (coll === 'projects') {
            ownerRef = await getDocReferenceById('users', payload.ownerId);
        }
        // add document to Firebase
        const newDocSnap = await addNewDoc(coll, payload);
        console.log(`Created '${coll}' document with id: ${newDocRef.id}`);
        return newDocSnap;
    }
}

const createDocWithId = async (coll, payload, id) => {
    /*
    DESCRIPTION:    creates new document in provided Firebase collection with
                    data provided in payload. Similar to INSERT INTO
                    'collection'. Note, only document is created, not 
                    associations.

    INPUT:          coll (string): name of Firebase collection where the
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
        return -1;
    }
    // handle case where collection name is valid
    else {
        // handle case of creating project document ***this can probably be removed after midpoint archive is graded, we probably can get rid of the reference to owner and just store the ID ***
        let ownerRef;
        if (coll === 'projects') {
            ownerRef = await getDocReferenceById('users', payload.ownerId);
        }
        // add document to Firebase
        const newDocSnap = await addNewDocWithId(coll, id, payload);
        console.log(`Created '${coll}' document with id: ${newDocSnap.id}`);
        return newDocSnap;
    }
}

const createAssociation = async (coll, id1, id2) => {
    /*
    DESCRIPTION:    creates new association document for provided collection.
                    Also, updates project document if adding user to project.

    INPUT:          coll (string): name of Firebase collection where the
                    document being updated is located

                    id1 (string): document ID from first table being associated

                    id2 (string): document ID from second table being
                    associated

    RETURN:         new coll document snapshot
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
        return -1;
    }
    // handle case where id1 does not exist in coll1
    else if (!id1Snap.exists()) {
        console.log(`Invalid '${coll1}' id: '${id1}' does not exist`);
        return -1;
    }
    // handle case of projects_users where project is not open
    else if (coll === 'projects_users' && !id1Snap.data().open) {
        console.log(`Invalid '${coll1}' id: ${id1} is at capacity`);
        return -1;
    }
    // handle case where id2 does not exist in coll2
    else if (!id2Snap.exists()) {
        console.log(`Invalid '${coll2}' id: '${id2}' does not exist`);
        return -1;
    }
    // handle case where id1_id2 already exists in coll
    else if (collSnap.exists()) {
        console.log(`Invalid id1 id2 combo: '${id1}_${id2}' already exists in '${coll}'`);
        return -1;
    }
    // handle case inputs are valid 
    else {
        // build association document to send to Firebase
        const payload = getPayload(coll, id1, id2);
        const newDocSnap = await addNewDocWithId(coll, `${id1}_${id2}`, payload);
        console.log(`Created '${coll}' document with id: ${newDocSnap.id}`);
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
            const projectSnapNew = await updateDoc(coll1, id1, payload);
            console.log(`Updated '${coll1}' document id '${id1}' census to ${projectSnapNew.data().census}`);
            if (payloadNeedsUpdated) {
                console.log(`Closed '${coll1}' document id '${id1}'`);
            }
        }
        return newDocSnap;
    }
}

// helpers, don't export

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

// see daoProject.js, daoUser.js, and daoTechnology.js

const readAllDocs = async (coll) => {
    /*
    DESCRIPTION:    retrieves all documents in the specified collection and
                    returns an array of custom objects. Note, the associations
                    will not be populated in the objects.

    INPUT:          coll (string): collection to get documents from

    RETURN:         array of custom objects
    */
    // get collection snapshot
    const collSnap = await getCollectionSnapshot(coll);
    // handle case of invalid collection name
    if (collSnap.empty) {
        console.log(`Collection '${coll}' does not exist.`);
        return -1;
    }
    // handle case of collection passed that the function can't handle
    if (coll !== 'projects' && coll !== 'users' && coll !== 'technologies') {
        console.log(`Invalid collection: please use 'projects', 'users' or 'technologies'.`);
        return -1;
    }
    // handle case of valid collection name
    else {
        // loop through documents in the snapshot, adding objects to array
        const objects = [];
        for (const doc of collSnap.docs) {
            // handle case of 'projects' collection
            if (coll === 'projects') {
                objects.push(Project.fromDocSnapshot(doc.id, doc));
            }
            // handle case of 'users' collection
            else if (coll === 'users') {
                objects.push(User.fromDocSnapshot(doc.id, doc));
            }
            // handle case of 'technologies collection
            else if (coll === 'technologies') {
                objects.push(Technology.fromDocSnapshot(doc.id, doc));
            }
        }
        // return populated array to calling function
        return objects;
    }
}

const readQuerySnapshotById = async (coll, field, id) => {
    /*
    DESCRIPTION:    retrieves collection snapshot from specified collection
                    where field matches id

    INPUT:          coll (string) : name of Firebase collection where the
                    document being updated is located

                    field (string): document field to be compared against id

                    id (string) : document ID of document being updated

    RETURN:         collection snapshot subject to criteria above
    */
    // get collection snapshot
    const querySnap = await getCollectionSnapshotByCriteria(coll, field, '==', id);
    return querySnap;
}

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

    RETURN:         document snapshot after updates
    */
    // get document snapshot for invalid input handling
    const snap = await getDocSnapshotById(coll, id);
    // handle case where id does not exist in provided Firebase collection
    if (!snap.exists()) {
        console.log(`invalid ${coll} document: '${id}' does not exist`);
        return -1;
    }
    // handle case where input is valid
    else {
        // update document and indicate success to user
        const newDocSnap = await updateDocument(coll, id, payload);
        console.log(`Updated project '${newDocSnap.id}'`);
        return newDocSnap;
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

                    id (string) : document ID of document being deleted

    RETURN:         NA
    */
    // get document snapshot for invalid input handling
    const snap = await getDocSnapshotById(coll, id);
    // handle case where id does not exist in provided Firebase collection
    if (!snap.exists()) {
        console.log(`invalid ${coll} document: '${id}' does not exist`);
        return -1;
    }
    // handle case where inputs are valid
    else {
        const docRef = await deleteDocById(coll, id);
        console.log(`Deleted ${coll} document with id: '${docRef.id}'`);
        return docRef;
    }
}

const deleteAssociation = async (coll, id1, id2) => {
    /*
    DESCRIPTION:    deletes association document for provided collection. Also,
                    updates project document if removing user from project

    INPUT:          coll (string): name of Firebase collection where the
                    document being updated is located

                    id1 (string): document ID from first table being associated

                    id2 (string): document ID from second table being
                    associated

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
        return -1;
    }
    // handle case where id1 does not exist in coll1
    else if (!id1Snap.exists()) {
        console.log(`Invalid '${coll1}' id: '${id1}' does not exist`);
        return -1;
    }
    // handle case of projects_users where id2 is the project owner
    else if (coll === 'projects_users' && !id1Snap.data().owner === id2) {
        console.log(`Invalid '${coll2}' id: ${id2} is the project owner`);
        return -1;
    }
    // handle case where id2 does not exist in coll2
    else if (!id2Snap.exists()) {
        console.log(`Invalid '${coll2}' id: '${id2}' does not exist`);
        return -1;
    }
    // handle case where id1_id2 does not exist in coll
    else if (!collSnap.exists()) {
        console.log(`Invalid id1 id2 combo: '${id1}_${id2}' does not exist in '${coll}'`);
        return -1;
    }
    // handle case inputs are valid 
    else {
        // delete association document from Firebase
        const ref = await deleteDocById(coll, `${id1}_${id2}`);
        console.log(`Deleted '${coll}' document with id: ${ref.id}`);
        // handle case of projects_users
        if (coll === 'projects_users') {
            // create update payload for decremented census
            const payload = {
                census: id1Snap.data().census - 1,
            }
            // handle case where project needs opened
            const payloadNeedsUpdated = id1Snap.data().census === id1Snap.data().capacity;
            if (payloadNeedsUpdated){
                payload.open = true;
            }
            const collSnapNew = await updateDoc(coll1, id1, payload);
            console.log(`Updated '${coll1}' document id '${id1}' census to ${collSnapNew.data().census}`);
            if (payloadNeedsUpdated) {
                console.log(`Opened '${coll1}' document id '${id1}'`);
            }
        }
        return ref;
    }
}

const deleteDocAndAssociations = async (coll, id) => {
    /*
    DESCRIPTION:    deletes document with provided document ID from provided
                    collection. Also deletes any association documents e.g.,
                    'projects_users', 'users_technologies', etc

    INPUT:          coll (string) : name of Firebase collection where the
                    document being updated is located

                    id (string) : document ID of document being deleted

    RETURN:         NA
    */
    // get document snapshot for invalid input handling
    const snap = await getDocSnapshotById(coll, id);
    // handle case where id does not exist in provided Firebase collection
    if (!snap.exists()) {
        console.log(`invalid ${coll} document: '${id}' does not exist`);
        return -1;
    }
    // handle case where inputs are valid
    else {
        // delete associations using helper object
        for (const map of deleteAssociationsHelper[coll]) {
            const querySnap = await readQuerySnapshotById(map.coll, map.field, id);
            for (const doc of querySnap.docs) {
                await deleteDoc(map.coll, doc.id);
            }
        }
        // delete main doc
        const docRef = await deleteDocById(coll, id);
        console.log(`Deleted ${coll} document with id: '${docRef.id}'`);
        return docRef;
    }
}

// helpers, don't export

const deleteAssociationsHelper = {
    'projects': [
        {coll: 'projects_users', field: 'project_id'},
        {coll: 'projects_technologies', field: 'project_id'}
    ],
    'users': [
        {coll: 'projects_users', field: 'user_id'},
        {coll: 'projects_technologies', field: 'user_id'}
    ],
    'technologies': []
};

export {
    // CREATE
    createAssociation,
    createDoc,
    createDocWithId,
    createNewLike,
    // READ
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
    readAllDocs,
    // UPDATE
    updateDoc,
    // DELETE
    deleteAssociation,
    deleteDoc,
    deleteDocAndAssociations,
    deleteLike,
}