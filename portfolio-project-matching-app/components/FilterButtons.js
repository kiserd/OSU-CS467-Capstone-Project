import Button from './Button'

const FilterButtons = ({ category, choices, onClick }) => {
    const toggleFilter = (choice) => {
        // todo
    }
    return (
        <div>
            <div className='text-lg'>
                {category}
            </div>
            <div classname='flex flex-wrap'>
                {choices.map((choice) => {
                    return <Button key={choice.id} type='btnGeneral' text={choice.name} onClick={() => onClick(choice)} />
                })}
            </div>
        </div>
    )
}

export default FilterButtons
