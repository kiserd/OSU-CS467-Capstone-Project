import DBListItem from './DBListItem'

const DBList = ({ docList }) => {
    return (
        <div className='flex-row flex-wrap justify-start max-w-sm max-h-lg'>
            {docList.map((doc) => {
                return <DBListItem key={doc.id} doc={doc} />
            })}
        </div>
    )
}

export default DBList
