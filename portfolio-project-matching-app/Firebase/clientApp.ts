// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
import { getFirestore, collection, getDocs, addDoc, setDoc } from 'firebase/firestore';
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


const getAllDocs = async (collectionName) => {
  /*
    DESCRIPTION:  gets all documents from provided collection

    INPUT:        string indicating desired collection name. E.g.,
                  getAllDocuments('technologies')

    RETURN:       a list of all documents in collection indicated
  */
  const coll = collection(db, collectionName);
  const docSnapshot = await getDocs(coll);
  const docSnapshotList = docSnapshot.docs.map((doc) => {
    var arr = doc.data()
    arr.id = doc.id
    return arr
  });
  return docSnapshotList;
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
  console.log('Document written with ID: ', docRef.id);
}

// export
export { db, firebaseApp, getAllDocs, addNewDoc };
