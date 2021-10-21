import { getDocSnapshotById, addNewDoc, getDocumentById, getCollectionSnapshotByCriteria } from '../Firebase/clientApp.ts'
import { User } from '../models/User'
import { Project } from '../models/Project'
import { Technology } from '../models/Technology'

const getProjectById = async (projectId) => {
    /*
    DESCRIPTION:    retrieves project data for specified project document ID

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
    const projectsTechnologiesSnap = await getCollectionSnapshotByCriteria('projects_technologies', 'project_id', '==', project.id);
    const technologiesArray = [];
    for (const doc of projectsTechnologiesSnap.docs) {
        const technologyRef = await getDocSnapshotById('technologies', doc.data().technology_id);
        const technology = new Technology(technologyRef);
        technologiesArray.push(technology);
    }
    project.technologies = technologiesArray;

    // get associated users and populate project object's users property
    const projectsUsersSnap = await getCollectionSnapshotByCriteria('projects_users', 'project_id', '==', project.id);
    const usersArray = [];
    for (const doc of projectsUsersSnap.docs) {
        const userRef = await getDocSnapshotById('users', doc.data().user_id);
        const user = new User(userRef);
        usersArray.push(user);
    }
    project.users = usersArray;

    return project;
}


export { getDocSnapshotById, getProjectById }