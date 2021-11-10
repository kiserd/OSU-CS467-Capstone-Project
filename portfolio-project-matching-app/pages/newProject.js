// library
import React, { useState, useEffect } from 'react'
// backend
import { getDocReferenceById } from '../Firebase/clientApp.ts' // NEED TO FIX THIS, SHOULD COME FROM DAO
import {
    createAssociation,
    createDoc,
    getAllTechnologies,
} from '../backend/dao'
// components
import Input from '../components/Input'
import Button from '../components/Button'
import Textarea from '../components/Textarea'
import MultipleInputDropdown from '../components/MultipleInputDropdown'
// context
import { useAuth } from '../context/AuthContext'

let technologies = [{id: 1, name: 'Javascript'}, {id: 2, name: 'C++'}, {id: 3, name: 'React'}, {id: 4, name: 'Flutter'}]

// The Select component from react-select expects the 'options' prop to be an object with keys 'value' and 'label'
technologies = technologies.map((technology) => {
    return {value: technology.name, label: technology.name}
})

const newProject = () => {
    // get auth'd user
    let authUser = useAuth();
    // array of all technologies in the database
    const [allTechnologies, setAllTechnologies] = useState([]);

    // array representing technologies selected to be associated with project
    const [selectedTechnologies, updateSelectedTechnologies] = useState([]);

    // payload to be sent to DB
    const [payload, setPayload] = useState({name: '', description: '', capacity: '', });

    useEffect(() => {
        // tracks whether component mounted, cleanup will assign false
        let isMounted = true
        // get technologies and set state if component mounted
        getAllTechnologies().then((technologies) => {
            // The Select component from react-select expects the 'options' prop to be an object with keys 'value' and 'label'
            technologies = technologies.map((technology) => {
                return {value: technology, label: technology.name};
            });
            // set state if component is still mounted
            if (isMounted) setAllTechnologies(technologies);
        })
        // cleanup function to assign false to isMounted
        return function cleanup() {
            isMounted = false
        }
    }, [])

    const addProject = async (e) => {
        // prevent page from reloading
        e.preventDefault();
        // test payload for missing form data
        if (payload.name === '') {
            alert('Please fill out name field');
        }
        else if (payload.description === '') {
            alert('Please fill out description field');
        }
        else if (payload.capacity === '') {
            alert('Please fill out capacity field');
        }
        // handle case of valid input
        else {
            // get owner reference to populate payload
            const ownerRef = await getDocReferenceById('users', authUser.user.id);
            // determine whether project is open
            const openStatus = payload.capacity === 1 ? false : true;
            // populate payload with data not captured in form
            setPayload({
                ...payload,
                census: 1,
                ownerId: authUser.user.id,
                ownerRef: ownerRef,
                open: openStatus
            });
            // create project document in Firebase
            const projectSnap = await createDoc('projects', payload);
            // create technology associations
            for (const technology of selectedTechnologies) {
                await createAssociation('projects_technologies', projectSnap.id, technology.value.id);
            }
            // create user/owner association
            await createAssociation('projects_users', projectSnap.id, authUser.user.id);
            // flush state
            updateSelectedTechnologies([]);
            setPayload({name: '', description: '', capacity: '', });
            console.log(`Created project id '${projectSnap.id}'`);
        }
    }

    const addTechnology = (e) => {
        console.log('selectedTechnologies pre-update: ', selectedTechnologies);
        updateSelectedTechnologies(e.map(choice => choice.value));
        console.log('selectedTechnologies post-update: ', selectedTechnologies)
    }

    const handleInputChange = e => {
        const { name, value } = e.target;
        setPayload({...payload, [name]: value});
    }

    return (
        <div className='bg-gray-200 p-2 w-full h-full'>
            <div className='w-full mx-auto max-w-md border-2 border-gray-400 rounded-md shadow-md'>
                <div className='p-2 divide-y divide-gray-400'>
                    <form onSubmit={addProject} className='mx-10'>
                        <div className='mb-4 mt-4'>
                            <label htmlFor='name' className='block mb-2'>Project Name:</label>
                            <Input type='text' name='name' placeholder='Project Name' value={payload.name} onChange={handleInputChange} />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor='technologies' className='block mb-2'>Technologies:</label>
                            <MultipleInputDropdown options={allTechnologies} onChange={addTechnology} name='technologies'/>
                        </div>
                        <div className='mb-4'>
                            <label htmlFor='description' className='block mb-2'>Description:</label>
                            <Textarea name='description' placeholder='Description' numRows={6} value={payload.description} onChange={handleInputChange} />
                        </div>
                        <div className='mb-4'>
                            <label htmlFor='capacity' className='block mb-2'>Member Capacity:</label>
                            <Input type='number' name='capacity' placeholder='Capacity' value={payload.capacity} onChange={handleInputChange} />
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
