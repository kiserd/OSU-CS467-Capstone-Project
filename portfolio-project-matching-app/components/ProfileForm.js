import { useState, useEffect } from 'react'
import Button from '../components/Button'
import Input from '../components/Input'
import InputDropdown from '../components/InputDropdown'
import Textarea from '../components/Textarea'
import MultipleInputDropdown from '../components/MultipleInputDropdown'
import NewLogin from './NewLogin'
import styles from './ProfileForm.module.css'
import { useAuth } from '../context/AuthContext'
import { 
    updateDoc, 
    getAllTechnologies, 
    createAssociation, 
    deleteAssociation 
} from '../backend/dao'

let technologies = [{id: 1, name: 'Javascript'}, {id: 2, name: 'C++'}, {id: 3, name: 'React'}, {id: 4, name: 'Flutter'}]

// The Select component from react-select expects the 'options' prop to be an object with keys 'value' and 'label'
technologies = technologies.map((technology) => {
    return {value: technology.name, label: technology.name}
})

const myProfile = () => {
        let auth = useAuth();
        
        // array of all technologies in the database
        const [allTechnologies, setAllTechnologies] = useState([]);

        // array representing technologies selected to be associated with project
        const [selectedTechnologies, updateSelectedTechnologies] = useState([]);
        let [userProfileValues, setUserprofileValues] = useState({
            email: '',
            introduction: '',
            username: '',
        });
        
        useEffect(()=>{
            if (auth && auth.user){
                setUserprofileValues({
                    ...userProfileValues, 
                    username: auth.user.username,
                    email: auth.user.email,
                    introduction: auth.user.introduction
                });
            }
        }, [auth]);

        useEffect(()=>{
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
            console.log('use effect')
            return function cleanup() {
                isMounted = false
            }
        }, []);

        const handleInputChange = e => {
            const { name, value } = e.target;
            setUserprofileValues({...userProfileValues, [name]: value});
        }
    
        const handleSubmit = async (e) => {
            e.preventDefault();
            // Update simple user values
            console.log(`${JSON.stringify(userProfileValues)}`)
            await updateDoc('users', auth.user.id, userProfileValues);

            // Create associations between user and technologies
                // Delete technologies in selected technologies that aren't in auth.user.technologies
                // Add new technologies that are not in auth.user.technologies
            console.log(`auth.user.technologies: ${JSON.stringify(auth.user.technologies)}`)
            console.log(`selectedTechnologies: ${JSON.stringify(selectedTechnologies)}`)
            const formattedAllTechnologies = allTechnologies.map(technology => technology.value.id);
            const formattedUserTechnologies = auth.user.technologies.map(tech => tech.id);
            const formattedSelectedTechnologies = selectedTechnologies.map(tech => tech.id);
            console.log(`All Technologies: ${JSON.stringify(formattedAllTechnologies)}`)
            console.log(`User Technologies: ${JSON.stringify(formattedUserTechnologies)}`)
            console.log(`Selected Technologies: ${JSON.stringify(formattedSelectedTechnologies)}`)
            for (const technology of formattedAllTechnologies) {
                console.log(`Technology: ${JSON.stringify(technology)}`);

                console.log(`formattedUserTechnologies has technology? ${formattedUserTechnologies.includes(technology)}`)
                console.log(`formattedSelectedTechnologies has selected technology? ${formattedSelectedTechnologies.includes(technology)}`)

                if(formattedUserTechnologies.includes(technology) && !formattedSelectedTechnologies.includes(technology)){
                    // Remove technology_user association
                    console.log('removing technology')
                    await deleteAssociation('users_technologies', auth.user.id, technology);
                } else if (formattedSelectedTechnologies.includes(technology) && !formattedUserTechnologies.includes(technology)){
                    console.log('adding technology')
                    await createAssociation('users_technologies', auth.user.id, technology);
                }
                
            }
            console.log("Form submitted");
            console.log(userProfileValues);
        }

        const addTechnology = (e) => {
            updateSelectedTechnologies(e.map(choice => choice.value));
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
                                {/* <div className='mb-4 mt-4'>
                                    <label className={styles.formLabel}>Timezone:</label>
                                    <InputDropdown choices={timezones} value={userProfileValues.timezone} name="timezone" onChange={handleInputChange}/>         
                                </div> */}
                                <div className='mb-4 mt-4'>
                                    <label className={styles.formLabel}>Introduction:</label>
                                    <Textarea value={userProfileValues.introduction} name="introduction" onChange={handleInputChange}/>         
                                </div>

                                <div className='mb-4 mt-4'>
                                    <MultipleInputDropdown options={allTechnologies} onChange={addTechnology} name='technologies'/>
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