import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getProjectById, readObjectById } from '../backend/dao';
import Button from '../components/Button'
import UserIcon from '../components/UserIcon';

const Project = () => {
    const router = useRouter();
    console.log(router.query);
    const [project, setProject] = useState();

    useEffect(()=>{
        if(router.query.id){
            readObjectById('projects', router.query.id, true)
            .then((data)=>{
                console.log(`${JSON.stringify(data)}`);
                setProject({...project, ...data});
            })
        }
    }, [router]);

    if (project) {
        return (
            <div className='background'>
                <div className='grid grid-cols-1 mx-8'>
                    <div className="defaultBorder m-4">
                        <h1 className="text-xl font-medium text-center mt-2 mb-2">{project.name}</h1>
                        <hr className='ml-4 mr-4 border-b-2 border-custom-cool-extraDark'/>
                        <h2 className="text-lg mx-2 mt-4">Technologies:</h2>
                        <div className="ml-4 mr-2">
                        {
                            project.technologies.map(element => {
                                return (                        
                                    <Button text={element.name} key={element.id} addClassName='m-2'/>
                                )
                            })
                        }
                        </div>

                        <h2 className="text-lg mx-2 font-medium">Description:</h2>
                        <p className="ml-4 mr-2">{project.description}</p>

                        <h2 className="text-lg mx-2 font-medium">Project Capacity:</h2>
                        <p className="ml-4 mr-2">{project.capacity}</p>

                        <h2 className="text-lg mx-2 font-medium">Project Census:</h2>
                        <p className="ml-4 mr-2">{project.census}</p>

                        <h2 className="text-lg mx-2 font-medium">Project Status:</h2>
                        <p className="ml-4 mr-2">{project.open ? "Open" : "Closed"}</p>
                        
                        <h2 className="text-lg mx-2 font-medium">Likes:</h2>
                        <p className='ml-4 mr-2'>{project.likes}</p>

                        <div className='p-1 inline'>
                            <Button text='Like' type='btnGeneral' />
                        </div>
                        
                        <h2 className="text-lg mx-2 font-medium">Project Owner:</h2>
                        <div className="ml-4 mr-2">
                            <UserIcon imgPath='/../public/user.ico' username={project.owner.username} />
                        </div>
                        
                        <h2 className="text-lg mx-2 font-medium">Project Participants (other than project owner):</h2>
                        <div className="ml-4 mr-2">
                        {project.users.map((user) => {
                        return (
                        <div key={user.id} className='py-1 pr-2'>
                            <UserIcon imgPath='/../public/user.ico' username={user.username} />
                        </div>
                        )
                        })}
                        <div className='p-1'>
                            <Button text='join' type='btnGeneral' />
                        </div>


                        </div>
                    </div>
                </div>
            </div>
        )
    } else {
        return (
            <h1>Loading</h1>
        )
    }
    
}

export default Project;