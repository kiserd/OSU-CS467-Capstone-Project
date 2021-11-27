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
    deleteAssociation,
    getUserById
} from '../backend/dao'



const myProfile = () => {
        let auth = useAuth();
        
        // array of all technologies in the database
        const [allTechnologies, setAllTechnologies] = useState([]);

        // array representing technologies selected to be associated with project
        const [selectedTechnologies, updateSelectedTechnologies] = useState([]);

        const [userTechnologies, setUserTechnologies] = useState({list: []});

        const [userTechIndexes, setUserTechIndexes] = useState({list: []});

        const [userProfileValues, setUserprofileValues] = useState({
            email: '',
            introduction: '',
            username: '',
        });
        
        useEffect(()=>{
            // Updates userProfileValues and userTechnologies
            // depends on auth
            if (auth && auth.user){
                getUserById(auth.user.id).then((result)=>{
                    console.log(`in useEffect: ${JSON.stringify(result)}`)
                    setUserprofileValues({
                        ...userProfileValues, 
                        username: result.username,
                        email: result.email,
                        introduction: result.introduction
                    });
                    console.log(`result.technologies 123: ${JSON.stringify(result.technologies)}`)
                    const technologies = result.technologies;
                    setUserTechnologies({list: [...userTechnologies.list, ...result.technologies]});
                    console.log(`userTechnologies 123: ${JSON.stringify(userTechnologies)}`)
                    
                });
            }
        }, [auth]);

        useEffect(()=>{
            // updates allTechnologies
            // runs once on component mounting

            // tracks whether component mounted, cleanup will assign false
            let isMounted = true
            // get technologies and set state if component mounted
            getAllTechnologies().then((technologies) => {
                // The Select component from react-select expects the 'options' prop to be an object with keys 'value' and 'label'
                technologies = technologies.map((technology) => {
                    return {value: technology, label: technology.name};
                });
                console.log(`All Technologies: ${JSON.stringify(technologies)}`)
                // set state if component is still mounted
                if (isMounted) setAllTechnologies(technologies);
            })
            // cleanup function to assign false to isMounted
            console.log('use effect')
            return function cleanup() {
                isMounted = false
            }
        }, []);

        useEffect(()=>{
            // Updates selected technologies

            // depends on allTechnologies and auth
            console.log('useEffect')
            updateTechIndexArray();
            let defaultTechnologies = userTechIndexes.list.map(idx=>{
                console.log(`Technology at idx: ${allTechnologies[idx]}`);    
                return allTechnologies[idx];
            });
            console.log(`Indexes: ${JSON.stringify(userTechIndexes.list)} \ndefaultTechnologies: ${JSON.stringify(defaultTechnologies)}`)
            updateSelectedTechnologies(selectedTechnologies => [...selectedTechnologies, defaultTechnologies[0]]);
        }, [allTechnologies, auth])

        const handleInputChange = e => {
            const { name, value } = e.target;
            setUserprofileValues({...userProfileValues, [name]: value});
        }

        // const updateToDBValues= async () => {
        //     const user_id = auth.user.id;
        //     // get profile values from db
        //     let userValues = await getUserById(user_id);
        //     setUserprofileValues({...userValues, [user_id]: userValues})
        //     // set user technologies
            
        //     // updateTechIndexArray();
        //     // get timezone from db

        // }

        const updateTechIndexArray = () => {
            let result = [];
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
            setUserTechIndexes({list: result});
        }
    
        const handleSubmit = async (e) => {
            e.preventDefault();
            // Update simple user values
            await updateDoc('users', auth.user.id, userProfileValues);

            // Create associations between user and technologies
                // Delete technologies in selected technologies that aren't in auth.user.technologies
                // Add new technologies that are not in auth.user.technologies
            const formattedAllTechnologies = allTechnologies.map(technology => technology.value.id);
            const formattedUserTechnologies = auth.user.technologies.map(tech => tech.id);
            const formattedSelectedTechnologies = selectedTechnologies.map(tech => tech.id);
            for (const technology of formattedAllTechnologies) {
                if(formattedUserTechnologies.includes(technology) && !formattedSelectedTechnologies.includes(technology)){
                    // Remove technology_user association
                    await deleteAssociation('users_technologies', auth.user.id, technology);
                } else if (formattedSelectedTechnologies.includes(technology) && !formattedUserTechnologies.includes(technology)){
                    await createAssociation('users_technologies', auth.user.id, technology);
                }
                
            }
            // Fetch user info again so form values reflect changes to user
            // await updateToDBValues();
            console.log("Form submitted");
            console.log(userProfileValues);
        }

        const addTechnology = (e) => {
            updateSelectedTechnologies(e.map(choice => choice.value));
            
        }
        
        // const timezones = [
        //     {id: 1, name:'Pacific'},
        //     {id: 2, name:'Mountain'},
        //     {id: 3, name:'Central'},
        //     {id: 4, name:'Eastern'}
        // ]
    
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