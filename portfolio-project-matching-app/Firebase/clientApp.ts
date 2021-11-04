// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where } from 'firebase/firestore';
// import { getAnalytics } from "firebase/analytics";
// https://firebase.google.com/docs/web/setup#available-libraries

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

const firebaseApp = initializeApp(firebaseConfig);
const db = getFirestore();
// const analytics = getAnalytics(firebaseApp);

const getDocSnapshotById = async(collectionName, docId) => {
  /*
  DESCRIPTION:  gets snapshot of document from provided collection name with
                provided document ID

  INPUT:        string indicating desired collection name and string indicating
                desired document ID

  RETURN:       snapshot of document with provided document ID
  */
  const docRef = doc(db, collectionName, docId);
  const querySnapshot = await getDoc(docRef);
  return querySnapshot;
}

const getCollectionSnapshot = async (collectionName) => {
  /*
    DESCRIPTION:  gets snapshot of documents from provided collection name

    INPUT:        string indicating desired collection name. E.g.,
                  getAllDocuments('technologies')

    RETURN:       snapshot of documents from specified collection
  */
  const collectionRef = collection(db, collectionName);
  const querySnapshot = await getDocs(collectionRef);
  return querySnapshot;
}

const getCollectionSnapshotByCriteria = async (collectionName, field, operator, condition) => {
  /*
  DESCRIPTION:  gets snapshot of documents from provided collection name based
                on criteria passed

  INPUT:        collectionName: string indicating name of collection
                field: field being compared to criteria
                operator: operator used to compare against condition e.g., '=='
                condition: value given field is being compared against
                Example: getColl...Criteria('projects', 'open', '==', true)

  RETURN:       snapshot of documents from specified collection
  */
  const collectionRef = collection(db, collectionName);
  const q = query(collectionRef, where(field, operator, condition));
  const querySnapshot = await getDocs(q);
  return querySnapshot
}

const addNewDoc = async (collectionName, data) => {
  /*
    DESCRIPTION:  adds a new document with provided data to the specified
                  collection. This function does not perform any input
                  validation - that is currently left to the calling function.

    INPUT:        string indicating desired collection name and data to be
                  added. E.g.,

                  addNewDoc('technologies', {name: _, language: _, ...})
    RETURN:       NA
  */
  const coll = collection(db, collectionName);
  const docRef = await addDoc(coll, data);
  return docRef;
}

const addNewDocWithId = async (collectionName, id, data) => {
  const docRef = setDoc(doc(db, collectionName, id), data);
  return docRef;
}

// Firestore Project object data converter
// SOURCE: https://firebase.google.com/docs/firestore/manage-data/add-data
// looks like this would need to be implemented at the clientApp.ts level
// not sure how to get this to work for a full collection, only a single doc
// const projectConverter = {
//     toFirestore: (project) => {
//         return {
//             id: project.name,
//             name: project.name,
//             description: city.country,
//             capacity: project.capacity,
//             census: project.census,
//             open: project.open,
//             likes: project.likes,
//             owner: project.ownerId
//             };
//     },
//     fromFirestore: (snapshot, options) => {
//         // const data = snapshot.data(options);
//         return new Project(
//             snapshot.id,
//             snapshot.data().name,
//             docSnapshot.data().description,
//             docSnapshot.data().capacity,
//             docSnapshot.data().census,
//             docSnapshot.data().open,
//             docSnapshot.data().likes,
//             docSnapshot.data().ownerId
//         );
//     }
// };

// export
export {
  db,
  firebaseApp,
  getCollectionSnapshot,
  addNewDoc,
  addNewDocWithId,
  getDocSnapshotById,
  getCollectionSnapshotByCriteria
};
