import { getDocSnapshotById, addNewDoc, getCollectionSnapshot, getCollectionSnapshotByCriteria } from '../Firebase/clientApp.ts'
import { User } from '../models/User'
import { Project } from '../models/Project'
import { Technology } from '../models/Technology'

/*
    PROJECT LEVEL QUERIES
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
        // leverage getProjectById() in creating Project objects
        const project = await getProjectById(doc.id);
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
    const project = new Project(projectSnap);

    // get owner info from users docRef, build User object and add to project
    const ownerSnap = await getDocSnapshotById('users', project.ownerId);
    const owner = new User(ownerSnap);
    project.owner = owner;

    // get associated technologies to populate project object's technologies
    project.technologies = await getTechnologiesByProjectId(project.id);

    // get associated users and populate project object's users property
    project.users = await getUsersByProjectId(project.id);

    return project;
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
        const technology = new Technology(technologyRef);
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
        const user = new User(userRef);
        users.push(user);
    }
    return users;
}

/*
    USER LEVEL QUERIES
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
        // leverage getUserById() in creating User objects
        const project = await getUserById(doc.id);
        users.push(project);
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
    const user = new User(userSnap);

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
        const project = new Project(projectRef);
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
        const technology = new Technology(technologyRef);
        technologies.push(technology);
    }
    return technologies;
}

/*
    TECHNOLOGY LEVEL QUERIES
*/

const getAllTechnologies = async () => {
    /*
    DESCRIPTION:    retrieves all technologies in the 'technologies' collection
                    and returns an array of Technology objects.

    INPUT:          NA

    RETURN:         array of Technology objects
    */
    // get snapshot of technologies collection
    const collectionSnap = await getCollectionSnapshot('technologies');

    // loop through documents in the snapshot, adding Technology objects to array
    const technologies = [];
    for (const doc of collectionSnap.docs) {
        // leverage getTechnologyById() in creating Technology objects
        const technology = await getTechnologyById(doc.id);
        technologies.push(technology);
    }
    return technologies;
}

const getTechnologyById = async (technologyId) => {
    /*
    DESCRIPTION:    retrieves technology data for specified technology document
                    ID.

    INPUT:          desired technology document ID in string format

    RETURN:         technology object containing data associated with
                    technology document ID passed as argument
    */
    // get technology doc snapshot and use to initialize technology object
    const technologySnap = await getDocSnapshotById('technologies', technologyId);
    const technology = new Technology(technologySnap);

    return technology;
}

export { getProjectById, getAllProjects, getUserById, getAllUsers, getTechnologyById, getAllTechnologies }