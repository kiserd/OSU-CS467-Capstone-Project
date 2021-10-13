const Input = ({type, name, placeholder}) => {
  return (
    <div>
      <input
        className={"border-2 border-gray-600 text-gray-600 rounded-md hover:text-gray-900 hover:border-gray-900 block w-full p-2"}
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={event => console.log(event.target.value)}
      />
    </div>
  );
};

export default Input;