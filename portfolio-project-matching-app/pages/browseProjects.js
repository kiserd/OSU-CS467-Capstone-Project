import { useState } from 'react'

const browseProjects = () => {
    const projects = [
        {
            name: 'Wastegram',
            description: 'Tracks amount of food wasted by local businesses at the end of each day. Allows user to post photos, geoLocation, quantity describing the waste',
            capacity: 4,
            census: 1,
            open: true,
            likes: 22,
            owner: 1
        },
    ]
    return (
        <div>
            <span className=''>Search Bar and Add Project</span>
            <div className='grid grid-cols-3'>
                <div className='col-span-2 bg-custom-warm-med'>
                    project cards
                </div>
                <div className='col-span-1 bg-custom-cool-med'>
                    filters
                </div>
            </div>
        </div>
    )
}

export default browseProjects
