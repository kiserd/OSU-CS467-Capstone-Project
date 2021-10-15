import styles from './Input.module.css';

const Input = ({type, name, placeholder}) => {
  return (
    <div>
      <input
        className={styles[type]}
        type={type}
        name={name}
        placeholder={placeholder}
      />
    </div>
  );
};

export default Input;
