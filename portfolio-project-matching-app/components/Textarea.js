const Textarea = ({ form_id, name, placeholder, numRows, value, addClassName='' }) => {
    return (
        <textarea
        form={form_id}
        name={name}
        placeholder={placeholder}
        rows={numRows}
        value={value}
        className='w-full p-2 resize-none bg-gray-200 appearance-none border-2 border-gray-200 rounded-md text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500'>
        </textarea>
    )
}

export default Textarea
