const DBListItem = ({ doc }) => {
    return (
        <div className='flex-column bg-blue-200 my-2 mx-2 border-2 border-black rounded-md'>
            <p>id: {doc.id}</p>
            <p>title: {doc.title}</p>
            <p>body: {doc.body}</p>
        </div>
    )
}

export default DBListItem
