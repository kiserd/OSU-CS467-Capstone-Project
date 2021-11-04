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
        console.log(`Created projects_technologies document with id: ${newDocRef.id}`);
    }
}

/*
    READ
*/

const getAllUsers = async () => {
    /*
    DESCRIPTION:    retrieves all users in the 'users' collection and
                    returns an array of User objects. Note, the projects &
                    technologies associated with the users will contain
                    references to their associated objects.

    INPUT:          NA

    RETURN:         array of User objects
    */
    // get snapshot of users collection
    const collectionSnap = await getCollectionSnapshot('users');

    // loop through documents in the snapshot, adding User objects to array
    const users = [];
    for (const doc of collectionSnap.docs) {
        // create User object to add to array
        const user = await getUserById(doc.id, doc);
        // populate technologies and projects associations in User object
        user.technologies = await getTechnologiesByUserId(user.id);
        user.projects = await getProjectsByUserId(user.id);
        users.push(user);
    }
    return users;
}

const getUserById = async (userId) => {
    /*
    DESCRIPTION:    retrieves user data for specified user document ID.
                    It is worth noting that the User object will only
                    contain data associated at the User level. The objects
                    describing associated projects & technologies will contain
                    references.

    INPUT:          desired user document ID in string format

    RETURN:         user object containing data associated with user
                    document ID passed as argument
    */
    // get user doc snapshot and use to initialize user object
    const userSnap = await getDocSnapshotById('users', userId);
    const user = new User(userSnap.id, userSnap);

    // get associated projects to populate user object's projects
    user.projects = await getProjectsByUserId(user.id);

    // get associated technologies to populate user object's technologies
    user.technologies = await getTechnologiesByUserId(user.id);

    return user;
}

const getProjectsByUserId = async (userId) => {
    /*
    DESCRIPTION:    retrieves projects associated with specified user ID

    INPUT:          desired user document ID in string format

    RETURN:         array of Project objects associated with user
    */
    // get filtered collection snapshot
    const projectsUsersSnap = await getCollectionSnapshotByCriteria('projects_users', 'user_id', '==', userId);
    
    // loop through associated documents, adding Project objects to array
    const projects = [];
    for (const doc of projectsUsersSnap.docs) {
        const projectRef = await getDocSnapshotById('projects', doc.data().project_id);
        const project = Project.fromDocSnapshot(projectRef.id, projectRef);
        projects.push(project);
    }
    return projects;
}

const getTechnologiesByUserId = async (userId) => {
    /*
    DESCRIPTION:    retrieves technologies associated with specified user ID

    INPUT:          desired user document ID in string format

    RETURN:         array of Technology objects associated with user
    */
    // get filtered collection snapshot
    const projectsTechnologiesSnap = await getCollectionSnapshotByCriteria('users_technologies', 'user_id', '==', userId);

    // loop through associated documents, adding Technology objects to array
    const technologies = [];
    for (const doc of projectsTechnologiesSnap.docs) {
        const technologyRef = await getDocSnapshotById('technologies', doc.data().technology_id);
        const technology = new Technology(technologyRef.id, technologyRef);
        technologies.push(technology);
    }
    return technologies;
}

/*
    UPDATE
*/

// todo

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
    createNewProjectsUsersDoc,
    deleteProjectsUsersDoc,
    getAllUsers,
    getProjectsByUserId,
    getTechnologiesByUserId,
    getUserById,
}