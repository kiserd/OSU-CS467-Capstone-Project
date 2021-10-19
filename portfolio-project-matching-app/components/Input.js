import styles from './Input.module.css';

const Input = ({type, name, placeholder, onChange, value}) => {
  return (
    <input
      className={styles[type]}
      type={type}
      name={name}
      placeholder={placeholder}
      onChange={onChange}
      value={value}
    />
  );
};

export default Input;
