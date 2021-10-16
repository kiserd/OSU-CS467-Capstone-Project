import styles from './Input.module.css';

const Input = ({type, name, placeholder, onChange}) => {
  return (
    <div>
      <input
        className={styles[type]}
        type={type}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
      />
    </div>
  );
};

export default Input;
