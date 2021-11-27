import { useState, useEffect } from 'react'
import Button from '../components/Button'
import Input from '../components/Input'
import Textarea from '../components/Textarea'
import MultipleInputDropdown from '../components/MultipleInputDropdown'
import NewLogin from './NewLogin'
import styles from './ProfileForm.module.css'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/router'
import { 
    updateDoc, 
    getAllTechnologies, 
    createAssociation, 
    deleteAssociationByIds,
    getUserById,
    readAllObjects,
    readObjectById,
} from '../backend/dao'



const myProfile = () => {
        const router = useRouter();
        let auth = useAuth();
        
        // array of all technologies in the database
        const [allTechnologies, setAllTechnologies] = useState([]);

        // array representing technologies selected to be associated with project
        const [selectedTechnologies, setSelectedTechnologies] = useState([]);

        const [userTechnologies, setUserTechnologies] = useState([]);

        const [userTechIndexes, setUserTechIndexes] = useState([]);

        const [userProfileValues, setUserprofileValues] = useState({
            email: '',
            introduction: '',
            username: '',
        });
        
        useEffect(()=>{
            // Updates userProfileValues and userTechnologies
            // depends on auth
            console.log(`UseEffect 1`)
            if (auth && auth.user){
                readObjectById('users', auth.user.id, true).then((result)=>{
                    setUserprofileValues({
                        ...userProfileValues, 
                        username: result.username,
                        email: result.email,
                        introduction: result.introduction
                    });
                    console.log('result:', result);
                    setUserTechnologies(result.technologies);
                });
            }
        }, [auth]);

        useEffect(()=>{
            // updates allTechnologies
            // runs once on component mounting
            console.log(`UseEffect 2`)
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
        }, []);

        useEffect(()=>{
            // Updates selected technologies
            // depends on allTechnologies and auth
            console.log(`UseEffect 3`)
            if (allTechnologies.length > 0 && userTechnologies.length > 0){
                updateTechIndexArray();
            }
        }, [allTechnologies, userTechnologies, auth])


        useEffect(() => {
            console.log('userTechIdxs: ', userTechIndexes);
            let defaultTechnologies = userTechIndexes.map(idx=>{
                return allTechnologies[idx];
            });
            setSelectedTechnologies(defaultTechnologies)
        }, [userTechIndexes]);

        const handleInputChange = e => {
            const { name, value } = e.target;
            setUserprofileValues({...userProfileValues, [name]: value});
        }

        const updateTechIndexArray = () => {
            let result = [];
            console.log('userTechnologies: ', userTechnologies)
            console.log(`at.length: ${allTechnologies.length}\nut.length: ${userTechnologies.length}`)
            for (let i = 0; i < allTechnologies.length; i++) {
                for (let j = 0; j < userTechnologies.length; j++) {
                    if (allTechnologies[i].value.id === userTechnologies[j].id) {
                        console.log(`at: ${allTechnologies[i].value.id}\nut: ${userTechnologies[j].id}`)
                        result.push(i);
                    }
                }
            }
            console.log(`Updating tech index array: ${result}`);
            setUserTechIndexes(result);
        }
    
        const handleSubmit = async (e) => {
            e.preventDefault();
            // Update simple user values
            await updateDoc('users', auth.user.id, userProfileValues);

            // Create associations between user and technologies
                // Delete technologies in selected technologies that aren't in auth.user.technologies
                // Add new technologies that are not in auth.user.technologies
            const formattedAllTechnologies = allTechnologies.map(tech => tech.value.id);
            const formattedUserTechnologies = userTechnologies.map(tech => tech.id);
            const formattedSelectedTechnologies = selectedTechnologies.map(tech => tech.value.id);
            console.log(`formattedAllTechnologies: ${formattedAllTechnologies}`)
            console.log(`formattedUserTechnologies: ${formattedUserTechnologies}`)
            console.log(`formattedSelectedTechnologies: ${formattedSelectedTechnologies}`)
            for (const technology of formattedAllTechnologies) {
                if(formattedUserTechnologies.includes(technology) && !formattedSelectedTechnologies.includes(technology)){
                    console.log(`removing technology: ${technology}`);
                    // Remove technology_user association
                    await deleteAssociationByIds('users_technologies', auth.user.id, technology);
                } else if (formattedSelectedTechnologies.includes(technology) && !formattedUserTechnologies.includes(technology)){
                    console.log(`adding technology: ${technology}`);
                    // Add technology_user association
                    await createAssociation('users_technologies', auth.user.id, technology);
                }
                
            }
            // Refresh page so form reflects changes.
            // **** I think the error is below here in this function ****
            readObjectById('users', auth.user.id, true).then((result)=>{
                setUserprofileValues({
                    ...userProfileValues, 
                    username: result.username,
                    email: result.email,
                    introduction: result.introduction
                });
                // setUserTechnologies([]);
                setUserTechnologies(result.technologies);
            });
        }

        const addTechnology = (e) => {
            setSelectedTechnologies(e.map(choice => choice));
        }
    
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
                                    <MultipleInputDropdown options={allTechnologies} value={selectedTechnologies}  onChange={addTechnology} name='technologies'/>
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