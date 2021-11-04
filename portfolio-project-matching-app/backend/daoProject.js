import {
    addNewDoc,
    addNewDocWithId,
    deleteDocById,
    getCollectionSnapshot,
    getCollectionSnapshotByCriteria,
    getDocSnapshotById } from '../Firebase/clientApp.ts'
import { User } from '../models/User'
import { Project } from '../models/Project'
import { Technology } from '../models/Technology'

/*
    CREATE
*/

const createNewProjectDoc = async (project) => {
    /*
    DESCRIPTION:    creates new project document in Firebase Firestore Database
                    based on project object provided. Similar to
                    INSERT INTO 'projects'. Note, only project document is
                    created, not associations.

    INPUT:          Project object populated with data to be added in new
                    document

    RETURN:         NA
    */
    // get reference to owner user document
    const ownerRef = getOwnerByUserId(project.ownerId);
    // build object to be added to Firebase as a project document
    const projectObj = {
        name: project.name,
        description: project.description,
        capacity: project.capacity.toInt(),
        census: project.census.toInt(),
        open: project.open,
        likes: project.likes.toInt(),
        owner: ownerRef,
        ownerId: project.ownerId
    };
    // add project document to Firebase
    const newDocRef = await addNewDoc('projects', projectObj);
    console.log(`Created project document with id: ${newDocRef.id}`);
}

const createNewProjectsUsersDoc = async (projectId, userId) => {
    /*
    DESCRIPTION:    creates new projects_users document for provided project id
                    and user id.

    INPUT:          project id and user id in string format

    RETURN:         NA
    */
    // get document snapshots for invalid input handling
    const projectSnap = await getDocSnapshotById('projects', projectId);
    const userSnap = await getDocSnapshotById('users', userId);
    const projectsUsersSnap = await getDocSnapshotById('projects_users', `${projectId}_${userId}`);
    // handle case where projectId does not exist in Firebase
    if (!projectSnap.exists()) {
        console.log(`invalid projectId: '${projectId}' does not exist`);
    }
    // handle case where userId does not exist in Firebase
    else if (!userSnap.exists()) {
        console.log(`invalid userId: '${userId}' does not exist`);
    }
    // handle case where projectId_userId already exists in projects_technologies
    else if (projectsUsersSnap.exists()) {
        console.log(`invalid projectId userId combination: '${projectId}_${userId}' already exists`);
    }
    // handle case inputs are valid 
    else {
        // build object to send to Firebase
        const projectsUsersObj = {
            project_id: projectId,
            user_id: userId
        }
        const newDocRef = await addNewDocWithId('projects_users', `${projectId}_${userId}`, projectsUsersObj);
        console.log(`Created projects_users document with id: ${newDocRef.id}`);
    }
}

const createNewProjectsTechnologiesDoc = async (projectId, technologyId) => {
    /*
    DESCRIPTION:    creates new projects_technologies document for provided
                    project id and technology id.

    INPUT:          project id and technology id in string format

    RETURN:         NA
    */
    // get document snapshots for invalid input handling
    const projectSnap = await getDocSnapshotById('projects', projectId);
    const technologySnap = await getDocSnapshotById('technologies', technologyId);
    const projectsTechnologiesSnap = await getDocSnapshotById('projects_technologies', `${projectId}_${technologyId}`);
    // handle case where projectId does not exist in Firebase
    if (!projectSnap.exists()) {
        console.log(`invalid projectId: '${projectId}' does not exist`);
    }
    // handle case where technologyId does not exist in Firebase
    else if (!technologySnap.exists()) {
        console.log(`invalid technologyId: '${technologyId}' does not exist`);
    }
    // handle case where projectId_userId already exists in projects_technologies
    else if (projectsTechnologiesSnap.exists()) {
        console.log(`invalid projectId technologyId combination: '${projectId}_${technologyId}' already exists`);
    }
    // handle case inputs are valid 
    else {
        // build object to send to Firebase
        const projectsTechnologiesObj = {
            project_id: projectId,
            technology_id: technologyId
        }
        const newDocRef = await addNewDocWithId('projects_technologies', `${projectId}_${technologyId}`, projectsTechnologiesObj);
        console.log(`Created projects_technologies document with id: ${newDocRef.id}`);
    }
}

/*
    READ
*/

const getAllProjects = async () => {
    /*
    DESCRIPTION:    retrieves all projects in the 'projects' collection and
                    returns an array of Project objects. Note, the users &
                    technologies associated with the projects will contain
                    references to their associated objects.

    INPUT:          NA

    RETURN:         array of Project objects
    */
    // get snapshot of projects collection
    const collectionSnap = await getCollectionSnapshot('projects');

    // loop through documents in the snapshot, adding Project objects to array
    const projects = [];
    for (const doc of collectionSnap.docs) {
        const project = Project.fromDocSnapshot(doc.id, doc);
        // populate owner, users, and technologies fields
        project.owner = await getOwnerByUserId(project.ownerId);
        project.users = await getUsersByProjectId(project.id);
        project.technologies = await getTechnologiesByProjectId(project.id);
        projects.push(project);
    }
    return projects;
}

const getProjectById = async (projectId) => {
    /*
    DESCRIPTION:    retrieves project data for specified project document ID.
                    It is worth noting that the Project object will only
                    contain data associated at the project level. The objects
                    describing associated users & technologies will contain
                    references.

    INPUT:          desired project document ID in string format

    RETURN:         project object containing data associated with project
                    document ID passed as argument
    */
    // get project doc snapshot and use to initialize project object
    const projectSnap = await getDocSnapshotById('projects', projectId);
    
    // handle case where projectId is valid
    if (projectSnap.exists()){
        const project = Project.fromDocSnapshot(projectSnap.id, projectSnap);

        // populate technologies, users, and owner association fields
        project.owner = await getOwnerByUserId(project.ownerId);
        project.users = await getUsersByProjectId(project.id);
        project.technologies = await getTechnologiesByProjectId(project.id);

        return project;
    }
    // handle case where projectId is invalid
    else {
        console.log(`invalid projectId: '${projectId}' does not exist`);
    }
}

const getOwnerByUserId = async (userId) => {
    /*
    DESCRIPTION:    retrieves owner User object associated with specified
                    project ID

    INPUT:          desired project document ID in string format

    RETURN:         User object associated with owner of indicated project.
                    Note, User object associations will not be populated
    */
    // get owner info from users docRef, build User object and add to project
    const ownerSnap = await getDocSnapshotById('users', userId);
    const owner = new User(ownerSnap.id, ownerSnap);
    return owner;
}

const getTechnologiesByProjectId = async (projectId) => {
    /*
    DESCRIPTION:    retrieves technologies associated with specified project ID

    INPUT:          desired project document ID in string format

    RETURN:         array of Technology objects associated with project
    */
    // get filtered collection snapshot
    const projectsTechnologiesSnap = await getCollectionSnapshotByCriteria('projects_technologies', 'project_id', '==', projectId);

    // loop through associated documents, adding Technology objects to array
    const technologies = [];
    for (const doc of projectsTechnologiesSnap.docs) {
        const technologyRef = await getDocSnapshotById('technologies', doc.data().technology_id);
        const technology = new Technology(technologyRef.id, technologyRef);
        technologies.push(technology);
    }
    return technologies;
}

const getUsersByProjectId = async (projectId) => {
    /*
    DESCRIPTION:    retrieves users associated with specified project ID

    INPUT:          desired project document ID in string format

    RETURN:         array of User objects associated with project
    */
    // get filtered collection snapshot
    const projectsUsersSnap = await getCollectionSnapshotByCriteria('projects_users', 'project_id', '==', projectId);
    
    // loop through associated documents, adding User objects to array
    const users = [];
    for (const doc of projectsUsersSnap.docs) {
        const userRef = await getDocSnapshotById('users', doc.data().user_id);
        const user = new User(userRef.id, userRef);
        users.push(user);
    }
    return users;
}

/*
    UPDATE
*/

//  todo

/*
    DELETE
*/

const deleteProjectsUsersDoc = async (projectId, userId) => {
    /*
    DESCRIPTION:    deletes document associating provided projectId and userId

    INPUT:          project id and user id in string format

    RETURN:         NA
    */
    // get document snapshots for invalid input handling
    const projectSnap = await getDocSnapshotById('projects', projectId);
    const userSnap = await getDocSnapshotById('users', userId);
    const projectsUsersSnap = await getDocSnapshotById('projects_users', `${projectId}_${userId}`);
    // handle case where projectId does not exist in Firebase
    if (!projectSnap.exists()) {
        console.log(`invalid projectId: '${projectId}' does not exist`);
    }
    // handle case where userId does not exist in Firebase
    else if (!userSnap.exists()) {
        console.log(`invalid userId: '${userId}' does not exist`);
    }
    // handle case where projectId_userId already exists in projects_technologies
    else if (!projectsUsersSnap.exists()) {
        console.log(`invalid projectId userId combination: '${projectId}_${userId}' does not exist`);
    }
    // handle case inputs are valid 
    else {
        const deleteRef = await deleteDocById('projects_users', `${projectId}_${userId}`);
        console.log(`Deleted projects_technologies document with id: ${deleteRef.id}`);
    }
}

export {
    createNewProjectDoc,
    createNewProjectsUsersDoc,
    createNewProjectsTechnologiesDoc,
    deleteProjectsUsersDoc,
    getAllProjects,
    getOwnerByUserId,
    getProjectById,
    getTechnologiesByProjectId,
    getUsersByProjectId,
}