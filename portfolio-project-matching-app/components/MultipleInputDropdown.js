import React from 'react'
import Select from 'react-select'
import styles from './MultipleInputDropdown.module.css'

const MultipleInputDropdown = ({options, onChange}) => {
    const theme = (theme) => ({
      ...theme,
      borderRadius: '0.375rem',
      colors: {
        ...theme.colors,
        primary: '#9f7aea',
      },
    })

    const customStyles = {
      multiValueLabel: (base) => ({
        ...base,
        border: '1px solid #9f7aea',
        borderRadius: '0.375rem',
      }),
      multiValueRemove: (base) => ({
        ...base,
        backgroundColor: 'white',
        border: `1px solid red`,
        borderRadius: '0.375rem',
        
      }),
    }

    return (
        <Select options={options} onChange={onChange} isMulti isClearable isSearchable styles={customStyles} theme={theme}/>
    )
}

export default MultipleInputDropdown
