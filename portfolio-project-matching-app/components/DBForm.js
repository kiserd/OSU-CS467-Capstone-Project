import { addNewDoc } from '../Firebase/clientApp.ts'

const DBForm = () => {
    let generalButtonStyle = "border-2 border-gray-600 text-gray-600 rounded-md hover:text-gray-900 hover:border-gray-900";

    const addProject = async (e) => {
        e.preventDefault()
        let payload = {
            name: e.target.name.value,
            description: e.target.description.value,
            capacity: e.target.capacity.value,
            cencus: 1,
            open: true,
            likes: 0
        }
        await addNewDoc('projects', payload);
    }
    return (
        <div className='bg-gray-200 p-2 w-full h-full'>
            <div className='w-full mx-auto max-w-xs border-2 border-gray-400 rounded-md shadow-md'>
                <div className='p-2 divide-y divide-gray-400'>
                    <div className='w-full'>
                        <form onSubmit={addProject}>
                            <div className='mb-4 mt-4'>
                                <label for='name' className='block mb-2'>Name</label>
                                <input className={generalButtonStyle + ' block w-full p-2'} id='name' type='text' placeholder='name' name='name' required></input>
                            </div>
                            <div className='mb-4'>
                                <label for='description' className='block mb-2'>Description</label>
                                <input className={generalButtonStyle + ' block w-full p-2'} id='description' type='text' placeholder='description' name='description' required></input>
                            </div>
                            <div className='mb-4'>
                                <label for='capacity' className='block mb-2'>Capacity</label>
                                <input className={generalButtonStyle + ' block w-full p-2'} id='capacity' type='number' placeholder='capacity' name='capacity' required></input>
                            </div>
                            <div className='mb-2'>
                                <button className={generalButtonStyle + 'm-2 p-2'} type='submit'>Submit</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default DBForm
