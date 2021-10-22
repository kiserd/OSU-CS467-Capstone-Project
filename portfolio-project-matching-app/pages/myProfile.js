import { useState, useEffect } from 'react'
import Button from '../components/Button'
import Input from '../components/Input'
import Textarea from '../components/Textarea'


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
                timezone: "ET",
                introduction: "Hi I'm Josh and I like to party",
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
    
        return (
            <div>
                <form onSubmit={handleSubmit}>
                    

                    <label>Introduction:</label>
                    <Textarea value={userProfileValues.introduction} name="introduction" onChange={handleInputChange}/>

                    

                    <Button text="Submit"/>
                </form>
            </div>
    )
}

export default myProfile;