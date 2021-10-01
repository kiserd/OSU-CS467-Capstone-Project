import Head from 'next/head'
import Image from 'next/image'
import db from '../Firebase/clientApp.ts'
// import firebase from 'firebase/app'
import { collection, getDocs } from 'firebase/firestore'
// import { useCollection } from 'react-firebase-hooks/firestore'

export default function Home({ docList }) {

  return (
    <div>
      <Head>
        <title>CS467 Portfolio Project</title>
      </Head>
      <p>id: {docList[0].id}</p>
      <p>title: {docList[0].title}</p>
      <p>body: {docList[0].body}</p>
    </div>
  )
}

// yanked from https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context) {
  const dummyCol = collection(db, 'dummy')
  const dummySnapshot = await getDocs(dummyCol)
  // console.log(dummySnapshot.docs)
  const docList = dummySnapshot.docs.map((doc) => {
    var arr = doc.data()
    arr.id = doc.id
    return arr
  });
  console.log(docList)
  return {
    
    // will be passed to the page component as props
    props: {
      docList,
    },
  }
}
