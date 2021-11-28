import React from 'react'
import Select from 'react-select'

const MultipleInputDropdown = ({options, onChange, name}) => {
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
        // backgroundColor: '#e9d8a6',
        borderLeft: '1px solid #005f73',
        borderTop: '1px solid #005f73',
        borderBottom: '1px solid #005f73',
        borderTopLeftRadius: '0.375rem',
        borderBottomLeftRadius: '0.375rem',
      }),
      multiValueRemove: (base) => ({
        ...base,
        // backgroundColor: '#e9d8a6',
        color: '#ae2012',
        borderRight: `1px solid #005f73`,
        borderTop: `1px solid #005f73`,
        borderBottom: `1px solid #005f73`,
        borderTopRightRadius: '0.375rem',
        borderBottomRightRadius: '0.375rem',
        ':hover': {
          backgroundColor: '#ae2012',
          color: 'white',
        },
        
      }),
    }

    return (
        <Select 
          instanceId='selected-value'
          name={name} 
          options={options} 
          onChange={onChange} 
          isMulti 
          isClearable 
          isSearchable 
          styles={customStyles} 
          theme={theme}
        />
    )
}

export default MultipleInputDropdown
