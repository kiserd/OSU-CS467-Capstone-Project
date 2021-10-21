import { getDocSnapshotById, addNewDoc, getDocumentById, getCollectionSnapshotByCriteria } from '../Firebase/clientApp.ts'
import { Project } from './Project'
import { Technology } from './Technology'

const getProjectById = async (projectId) => {
    // get document snapshot and use to initialize project object
    const projectSnap = await getDocSnapshotById('projects', projectId);
    const project = new Project(projectSnap);

    // get owner object from owner reference in snapshot
    const ownerSnap = await getDocSnapshotById('users', project.ownerRef.id);
    const ownerData = ownerSnap.data();
    ownerData.id = ownerSnap.id;
    project.owner = ownerData;

    // get associated technologies to populate project object
    const projectTechnologiesSnap = await getCollectionSnapshotByCriteria('projects_technologies', 'project_id', '==', project.id);
    // console.log(projectTechnologiesSnap.docs);
    const technologiesArray = [];
    for (const doc of projectTechnologiesSnap.docs) {
        const technologyRef = await getDocSnapshotById('technologies', doc.data().technology_id);
        const technology = new Technology(technologyRef);
        console.log(technology);
        technologiesArray.push(technology);
        // console.log(technologyRef);
        // const technologyData = technologyRef.data();
        // console.log(technologyData);
        // technologyData.id = doc.id;
        // technologiesArray.push(technologyData);
    }
    project.technologies = technologiesArray;

    console.log('technologiesArr: ', technologiesArray);


    return project;
}


export { getDocSnapshotById, getProjectById }