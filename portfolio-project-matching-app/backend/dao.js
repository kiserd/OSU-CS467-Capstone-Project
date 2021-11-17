// clientApp (Firebase queries)
import {
    // CREATE
    addNewDoc,
    addNewDocWithId,
    // READ
    getCollectionReference,
    getCollectionSnapshot,
    getDocReferenceById,
    getCollectionSnapshotByCriteria,
    getDocSnapshotById,
    // UPDATE
    updateDocument,
    // DELETE
    deleteDocById,
} from '../Firebase/clientApp.ts'

// model
import { Application } from '../models/Application'
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
            payload.owner = ownerRef;
        }
        // add document to Firebase
        const newDocSnap = await addNewDoc(coll, payload);
        console.log(`Created '${coll}' document with id: ${newDocSnap.id}`);
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
    // user helper object in obtaining associated collection names
    const coll1 = deleteAssociationHelper[coll].coll1;
    const coll2 = deleteAssociationHelper[coll].coll2;
    // handle case where coll does not exist in database
    const inputIsValid = await createAssociationInputIsValid(coll, id1, coll1, id2, coll2);
    if (!inputIsValid) return -1;
    // handle case inputs are valid 
    // build association document to send to Firebase
    const payload = await getPayload(coll, id1, id2);
    const newDocSnap = await addNewDocWithId(coll, `${id1}_${id2}`, payload);
    console.log(`Created '${coll}' document with id: ${newDocSnap.id}`);
    // handle case of projects_users, increment census and maybe close
    if (coll === 'projects_users') await incrementCensusAndClose(id1);
    // handle case of likes, incremement project likes
    if (coll === 'likes') await incrementLikes(id1);
    // return document snapshot to calling function
    return newDocSnap;
}

const createNewLike = async (projectId, userId) => {
    /*
    DESCRIPTION:    creates new likes document for provided project id and
                    user id.

    INPUT:          project id and user id in string format

    RETURN:         NA
    */
    // get document snapshots for invalid input handling
    const projectSnap = await getDocSnapshotById('projects', projectId);
    const userSnap = await getDocSnapshotById('users', userId);
    const likesSnap = await getDocSnapshotById('likes', `${projectId}_${userId}`);
    // handle case where projectId does not exist in Firebase
    if (!projectSnap.exists()) {
        console.log(`invalid projectId: '${projectId}' does not exist`);
        return -1;
    }
    // handle case where userId does not exist in Firebase
    else if (!userSnap.exists()) {
        console.log(`invalid userId: '${userId}' does not exist`);
        return -1;
    }
    // handle case where projectId_userId already exists in likes
    else if (likesSnap.exists()) {
        console.log(`invalid projectId userId combination: '${userId}' already liked project '${projectId}'`);
        return -1;
    }
    // handle case where inputs are valid 
    else {
        // build likes object to send to Firebase
        const likesPayload = {
            project_id: projectId,
            user_id: userId
        }
        const newDocRef = await addNewDocWithId('likes', `${projectId}_${userId}`, likesPayload);
        console.log(`Created likes document with id: ${newDocRef.id}`);
        // get new likes total and build update payload
        const likesTotalPayload = {
            likes: projectSnap.data().likes + 1,
        }
        // update likes total and indicate success to user
        const docSnapshot = await updateDocument('projects', projectId, likesTotalPayload);
        console.log(`Updated project '${docSnapshot.id}' with ${docSnapshot.data().likes} total likes`);
        return docSnapshot;

    }
}

// helpers, don't export

const getPayload = async (coll, id1, id2) => {
    /*
    DESCRIPTION:    builds association document payload based on coll input

    INPUT:          association collection name, id from collection 1, and id
                    from collection 2

    RETURN:         payload object to be inserted into association collection
    */
    // handle case of projects_users
    if (coll === 'projects_users' || coll === 'likes') {
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
    // handle case of applications
    else if (coll === 'applications') {
        const projectSnap = await getDocSnapshotById('projects', id1);
        return {
            project_id: id1,
            user_id: id2,
            owner_id: projectSnap.data().ownerId,
            open: true,
            response: 'pending'
        }
    }
    else {
        console.log(`please update 'getPayload()' in dao.js to handle this type of association`);
    }
}

const createAssociationInputIsValid = async (coll, id1, coll1, id2, coll2) => {
    /*
    DESCRIPTION:    determines whether createAssociation() inputs are valid

    INPUT:          coll (string): name of Firebase collection where the
                    document being updated is located

                    id1 (string): document ID from first table being associated

                    coll1 (string): collection id1 belongs to

                    id2 (string): document ID from second table being
                    associated

                    coll2 (string): collection id2 belongs to

    RETURN:         boolean indication as to whether the inputs are valid
    */
    // get document snapshots for invalid input handling
    const [id1Snap, id2Snap, collSnap] = await Promise.all([
        getDocSnapshotById(coll1, id1),
        getDocSnapshotById(coll2, id2),
        getDocSnapshotById(coll, `${id1}_${id2}`)
    ]);
    // handle case where coll does not exist in database
    if (collSnap.empty) {
        console.log(`Collection '${coll}' does not exist`);
        return false;
    }
    // handle case where id1 does not exist in coll1
    else if (!id1Snap.exists()) {
        console.log(`Invalid '${coll1}' id: '${id1}' does not exist`);
        return false;
    }
    // handle case of projects_users where project is not open
    else if (coll === 'projects_users' && !id1Snap.data().open) {
        console.log(`Invalid '${coll1}' id: ${id1} is at capacity`);
        return false;
    }
    // handle case of applications where user is already added to project
    else if (coll === 'applications') {
        const projectsUsersSnap = getDocSnapshotById('projects_users', `${id1}_${id2}`);
        if (projectsUsersSnap.exists()) {
            console.log(`Invalid 'id combination: user is already added to project'`);
            return false;
        }
    }
    // handle case where id2 does not exist in coll2
    else if (!id2Snap.exists()) {
        console.log(`Invalid '${coll2}' id: '${id2}' does not exist`);
        return false;
    }
    // handle case where id1_id2 already exists in coll
    else if (collSnap.exists()) {
        console.log(`Invalid id1 id2 combo: '${id1}_${id2}' already exists in '${coll}'`);
        return false;
    }
    // all tests passed, return true
    else {
        return true;
    }
}

const incrementCensusAndClose = async (id) => {
    /*
    DESCRIPTION:    increments project census and closes project if necessary

    INPUT:          id (string): document ID of project being updated

    RETURN:         new coll document snapshot
    */
    // get project snapshot to determine new census and if it needs closed
    const projectSnap = await getDocSnapshotById('projects', id);
    // create update payload for incremented census
    const payload = {
        census: projectSnap.data().census + 1,
    }
    // handle case where project needs closed
    const payloadNeedsUpdated = projectSnap.data().census === projectSnap.data().capacity - 1;
    if (payloadNeedsUpdated){
        payload.open = false;
    }
    const projectSnapNew = await updateDoc('projects', id, payload);
    console.log(`Updated 'projects' document id '${id}' census to ${projectSnapNew.data().census}`);
    if (payloadNeedsUpdated) {
        console.log(`Closed 'projects' document id '${id}'`);
    }
    return projectSnapNew;
}

const incrementLikes = async (id) => {
    /*
    DESCRIPTION:    increments project likes

    INPUT:          id (string): document ID of project being updated

    RETURN:         new coll document snapshot
    */
    // get project snapshot to determine new census and if it needs closed
    const projectSnap = await getDocSnapshotById('projects', id);
    // create update payload for incremented census
    const payload = {
        likes: projectSnap.data().likes + 1,
    }
    // update project
    const projectSnapNew = await updateDoc('projects', id, payload);
    console.log(`Updated 'projects' document id '${id}' likes to ${projectSnapNew.data().likes}`);
    return projectSnapNew;
}

const createAssociationHelper = {
    'projects_users': {coll1: 'projects', coll2: 'users', field1: 'project_id', field2: 'user_id'},
    'projects_technologies': {coll1: 'projects', coll2: 'technologies', field1: 'project_id', field2: 'technology_id'},
    'users_technologies': {coll1: 'users', coll2: 'technologies', field1: 'user_id', field2: 'technology_id'},
    'applications': {coll1: 'projects', coll2: 'users', field1: 'project_id', field2: 'user_id'},
    'likes': {coll1: 'projects', coll2: 'users', field1: 'project_id', field2: 'user_id'},
};

/*
    READ
*/

const readAllObjects = async (coll, deep = false) => {
    /*
    DESCRIPTION:    retrieves all documents in the specified collection and
                    returns an array of custom objects.

    INPUT:          coll (string): collection to get documents from

                    deep (boolean): indicates whether objects association
                    properties should be populated. If no argument is entered,
                    returned objects will be shallow (no association arrays
                    populated)

    RETURN:         array of custom objects ([Project], [User], etc)
    */
    // handle case of invalid collection
    if (!collectionIsValid(coll)) return -1;
    // get collection snapshot and build objects
    const collSnap = await getCollectionSnapshot(coll);
    return await buildObjects(coll, collSnap, deep);
}

const readObjectById = async (coll, id, deep = false) => {
    /*
    DESCRIPTION:    retrieves document in the specified collection and returns
                    a custom object.

    INPUT:          coll (string): collection to get document from

                    id (string) : document ID of desired application

                    deep (boolean): indicates whether object's association
                    properties should be populated. If no argument is entered,
                    returned object will be shallow (no association arrays
                    populated)

    RETURN:         custom object (Project, User, etc)
    */
                        // handle case of invalid collection
    if (!collectionIsValid(coll)) return -1;
    // get document snapshot and build object
    const docSnap = await getDocSnapshotById(coll, id);
    return await buildObject(coll, docSnap, deep);
}

const readObjectsByCriteria = async (coll, field, criteria, deep = false) => {
        /*
    DESCRIPTION:    retrieves documents from specified collection, subject to
                    specified criteria. E.g.,
                    readDocsByCriteria('applications', 'owner_id', 'myId')
                    translates to get all applications where owner_id field
                    equals 'myId'

    INPUT:          coll (string): collection to get document IDs from

                    field (string): field to compare criteria against
    
                    criteria (value): value to compare against field for
                    equality

                    deep (boolean): indicates whether object's association
                    properties should be populated. If no argument is entered,
                    returned object will be shallow (no association arrays
                    populated)

    RETURN:         array of objects
    */
    // get query snapshot
    const querySnap = await getCollectionSnapshotByCriteria(coll, field, '==', criteria);
    // handle case of invalid collection
    if (!collectionIsValid(coll)) return -1;
    // handle case of valid collection, build array of IDs from query snapshot
    return buildObjects(coll, querySnap, deep);
}

const readDocIdsByCriteria = async (coll, field, criteria) => {
        /*
    DESCRIPTION:    retrieves document IDs from specified collection, subject
                    to specified criteria. E.g.,
                    readDocIdsByCriteria('applications', 'owner_id', 'myId')
                    translates to get all application IDs where owner_id field
                    equals 'myId'

    INPUT:          coll (string): collection to get document IDs from

                    field (string): field to compare criteria against
    
                    criteria (value): value to compare against field for
                    equality

    RETURN:         array IDs in string format
    */
    // get query snapshot
    const querySnap = await getCollectionSnapshotByCriteria(coll, field, '==', criteria);
    // build array of IDs from query snapshot
    return querySnap.docs.map(doc => doc.id);
}

const readAllDocs = async (coll) => {
    /*
    DESCRIPTION:    retrieves all Firebase documents for specified collection

    INPUT:          coll (string): collection to get documents from

    RETURN:         array of Firebase documents with ID included
    */
    // get collection snapshot
    const collSnap = await getCollectionSnapshot(coll);
    // handle case of empty collection snapshot
    if (collSnap.empty) return [];
    // handle case of non-empty collection
    return collSnap.docs.map((doc) => {
        return {...doc.data(), id: doc.id};
    });
}

const readAssociationObjectsByType = async (assocColl, assocField, assocId, coll, field, deep = false) => {
    /*
    DESCRIPTION:    returns an array of associations based on arguments passed.
                    Note, this function is not for the feint of heart :P

    INPUT:          assocColl (string): association collection that stores
                    the relationship

                    assocField (string): field pertaining to the document you
                    want to get associations for. E.g., if the user wants
                    projects by user => assocField = user_id

                    assocId (string): document ID of the document user desires
                    associations for

                    coll (string): collection where the associations live.
                    If the user wants projects by user => coll = 'projects'

                    field (string): field in assocColl pertaining to the
                    document ID of the associations

    RETURN:         array of objects
    */   
    // get query snapshot from association collection
    const querySnap = await getCollectionSnapshotByCriteria(assocColl, assocField, '==', assocId);
    // get document snapshots from original collection
    const docSnaps = await Promise.all(querySnap.docs.map((doc) => {
        return getDocSnapshotById(coll, doc.data()[field]);
    }));
    // build objects from document snapshots
    const objects = await Promise.all(docSnaps.map((doc) => {
        return buildObject(coll, doc, deep);
    }));
    // return objects to calling function
    return objects
}

// helpers, don't export

const buildObjects = async (coll, collSnap, deep = false) => {
    /*
    DESCRIPTION:    builds array of appropriate objects based on collection
                    passed and collection snapshot

    INPUT:          coll (string): collection to get documents from

                    collSnap (collectionSnapshot): collectionSnapshot

                    deep (boolean): indicates whether objects association
                    properties should be populated. If no argument is entered,
                    returned objects will be shallow (no association arrays
                    populated)

    RETURN:         array of Project, User, or Technology objects
    */
    // build array of objects to return to the user
    const objects =  await Promise.all(collSnap.docs.map((doc) => {
        return buildObject(coll, doc, deep);
    }));
    return objects;
}

const buildObject = async (coll, doc, deep = false) => {
    /*
    DESCRIPTION:    builds appropriate object based on collection passed and
                    document from collection snapshot

    INPUT:          coll (string): collection to get documents from

                    doc (documnent): document from collectionSnapshot's docs
                    property

                    deep (boolean): indicates whether object's association
                    properties should be populated. If no argument is entered,
                    returned object will be shallow (no association arrays
                    populated)

    RETURN:         Project, User, Technology, or Application object
    */
    // handle case of 'projects' collection
    if (coll === 'projects') {
        const project = Project.fromDocSnapshot(doc.id, doc);
        // if user wants deep object, populate associations
        if (deep) await populateAssociations('projects', project);
        return project;
    }
    // handle case of 'users' collection
    else if (coll === 'users') {
        const user = User.fromDocSnapshot(doc.id, doc);
        // if user wants deep object, populate associations
        if (deep) await populateAssociations('users', user);
        return user;
    }
    // handle case of 'technologies' collection
    else if (coll === 'technologies') {
        return Technology.fromDocSnapshot(doc.id, doc);
    }
    // handle case of 'applications' collection
    else if (coll === 'applications') {
        const application = Application.fromDocSnapshot(doc.id, doc);
        // if user wants deep object, populate associations
        if (deep) await populateAssociations('applications', application);
        return application;
    }
}

const collectionIsValid = async (coll) => {
    /*
    DESCRIPTION:    determines whether coll is either 'projects', 'users', or
                    'technologies', or 'applications'

    INPUT:          coll (string): collection to get documents from

    RETURN:         boolean indication of whether collection argument passed
                    is valid
    */
    const colls = ['projects', 'users', 'technologies', 'applications'];
    if (!colls.includes(coll)) {
        console.log(`Invalid collection: please use 'projects', 'users', 'technologies', or 'applications'`);
        return false;
    }
    // all tests passed, return true to indicate valid collection
    return true;
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

const populateAssociations = async (coll, object) => {
    /*
    DESCRIPTION:    populates passed object's association properties

    INPUT:          coll (string): collection to get documents from

                    object (object): object whose associations need populated

    RETURN:         NA - alters original object passed
    */
    // handle case of invalid collection
    if (!collectionIsValid(coll)) return -1;
    // handle Project object
    if (coll === 'projects') {
        [object.owner, object.users, object.technologies] = await Promise.all([
            readObjectById('users', object.ownerId, false), // cyclical call, be careful with this
            readAssociationObjectsByType('projects_users', 'project_id', object.id, 'users', 'user_id', false),
            // getUsersByProjectId(object.id),
            readAssociationObjectsByType('projects_technologies', 'project_id', object.id, 'technologies', 'technology_id', false)
            // getTechnologiesByProjectId(object.id)
        ]);
    }
    // handle User object
    else if (coll === 'users') {
        [object.technologies, object.projects] = await Promise.all([
            readAssociationObjectsByType('users_technologies', 'user_id', object.id, 'technologgies', 'technology_id', false),
            // getTechnologiesByUserId(object.id),
            readAssociationObjectsByType('projects_users', 'user_id', object.id, 'projects', 'project_id', false)
            // getProjectsByUserId(object.id),
        ]);
    }
    // handle Technology object, do nothing
    else if (coll === 'technologies') return object;
    // handle Application object
    else {
        [object.project, object.user, object.owner] = await Promise.all([
            readObjectById('projects', object.projectId, false),
            readObjectById('users', object.userId, false),
            readObjectById('users', object.ownerId, false)
        ]);
    }
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
        console.log(`Updated '${coll}' document '${newDocSnap.id}'`);
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

const deleteAssociationByIds = async (coll, id1, id2) => {
    /*
    DESCRIPTION:    deletes association document for provided collection. Also,
                    updates project document if removing user from project

    INPUT:          coll (string): name of Firebase ASSOCIATION collection
                    where document is stored

                    id1 (string): document ID from first table being associated

                    id2 (string): document ID from second table being
                    associated

    RETURN:         NA
    */
    // user helper object in obtaining associated collection names
    const coll1 = deleteAssociationHelper[coll].coll1;
    const coll2 = deleteAssociationHelper[coll].coll2;
    // handle case where input is invalid
    const inputIsValid = await deleteAssociationInputIsValid(coll, coll1, id1, coll2, id2);
    if (!inputIsValid) return -1;
    // handle case inputs are valid 
    // delete association document from Firebase
    const ref = await deleteDocById(coll, `${id1}_${id2}`);
    console.log(`Deleted '${coll}' document with id: ${ref.id}`);
    // handle case of projects_users, decrement project census and (maybe) close
    if (coll === 'projects_users') await decrementCensusByProjectId(id1);
    // handle case of likes, decrement project likes
    if (coll === 'likes') await decrementLikesByProjectId(id1);
    return ref;
}

const deleteAssociationById = async (coll, id) => {
    /*
    DESCRIPTION:    deletes association document for provided collection. Also,
                    updates project document if removing user from project

    INPUT:          coll (string): name of Firebase ASSOCIATION collection
                    where document is stored

                    id (string): document ID of association document to delete

    RETURN:         NA
    */
    // user helper object in obtaining associated collection names
    const coll1 = deleteAssociationHelper[coll].coll1;
    const coll2 = deleteAssociationHelper[coll].coll2;
    // parse association ID for individual IDs
    const [id1, id2] = id.split('_');
    // handle case where input is invalid
    const inputIsValid = await deleteAssociationInputIsValid(coll, coll1, id1, coll2, id2);
    if (!inputIsValid) return -1;
    // handle case inputs are valid 
    // delete association document from Firebase
    const ref = await deleteDocById(coll, `${id1}_${id2}`);
    console.log(`Deleted '${coll}' document with id: ${ref.id}`);
    // handle case of projects_users, decrement project census and (maybe) close
    if (coll === 'projects_users') await decrementCensusByProjectId(id1);
    // handle case of likes, decrement project likes
    if (coll === 'likes') await decrementLikesByProjectId(id1);
    return ref;
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
        const docRef = await deleteAssociationById(coll, id);
        return docRef;
    }
}

const deleteLike = async (projectId, userId) => {
    /*
    DESCRIPTION:    deletes like document for provided projectId and userId.
                    Also, decrements project documents likes total.

    INPUT:          project id and user id in string format

    RETURN:         NA
    */
    // get document snapshots for invalid input handling
    const projectSnap = await getDocSnapshotById('projects', projectId);
    const userSnap = await getDocSnapshotById('users', userId);
    const likesSnap = await getDocSnapshotById('likes', `${projectId}_${userId}`);
    // handle case where projectId does not exist in Firebase
    if (!projectSnap.exists()) {
        console.log(`invalid projectId: '${projectId}' does not exist`);
        return -1;
    }
    // handle case where userId does not exist in Firebase
    else if (!userSnap.exists()) {
        console.log(`invalid userId: '${userId}' does not exist`);
        return -1;
    }
    // handle case where projectId_userId does not exist in likes
    else if (!likesSnap.exists()) {
        console.log(`invalid projectId userId combination: user '${userId}' has not liked project '${projectId}'`);
        return -1;
    }
    // handle case where inputs are valid 
    else {
        // delete likes document
        const deleteRef = await deleteDocById('likes', `${projectId}_${userId}`);
        console.log(`Deleted likes document with id: ${deleteRef.id}`);
        // get new likes total and build update payload
        const newLikes = projectSnap.data().likes - 1;
        console.log('oldLikes: ', projectSnap.data().likes);
        console.log('newLikes: ', newLikes);
        const payload = {
            likes: newLikes
        }
        // update likes total and indicate success to user
        const docSnapshot = await updateDocument('projects', projectId, payload);
        console.log(`Updated project '${docSnapshot.id}' with ${docSnapshot.data().likes} total likes`);
        return deleteRef;

    }
}

// helpers, don't export

const deleteAssociationHelper = {
    'projects_users': {coll1: 'projects', coll2: 'users', field1: 'project_id', field2: 'user_id'},
    'projects_technologies': {coll1: 'projects', coll2: 'technologies', field1: 'project_id', field2: 'technology_id'},
    'users_technologies': {coll1: 'users', coll2: 'technologies', field1: 'user_id', field2: 'technology_id'},
    'applications': {coll1: 'projects', coll2: 'users', field1: 'project_id', field2: 'user_id'},
    'likes': {coll1: 'projects', coll2: 'users', field1: 'project_id', field2: 'user_id'},
};

const deleteAssociationsHelper = {
    'projects': [
        {coll: 'projects_users', field: 'project_id'},
        {coll: 'projects_technologies', field: 'project_id'},
        {coll: 'likes', field: 'project_id'},
        {coll: 'applications', field: 'project_id'}
    ],
    'users': [
        {coll: 'projects_users', field: 'user_id'},
        {coll: 'projects_technologies', field: 'user_id'},
        {coll: 'likes', field: 'user_id'},
        {coll: 'applications', field: 'user_id'}
    ],
};

const deleteAssociationInputIsValid = async (coll, coll1, id1, coll2, id2) => {
    /*
    DESCRIPTION:    determines whether inputs represent a valid association
                    document to be deleted

    INPUT:          

    RETURN:         boolean indication as to whether input is valid for
                    deleting an association document      
    */
    // get document snapshots for invalid input handling
    const [id1Snap, id2Snap, collSnap] = await Promise.all([
        getDocSnapshotById(coll1, id1),
        getDocSnapshotById(coll2, id2),
        getDocSnapshotById(coll, `${id1}_${id2}`)
    ]);
    // handle case where coll does not exist in database
    if (collSnap.empty) {
        console.log(`Collection '${coll}' does not exist`);
        return false;
    }
    // handle case where id1 does not exist in coll1
    else if (!id1Snap.exists()) {
        console.log(`Invalid '${coll1}' id: '${id1}' does not exist`);
        return false;
    }
    // handle case of projects_users where id2 is the project owner
    else if (coll === 'projects_users' && !id1Snap.data().owner === id2) {
        console.log(`Invalid '${coll2}' id: ${id2} is the project owner`);
        return false;
    }
    // handle case where id2 does not exist in coll2
    else if (!id2Snap.exists()) {
        console.log(`Invalid '${coll2}' id: '${id2}' does not exist`);
        return false;
    }
    // handle case where id1_id2 does not exist in coll
    else if (!collSnap.exists()) {
        console.log(`Invalid id1 id2 combo: '${id1}_${id2}' does not exist in '${coll}'`);
        return false;
    }
    // all tests passed, return true
    return true;
}

const decrementCensusByProjectId = async (id) => {
    /*
    DESCRIPTION:    decrements project census and potentially clears the open
                    flag 

    INPUT:          id (string): id of project to decrement census and
                    potentially clear open flag for         

    RETURN:         NA
    */
    // get project document snapshot for current census
    const projectSnap = await getDocSnapshotById('projects', id);
    // create update payload for decremented census
    const payload = {
        census: projectSnap.data().census - 1,
    }
    // handle case where project needs opened
    const openNeedsUpdated = projectSnap.data().census === projectSnap.data().capacity;
    if (openNeedsUpdated){
        payload.open = true;
    }
    const collSnapNew = await updateDoc('projects', id, payload);
    console.log(`Updated 'projects' document id '${id}' census to ${collSnapNew.data().census}`);
    if (openNeedsUpdated) {
        console.log(`Opened 'projects' document id '${id}'`);
    } 
}

const decrementLikesByProjectId = async (id) => {
    /*
    DESCRIPTION:    decrements project likes

    INPUT:          id (string): id of project to decrement likes for

    RETURN:         NA
    */
    // get project document snapshot for current census
    const projectSnap = await getDocSnapshotById('projects', id);
    // create update payload for decremented census
    const payload = {
        likes: projectSnap.data().likes - 1,
    }
    const collSnapNew = await updateDoc('projects', id, payload);
    console.log(`Updated 'projects' document id '${id}' likes to ${collSnapNew.data().likes}`);
}

export {
    // CREATE
    createAssociation,
    createDoc,
    createDocWithId,
    createNewLike,
    // READ
    readAllDocs,
    readAllObjects,
    readAssociationObjectsByType,
    readDocIdsByCriteria,
    readObjectsByCriteria,
    readObjectById,
    // UPDATE
    updateDoc,
    // DELETE
    deleteAssociationById,
    deleteAssociationByIds,
    deleteDoc,
    deleteDocAndAssociations,
    deleteLike,
}