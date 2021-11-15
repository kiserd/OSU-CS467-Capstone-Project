import { useState, useEffect } from 'react'
import Button from '../components/Button'
import Input from '../components/Input'
import InputDropdown from '../components/InputDropdown'
import Textarea from '../components/Textarea'
import MultipleInputDropdown from '../components/MultipleInputDropdown'
import NewLogin from './NewLogin'
import styles from './ProfileForm.module.css'
import { useAuth } from '../context/AuthContext'
import { updateDoc } from '../backend/dao'

let technologies = [{id: 1, name: 'Javascript'}, {id: 2, name: 'C++'}, {id: 3, name: 'React'}, {id: 4, name: 'Flutter'}]

// The Select component from react-select expects the 'options' prop to be an object with keys 'value' and 'label'
technologies = technologies.map((technology) => {
    return {value: technology.name, label: technology.name}
})

const myProfile = () => {
        let auth = useAuth();
        let [userProfileValues, setUserprofileValues] = useState({
            email: '',
            introduction: '',
            username: '',
            timezone: '',
            technologies: [],
        });
        
        useEffect(()=>{
            setUserprofileValues({...userProfileValues, ...auth.user});
        }, [auth])

        const handleInputChange = e => {
            const { name, value } = e.target;
            setUserprofileValues({...userProfileValues, [name]: value});
        }
    
        const handleSubmit = async (e) => {
            e.preventDefault();
            let userDoc = await updateDoc('users', auth.user.id, userProfileValues);
            console.log("Form submitted");
            console.log(userProfileValues);
        }

        const addTechnology = (e) => {
            const techArray = e.map(a => a.value);
            setUserprofileValues({...userProfileValues, technologies: techArray});
        }
        
        const timezones = [
            {id: 1, name:'Pacific'},
            {id: 2, name:'Mountain'},
            {id: 3, name:'Central'},
            {id: 4, name:'Eastern'}
        ]
    
        return (
            <div>
            { auth && auth.user ? 
                <div className='background p-2 w-full h-full'>
                    <div className='w-full mx-auto max-w-md defaultBorder'>
                        <div className='p-2 divide-y divide-gray-400'>
                            <form onSubmit={handleSubmit} className="mx-10">
                                <div className='mb-4 mt-4'>
                                    <label className={styles.formLabel}>Username:</label>
                                    <Input type='text' value={userProfileValues.username} name="username" onChange={handleInputChange}/>   
                                </div>
                                <div className='mb-4 mt-4'>
                                    <label className={styles.formLabel}>Email:</label>
                                    <Input type='text' value={userProfileValues.email} name="email" onChange={handleInputChange}/>           
                                </div>
                                <div className='mb-4 mt-4'>
                                    <label className={styles.formLabel}>Timezone:</label>
                                    <InputDropdown choices={timezones} value={userProfileValues.timezone} name="timezone" onChange={handleInputChange}/>         
                                </div>
                                <div className='mb-4 mt-4'>
                                    <label className={styles.formLabel}>Introduction:</label>
                                    <Textarea value={userProfileValues.introduction} name="introduction" onChange={handleInputChange}/>         
                                </div>

                                <div className='mb-4 mt-4'>
                                    <MultipleInputDropdown options={technologies} name='technologies' onChange={addTechnology}/>
                                </div>
                                <div className='mb-4'>
                                    <Button text="Submit"/>
                                </div>  
                            </form>
                            <NewLogin />
                        </div>
                    </div>
                </div>
            : 
            <div className='background p-2 w-full h-full'>
                    <div className='w-full mx-auto max-w-md defaultBorder'>
                        <div className='p-2 divide-y divide-gray-400'>
                        <NewLogin />
                    </div>
                </div>
            </div>
            }
            </div>
    )
}

export default myProfile;