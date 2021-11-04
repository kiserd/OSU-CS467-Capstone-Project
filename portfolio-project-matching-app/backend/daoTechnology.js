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

// todo

/*
    READ
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
        // create Technology object and push to array
        const technology = new Technology(doc.id, doc)
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
    const technology = new Technology(technologySnap.id, technologySnap);

    return technology;
}

/*
    UPDATE
*/

//  todo

/*
    DELETE
*/

// todo

export {
    getAllTechnologies,
    getTechnologyById,
}