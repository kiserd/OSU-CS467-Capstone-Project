import styles from './Button.module.css';

const Button = ({text, type='btn', onClick}) => {
    // Types of buttons:
    //      btnGeneral
    //      btnWarning
    //      
    return (
        <button className={styles[type]} onClick={onClick}>{text}</button>
    );
};

export default Button;