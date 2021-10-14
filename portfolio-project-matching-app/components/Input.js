import styles from './Input.module.css';

const Input = ({type, name, placeholder}) => {
  return (
    <div>
      <input
        className={styles[type]}
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={event => console.log(event.target.value)}
      />
    </div>
  );
};

export default Input;