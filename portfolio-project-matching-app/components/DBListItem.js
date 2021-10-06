const DBListItem = ({ doc }) => {
    return (
        <div className='bg-blue-200 my-2'>
            <p>id: {doc.id}</p>
            <p>title: {doc.title}</p>
            <p>body: {doc.body}</p>
        </div>
    )
}

export default DBListItem
