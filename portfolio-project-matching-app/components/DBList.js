import DBListItem from './DBListItem'

const DBList = ({ docList }) => {
    return (
        <div>
            {docList.map((doc) => {
                return <DBListItem key={doc.id} doc={doc} />
            })}
        </div>
    )
}

export default DBList
