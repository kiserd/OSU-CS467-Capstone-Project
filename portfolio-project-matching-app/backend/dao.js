import { getDocSnapshotById, addNewDoc, getDocumentById } from '../Firebase/clientApp.ts'
import { Project } from './Project'

const getProjectById = async (projectId) => {
    // get document snapshot and use to initialize project object
    let projectSnap = await getDocSnapshotById('projects', projectId);
    const project = new Project(projectSnap);

    // get owner object from owner reference in snapshot
    const ownerSnap = await getDocSnapshotById('users', project.ownerRef.id);
    // console.log(ownerSnap);
    const ownerData = ownerSnap.data();
    // console.log(ownerData);
    ownerData.id = ownerSnap.id;
    project.owner = ownerData;


    return project;
}


export { getDocSnapshotById, getProjectById }