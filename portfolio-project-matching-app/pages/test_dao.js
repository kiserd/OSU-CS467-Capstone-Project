import { useEffect } from 'react'
import {
    createApplication,
    createAssociation,
    createDoc,
    createNewLike,
    createNewProjectDoc,
    createNewProjectsTechnologiesDoc,
    createNewProjectsUsersDoc,
    createNewUserDoc,
    deleteAssociation,
    deleteDoc,
    deleteDocAndAssociations,
    deleteLike,
    deleteProjectsUsersDoc,
    deleteUserDoc,
    getProjectById,
    readAllDocs,
    readApplicationsById,
    readDocIdsByCriteria,
    updateDoc,
    updateProject,
} from '../backend/dao'
import { Project } from '../models/Project'
import { User } from '../models/User'

const test_createProject = () => {
    const runSomeFunc = async () => {
        // const projectId = 'mfDi4Ijwt9GDUsqAppQc';
        // const userId = 'C7UvzLR6Dj1g45QV6q4B';
        // await createNewProjectsUsersDoc(projectId, userId);

        // const projectId = 'mfDi4Ijwt9GDUsqAppQc';
        // const userId = 'C7UvzLR6Dj1g45QV6q4B';      
        // await deleteProjectsUsersDoc(projectId, userId);  

        // const projectId = '6AqEuYkqrsArfuUEIOCQ';
        // const technologyId = 'X5S4dzoet7xCwTDwce4J';
        // await createNewProjectsTechnologiesDoc(projectId, technologyId);

        // const projectId = '6AqEuYkqrsArfuUEIOCQ';
        // const technologyId = 'GjGjYTX2uIRrfKrLpSID';
        // await createNewProjectsTechnologiesDoc(projectId, technologyId);

        /* 
            project CREATE / DELETE
        */

        // const coll = 'projects'
        // const payload = {
        //     name: 'Silly Project',
        //     description: 'Helps users carry out all sorts of silly tasks. Tasks can be planned for silly days and silly times',
        //     capacity: 7,
        //     census: 1,
        //     open: true,
        //     likes: 25,
        //     ownerId: 'Ipru4NtHrmGja7zl26Un',
        // };
        // await createDoc(coll, payload);

        // const coll = 'projects_technologies';
        // const id = 'Oyj9gA5FcCeUFq05Pjdk_X5S4dzoet7xCwTDwce4J';
        // await deleteDoc(coll, id);

        // const projectId = 'pLBXDJiDoasB3RXaZ70Y';
        // const userId = 'NPpoT9FquOywcmJ5k8m2';
        // await createNewLike(projectId, userId);

        // const projectId = 'lvaaHKqTrt4QWr3rbEXI';
        // const userId = 'C7UvzLR6Dj1g45QV6q4B';
        // await deleteLike(projectId, userId);

        // const id = 'C7UvzLR6Dj1g45QV6q4B';
        // const coll = 'users';
        // const payload = {introduction: 'My new silly intro'};
        // await updateDoc(coll, id, payload);

        /*
            user CREATE / DELETE
        */

        // const payload = {
        //     email: 'russ.wilson@seahawks.org',
        //     username: 'goBadgers',
        //     introduction: 'Love throwing and coding'
        // };
        // const coll = 'users';
        // await createDoc(coll, payload)

        // const coll = 'users';
        // const id = '8IrjMsm3hyJycTbLxrUy';
        // await deleteDoc(coll, id)

        /*
            association CREATE / DELETE
        */
        
        // const projectId = '6AqEuYkqrsArfuUEIOCQ';
        // const userId = 'PdJa7Nq3LJCbEOFxA2Vj';
        // await createAssociation('projects_users', projectId, userId);

        // const projectId = '8DubXEKajkhmy7l3sRdV';
        // const userId = '8Ro56x6vPshn2E5XFI2CNfZH5Kg1';
        // await deleteAssociation('projects_users', projectId, userId); 

        // const projectId = 'lvaaHKqTrt4QWr3rbEXI';
        // const userId = '8Ro56x6vPshn2E5XFI2CNfZH5Kg1';
        // await createApplication(projectId, userId);

        // await deleteDoc('applications', '6AqEuYkqrsArfuUEIOCQ_0ko4TWBnkjPdpqqnbdCTnjMmROB2');

        // const field = 'user_id';
        // const id = '8Ro56x6vPshn2E5XFI2CNfZH5Kg1';
        // const apps = await readApplicationsById(field, id);
        // console.log('apps: ', apps);

        // const coll = 'dummy';
        // const field = 'dummy';
        // const criteria = 'dummy';
        // const ids = await readDocIdsByCriteria(coll, field, criteria);
        // console.log('ids: ', ids);


    }

    useEffect(() => {
        runSomeFunc();
    }, [])

    return (
        <div>
            
        </div>
    )
}

export default test_createProject
