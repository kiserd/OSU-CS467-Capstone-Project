import Head from 'next/head'
import Image from 'next/image'
import DBList from '../components/DBList'
import DBForm from '../components/DBForm'
import { getAllDocs } from '../Firebase/clientApp.ts'

export default function Home({ projectList }) {
  return (
    <div>
      <Head>
        <title>CS467 Portfolio Project</title>
      </Head>
      {/* <DBList docList={projectList} />
      <DBForm /> */}
    </div>
  )
}

// yanked from https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering
export async function getServerSideProps(context) {
  const projectList = await getAllDocs('projects')
  return {
    
    // will be passed to the page component as props
    props: {
      projectList,
    },
  }
}
