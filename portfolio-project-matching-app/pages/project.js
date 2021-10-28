import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { getProjectById } from '../backend/dao';

const Project = () => {
    const router = useRouter();
    console.log(router.query);
    const [project, setProject] = useState();

    useEffect(()=>{
        if(router.query.id){
            getProjectById(router.query.id)
            .then((data)=>{
                console.log(`${JSON.stringify(data)}`);
                setProject({...project, ...data});
            })
        }
    }, [router]);

    if (project) {
        return (
            <div>
                <p>Name: {project.name}</p>
                <p>Description: {project.description}</p>
                <p>Capacity: {project.capacity}</p>
                <p>Open: {project.open}</p>
                <p>Likes: {project.likes}</p>
                <p>Owner's name: {project.owner.username}</p>
                <p>Technologies</p>
                {
                    project.technologies.map(element => {
                        return (
                            <div key={element.id}>
                                <p>Name: {element.name} </p>
                            </div>
                        )
                    })
                }
            </div>
        )
    } else {
        return (
            <h1>Loading</h1>
        )
    }
    
}

export default Project;