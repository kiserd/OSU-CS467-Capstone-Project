const Textarea = ({ form_id, name, placeholder, numRows, value, onChange, addClassName='' }) => {
    return (
        <textarea
        form={form_id}
        name={name}
        placeholder={placeholder}
        rows={numRows}
        value={value}
        onChange={onChange}
        className={`w-full p-2 resize-none bg-gray-100 appearance-none defaultBorder text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-purple-500 ${addClassName}`}>
        </textarea>
    )
}

export default Textarea
