import { useState, useEffect } from 'react'
import Button from '../components/Button'
import Input from '../components/Input'
import InputDropdown from '../components/InputDropdown'
import Textarea from '../components/Textarea'
import styles from './ProfileForm.module.css'

const myProfile = () => {
        const initialUserProfileState = {
            username: "",
            email: "",
            timezone: "",
            introduction: "",
            technologies: []
        };

        let [userProfileValues, setUserprofileValues] = useState(initialUserProfileState);
    
        useEffect(()=>{
            getUserProfile();
        },[]);
    
        const getUserProfile = () => {
            const values = {
                username: "joshk",
                email: "a@b.com",
                timezone: "Mountain",
                introduction: "Hi I'm Josh and I like to code",
                technologies: ['JavaScript', 'Python', 'Blockchain']
            }
            // const values =  api.getUserInfo(user)
    
            setUserprofileValues({...userProfileValues, ...values})
        }
    
        const handleInputChange = e => {
            const { name, value } = e.target;
            console.log(`${name}: ${value}`)
            setUserprofileValues({...userProfileValues, [name]: value});
            console.log(`${JSON.stringify(userProfileValues)}`)
            console.log("input changed")
        }
    
        const handleSubmit = e=> {
            e.preventDefault();
            // api.setUserInfo(userProfileValues);
            console.log("Form submitted");
        }
        
        const timezones = [
            {id: 1, name:'Pacific'},
            {id: 2, name:'Mountain'},
            {id: 3, name:'Central'},
            {id: 4, name:'Eastern'}
        ]
    
        return (
            <div>
                <form onSubmit={handleSubmit} className="mx-10">

                    <label className={styles.formLabel}>Username:</label>
                    <Input value={userProfileValues.username} name="username" onChange={handleInputChange}/>

                    <label className={styles.formLabel}>Email:</label>
                    <Input value={userProfileValues.email} name="email" onChange={handleInputChange}/>

                    <label className={styles.formLabel}>Timezone:</label>
                    <InputDropdown choices={timezones} value={userProfileValues.timezone} name="timezone" onChange={handleInputChange}/>

                    <label className={styles.formLabel}>Introduction:</label>
                    <Textarea value={userProfileValues.introduction} name="introduction" onChange={handleInputChange}/>

                    <Button text="Submit"/>
                </form>
            </div>
    )
}

export default myProfile;