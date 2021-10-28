import React, { useState } from 'react'
import Input from '../components/Input'
import Button from '../components/Button'
import Textarea from '../components/Textarea'
import FilterButtons from '../components/FilterButtons'
import { addNewDoc } from '../Firebase/clientApp.ts'
import MultipleInputDropdown from '../components/MultipleInputDropdown'

let technologies = [{id: 1, name: 'Javascript'}, {id: 2, name: 'C++'}, {id: 3, name: 'React'}, {id: 4, name: 'Flutter'}]
technologies = technologies.map((technology) => {
    return {value: technology.name, label: technology.name}
})

const newProject = () => {
    const [selectedTechnologies, updateSelectedTechnologies] = useState([]);

    const addProject = async (e) => {
    e.preventDefault();
    console.log(e.target.technologies);
    let payload = {
        name: e.target.name.value,
        description: e.target.description.value,
        capacity: e.target.capacity.value,
        technologies: selectedTechnologies,
        cencus: 1,
        open: true,
        likes: 0
    }
    console.log(payload)
    // await addNewDoc('projects', payload);
    updateSelectedTechnologies([]);
    }

    const addTechnology = (e) => {
        console.log(selectedTechnologies);
        updateSelectedTechnologies(e.map(a => a.value))
    }

    return (
        <div className='bg-gray-200 p-2 w-full h-full'>
            <div className='w-full mx-auto max-w-xs border-2 border-gray-400 rounded-md shadow-md'>
                <div className='p-2 divide-y divide-gray-400'>
                    <form onSubmit={addProject}>
                        <div className='mb-4 mt-4'>
                            <label for='name' className='block mb-2'>Project Name:</label>
                            <Input type='text' name='name' placeholder='Project Name'/>
                        </div>
                        <div className='mb-4'>
                            <label for='technologies' className='block mb-2'>Technologies:</label>
                            {/* FIX THIS: Temporary Solution. Need more robust way of selecting technologies*/}
                            <MultipleInputDropdown options={technologies} onChange={addTechnology} />
                            {/* <FilterButtons choices={technologies} onClick={addTechnology}/> */}
                        </div>
                        <div className='mb-4'>
                            <label for='description' className='block mb-2'>Description:</label>
                            <Textarea name='description' placeholder='Description' numRows={6}/>
                        </div>
                        <div className='mb-4'>
                            <label for='capacity' className='block mb-2'>Member Capacity:</label>
                            <Input type='number' name='capacity' placeholder='Capacity' />
                        </div>
                        <div className='mb-2'>
                            <Button text='Submit'/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default newProject
