import {
    // CREATE
    addNewDoc,
    addNewDocWithId,
    // READ
    getCollectionSnapshot,
    getCollectionSnapshotByCriteria,
    getDocSnapshotById,
    // DELETE
    deleteDocById,

} from '../Firebase/clientApp.ts'
import {
    getOwnerByUserId,
    getTechnologiesByProjectId,
    getUsersByProjectId,
} from '../backend/daoProject'
import { User } from '../models/User'
import { Project } from '../models/Project'
import { Technology } from '../models/Technology'
import { createDocWithId } from './dao'

/*
    CREATE
*/

const createNewUserDoc = async (user) => {
    /*
    DESCRIPTION:    creates new user document in Firebase Firestore Database
                    based on user object provided. Similar to
                    INSERT INTO 'users'. Note, only user document is
                    created, not associations.

    INPUT:          User object populated with data to be added in new
                    document

    RETURN:         NA
    */
    // build object to be added to Firebase as a user document
    const userObj = {
        email: user.email,
        username: user.username,
        introduction: user.introduction,
    };
    // add user document to Firebase
    const newDocRef = await addNewDoc('users', userObj);
    console.log(`Created user document with id: ${newDocRef.id}`);
}

const createNewUserDocWithId = async (user, id) => {
    /*
    DESCRIPTION:    creates new user document in Firebase Firestore Database
                    based on user object provided. Similar to
                    INSERT INTO 'users'. Note, only user document is
                    created, not associations.

    INPUT:          User object populated with data to be added in new
                    document

    RETURN:         NA
    */
    // build object to be added to Firebase as a user document
    const userObj = {
        email: user.email,
        username: user.username,
        introduction: user.introduction,
    };
    // add user document to Firebase
    const newDocRef = await createDocWithId('users', userObj, id);
}

const createNewUsersTechnologiesDoc = async (userId, technologyId) => {
    /*
    DESCRIPTION:    creates new users_technologies document for provided
                    user id and technology id.

    INPUT:          user id and technology id in string format

    RETURN:         NA
    */
    // get document snapshots for invalid input handling
    const userSnap = await getDocSnapshotById('users', userId);
    const technologySnap = await getDocSnapshotById('technologies', technologyId);
    const usersTechnologiesSnap = await getDocSnapshotById('users_technologies', `${userId}_${technologyId}`);
    // handle case where projectId does not exist in Firebase
    if (!userSnap.exists()) {
        console.log(`invalid userId: '${userId}' does not exist`);
    }
    // handle case where technologyId does not exist in Firebase
    else if (!technologySnap.exists()) {
        console.log(`invalid technologyId: '${technologyId}' does not exist`);
    }
    // handle case where userId_technologyId already exists in users_technologies
    else if (usersTechnologiesSnap.exists()) {
        console.log(`invalid userId technologyId combination: '${userId}_${technologyId}' already exists`);
    }
    // handle case inputs are valid 
    else {
        // build object to send to Firebase
        const usersTechnologiesObj = {
            user_id: userId,
            technology_id: technologyId
        }
        const newDocRef = await addNewDocWithId('users_technologies', `${userId}_${technologyId}`, usersTechnologiesObj);
        console.log(`Created users_technologies document with id: ${newDocRef.id}`);
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

    // use collection snapshot to build "base" array of User objects
    const users = collectionSnap.docs.map(doc => User.fromDocSnapshot(doc.id, doc));
    // loop through User object array and add associations
    await Promise.all(users.map(async (user) => {
        [user.technologies, user.projects] = await Promise.all([
            getTechnologiesByUserId(user.id),
            getProjectsByUserId(user.id),
        ]);
        return user;
    }));
    // return to calling function
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

    // handle case where user does not exist
    if (!userSnap.exists()) {
        console.log(`invalid id: '${userId}' does not exist in 'users'`);
        return -1;
    }
    // handle case where user exists
    else {
        // build "base" User object
        const user = User.fromDocSnapshot(userSnap.id, userSnap);
        // get associated projects to populate user object's projects
        [user.projects, user.technologies] = await Promise.all([
            getProjectsByUserId(user.id),
            getTechnologiesByUserId(user.id)
        ]);
        // return to calling function
        return user;
    }
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

const getDeepProjectsByUserId = async (userId) => {
    /*
    DESCRIPTION:    retrieves projects associated with specified user ID

    INPUT:          desired user document ID in string format

    RETURN:         array of Project objects associated with user along with
                    association arrays populated (users/technologies)
    */
    // get filtered collection snapshot
    const projectsUsersSnap = await getCollectionSnapshotByCriteria('projects_users', 'user_id', '==', userId);
    // get user snapshot for error handling
    const userSnap = await getDocSnapshotById('users', userId);
    // handle case where userId is invalid
    if (!userSnap.exists()) {
        console.log(`userId '${userId}' does not exist in 'users' collection`);
        return -1;
    }
    // handle case where userId is valid
    else {
        // loop through associated documents, adding Project objects to array
        const projects = [];
        for (const doc of projectsUsersSnap.docs) {
            const projectRef = await getDocSnapshotById('projects', doc.data().project_id);
            const project = Project.fromDocSnapshot(projectRef.id, projectRef);
            // populate owner, users, and technologies fields
            [project.owner, project.users, project.technologies] = await Promise.all([
            getOwnerByUserId(project.ownerId),
            getUsersByProjectId(project.id),
            getTechnologiesByProjectId(project.id)
            ]);
            // push to staging array
            projects.push(project);
        }
        return projects;
    }
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
        const technology = Technology.fromDocSnapshot(technologyRef.id, technologyRef);
        technologies.push(technology);
    }
    return technologies;
}

/*
    UPDATE
*/

/*
    DELETE
*/

const deleteUserDoc = async (userId) => {
    /*
    DESCRIPTION:    deletes user document associating userId

    INPUT:          user document id

    RETURN:         NA
    */
    // get document snapshots for invalid input handling
    const userSnap = await getDocSnapshotById('users', userId);
    // handle case where userId does not exist in Firebase
    if (!userSnap.exists()) {
        console.log(`invalid userId: '${userId}' does not exist`);
    }
    // handle case where inputs are valid
    else {
        const deleteRef = await deleteDocById('users', userId);
        console.log(`Deleted users document with id: ${deleteRef.id}`);
    }
}

export {
    // CREATE
    createNewUserDoc,
    createNewUserDocWithId,
    createNewUsersTechnologiesDoc,
    // READ
    getAllUsers,
    getDeepProjectsByUserId,
    getProjectsByUserId,
    getTechnologiesByUserId,
    getUserById,
    // DELETE
    deleteUserDoc,
}