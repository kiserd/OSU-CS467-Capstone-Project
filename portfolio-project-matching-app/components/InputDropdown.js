const InputDropdown = ({ choices, name, onChange }) => {
    return (
        <div>
            <select name={name} onChange={onChange} className='p-2 text-gray-700 border-2 border-gray-200 bg-gray-200 rounded-t-md focus:outline-none hover:border-gray-900 focus:bg-white focus:border-purple-500'>
                {choices.map((choice) => {
                    return <option key={choice.id} value={choice.name}>{choice.name}</option>
                })}
            </select>
        </div>
    )
}

export default InputDropdown
