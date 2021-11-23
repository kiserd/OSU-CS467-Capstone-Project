// library
import React, { useState, useEffect } from 'react'
import {
    createAssociation,
    createDoc,
    readAllObjects,
} from '../backend/dao'
// components
import Input from '../components/Input'
import Button from '../components/Button'
import Textarea from '../components/Textarea'
import MultipleInputDropdown from '../components/MultipleInputDropdown'
// context
import { useAuth } from '../context/AuthContext'

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
        readAllObjects('technologies').then((technologies) => {
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
        /*
        DESCRIPTION:    upon submitting the new project form, this function
                        will add the new project (and associations) to Firebase

        INPUT:          e (event): passed implicitly by form onSubmit

        RETURN:         NA
        */
        // prevent page from reloading
        e.preventDefault();
        // test payload for missing form data
        if (payload.name === '' || payload.description === '' || payload.capacity === '') {
            alert('Please fill out entire form');
        }
        // handle case where user is not logged in
        else if (!authUser.user) {
            alert('Please login to create a project');
        }
        // handle case of valid input
        else {
            // populate payload with data not captured in form
            buildAndSetPayload();
            // create project document in Firebase
            const projectSnap = await createDoc('projects', payload);
            // create project/technology associations
            for (const technology of selectedTechnologies) {
                await createAssociation('projects_technologies', projectSnap.id, technology.id);
            }
            // create user/owner association
            await createAssociation('projects_users', projectSnap.id, authUser.user.id);
            // flush state
            updateSelectedTechnologies([]);
            setPayload({name: '', description: '', capacity: '', });
        }
    }

    const buildAndSetPayload = () => {
        /*
        DESCRIPTION:    Populates payload fields not called for explicitly by
                        the form e.g., ownerId, census, etc.

        INPUT:          NA

        RETURN:         NA
        */
        // get open field value by examining capacity
        const openStatus = payload.capacity === 1 ? false : true;
        // build on payload object with values from form
        const newPayload = payload;
        newPayload.census = 0; // createAssociation will increment to 1
        newPayload.capacity = parseInt(newPayload.capacity, 10)
        newPayload.likes = 0;
        newPayload.ownerId = authUser.user.id;
        newPayload.open = openStatus
        // set payload statge
        setPayload(newPayload);
    }

    const addTechnology = (e) => {
        updateSelectedTechnologies(e.map(choice => choice.value));
    }

    const handleInputChange = e => {
        const { name, value } = e.target;
        setPayload({...payload, [name]: value});
    }

    return (
        <div className='background p-2 w-full h-full'>
            <div className='w-full mx-auto max-w-md defaultBorder shadow-md'>
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
                            <Button text='Submit' type='btnPurple'/>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default newProject
