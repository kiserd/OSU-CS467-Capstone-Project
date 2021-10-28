import React from 'react'
import Select from 'react-select'

const MultipleInputDropdown = ({options, onChange}) => {
    return (
        <div>
            <Select options={options} onChange={onChange} isMulti isClearable isSearchable />
        </div>
    )
}

export default MultipleInputDropdown
