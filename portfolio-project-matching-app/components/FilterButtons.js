// library
import { useState, useEffect } from 'react'
// component
import Button from './Button'

const FilterButtons = ({ category, choices, onAdd, onRemove }) => {
    // declare new state variable indicating available filter choices
    const [availableChoices, setAvailableChoices] = useState([])

    // declare new state variable indicating selected filter choices
    const [selectedChoices, setSelectedChoices] = useState([])

    const addFilter = (choice) => {
        // remove choice from availableChoices
        setAvailableChoices(availableChoices.filter((element) => choice.id !== element.id))
        // add choice to selectedChoices
        setSelectedChoices([...selectedChoices, choice])
        // pass filter choice to parent
        onAdd(choice)
    }

    const removeFilter = (choice) => {
        // remove choice from selectedChoices
        setSelectedChoices(selectedChoices.filter((element) => choice.id !== element.id))
        // add choice to availableChoices
        setAvailableChoices([...availableChoices, choice])
        // pass filter choice to parent
        onRemove(choice)
    }

    useEffect(() => {
        setAvailableChoices(choices)
    }, [choices])

    return (
        <div data-testid='filterButtonsDiv' className=''>
            <div className='text-lg'>
                {category}
            </div>
            <div className='text-sm text-gray-400'>
                {selectedChoices.length !== 0 && 'Remove filters'}
            </div>
            <div data-testid='selectedFiltersDiv'>
                {selectedChoices.map((choice) => {
                    return (
                        <div key={choice.id} className='py-1 pr-2'>
                            <Button type='btnWarning' text={choice.name} onClick={() => removeFilter(choice)} />
                        </div>
                    )
                })}
            </div>
            <div className='text-sm text-gray-400'>
                Choose filters
            </div>
            <div data-testid='availableFiltersDiv' className='flex flex-wrap'>
                {availableChoices.map((choice) => {
                    return (
                        <div key={choice.id} className='py-1 pr-2'>
                            <Button type='btnGeneral' text={choice.name} onClick={() => addFilter(choice)} />
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default FilterButtons
