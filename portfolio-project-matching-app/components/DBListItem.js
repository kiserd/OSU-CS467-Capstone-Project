const DBListItem = ({ doc }) => {
    return (
        <div className='flex-column bg-blue-200 my-2 mx-2 border-2 border-black rounded-md'>
            {Object.keys(doc).sort().map((key) => {
                console.log(key, doc[key]);
                return <p>{key}: {doc[key].toString()}</p>
            })}
        </div>
    )
}

export default DBListItem
