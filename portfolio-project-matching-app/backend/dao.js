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

const createApplication = async (projectId, userId) => {
    /*
    DESCRIPTION:    creates new application to a project

    INPUT:          userId (string): document ID for user applying to project

                    projectId (string): document ID for project being applied
                    to

    RETURN:         new application document snapshot
    */
    // utilize helper function in validating inputs
    const inputIsValid = await createApplicationInputIsValid(projectId, userId);
    // handle case of invalid inputs
    if (!inputIsValid) return -1;
    // handle case inputs are valid 
    else {
        // get project document snapshot for ownerId
        const projectSnap = await getDocSnapshotById('projects', projectId);
        // build application payload to send to Firebase
        const payload = {
            project_id: projectId,
            user_id: userId,
            owner_id: projectSnap.data().ownerId,
            open: true,
            response: 'pending'

        };
        const newDocSnap = await addNewDocWithId('applications', `${projectId}_${userId}`, payload);
        console.log(`Created 'applications' document with id: ${newDocSnap.id}`);
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
    // handle case where coll does not exist in database
    if (!createAssociationInputIsValid(coll, id1, coll1, id2, coll2)) {
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
            // increment project census and close if necessary
            await incrementProjectCensusAndClose(coll1, id1);
        }
        return newDocSnap;
    }
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

const createApplicationInputIsValid = async (projectId, userId) => {
    /*
    DESCRIPTION:    determines whether userId and projectId are valid inputs
                    for creating an application

    INPUT:          projectId (string): document ID for project being applied
                    to

                    userId (string): document ID for user applying to project

    RETURN:         boolean indication as to whether the inputs are valid
    */
    // get document snapshots for error handling
    const [userSnap, projectSnap, applicationSnap, projectsUsersSnap] = await Promise.all([
        getDocSnapshotById('projects', projectId),
        getDocSnapshotById('users', userId),
        getDocSnapshotById('applications', `${projectId}_${userId}`),
        getDocSnapshotById('projects_users', `${projectId}_${userId}`)
    ]);
    // handle case where project does not exist
    if (!projectSnap.exists()) {
        console.log(`Invalid 'projects' id: '${projectId}' does not exist`);
        return false;
    }
    // handle case where user does not exists
    else if (!userSnap.exists()) {
        console.log(`Invalid 'users' id: '${userId}' does not exist`);
        return false;
    }
    // handle case where user is already added to project
    else if (projectsUsersSnap.exists()) {
        console.log(`Invalid userId projectId combination: user id '${userId}' is already added to project id '${projectId}'`);
        return false;
    }
    // handle case where user already has applied to project
    else if (applicationSnap.exists()) {
        console.log(`Invalid userId projectId combination: user id '${userId}' has already applied to project id '${projectId}'`);
        return false;
    }
    // all tests passed return true
    return true;
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

const incrementProjectCensusAndClose = async (coll, id) => {
    /*
    DESCRIPTION:    increments project census and closes project if necessary

    INPUT:          coll (string): name of Firebase collection where the
                    document being updated is located

                    id (string): document ID of project being updated

    RETURN:         new coll document snapshot
    */
    // get project snapshot to determine new census and if it needs closed
    const projectSnap = await getDocSnapshotById(coll, id);
    // create update payload for incremented census
    const payload = {
        census: projectSnap.data().census + 1,
    }
    // handle case where project needs closed
    const payloadNeedsUpdated = projectSnap.data().census === projectSnap.data().capacity - 1;
    if (payloadNeedsUpdated){
        payload.open = false;
    }
    const projectSnapNew = await updateDoc(coll, id, payload);
    console.log(`Updated '${coll}' document id '${id}' census to ${projectSnapNew.data().census}`);
    if (payloadNeedsUpdated) {
        console.log(`Closed '${coll}' document id '${id}'`);
    }
    return projectSnapNew;
}

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
            readAssociationsByType('projects_users', 'project_id', object.id, 'users', 'user_id'),
            // getUsersByProjectId(object.id),
            readAssociationsByType('projects_technologies', 'project_id', object.id, 'technologies', 'technology_id')
            // getTechnologiesByProjectId(object.id)
        ]);
    }
    // handle User object
    else if (coll === 'users') {
        [object.technologies, object.projects] = await Promise.all([
            readAssociationsByType('users_technologies', 'user_id', object.id, 'technologgies', 'technology_id'),
            // getTechnologiesByUserId(object.id),
            readAssociationsByType('projects_users', 'user_id', object.id, 'projects', 'project_id')
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

const readAssociationsByType = async (assocColl, assocField, assocId, coll, field, deep = false) => {
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
    const [id1Snap, id2Snap, collSnap] = await Promise.all([
        getDocSnapshotById(coll1, id1),
        getDocSnapshotById(coll2, id2),
        getDocSnapshotById(coll, `${id1}_${id2}`)
    ]);
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
    createApplication,
    createAssociation,
    createDoc,
    createDocWithId,
    createNewLike,
    // READ
    // getAllProjects,
    // getAllTechnologies,
    // getAllUsers,
    // getOwnerByUserId,
    // getProjectById,
    // getDeepProjectsByUserId,
    // getProjectsByUserId,
    // getTechnologiesByProjectId,
    // getTechnologiesByUserId,
    // getTechnologyById,
    // getUserById,
    // getUsersByProjectId,
    readAllObjects,
    readAssociationsByType,
    readDocIdsByCriteria,
    readObjectsByCriteria,
    readObjectById,
    // UPDATE
    updateDoc,
    // DELETE
    deleteAssociation,
    deleteDoc,
    deleteDocAndAssociations,
    deleteLike,
}