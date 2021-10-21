import { getDocSnapshotById, addNewDoc, getCollectionSnapshot, getCollectionSnapshotByCriteria } from '../Firebase/clientApp.ts'
import { User } from '../models/User'
import { Project } from '../models/Project'
import { Technology } from '../models/Technology'

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

    // initialize each project object and add to array
    const projects = [];
    collectionSnap.docs.forEach((doc) => {
        const project = new Project(doc);
        projects.push(project);
    })

    // populate owner, technologies, and users for each project object
    for (const project of projects) {
        // set owner
        const ownerSnap = await getDocSnapshotById('users', project.ownerId);
        const owner = new User(ownerSnap);
        project.owner = owner;

        // set technologies
        project.technologies = await getTechnologiesByProjectId(project.id);

        // set users
        project.users = await getUsersByProjectId(project.id);
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
    const projectsTechnologiesSnap = await getCollectionSnapshotByCriteria('projects_technologies', 'project_id', '==', projectId);
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
    const projectsUsersSnap = await getCollectionSnapshotByCriteria('projects_users', 'project_id', '==', projectId);
    const users = [];
    for (const doc of projectsUsersSnap.docs) {
        const userRef = await getDocSnapshotById('users', doc.data().user_id);
        const user = new User(userRef);
        users.push(user);
    }
    return users;
}


export { getDocSnapshotById, getProjectById, getAllProjects }