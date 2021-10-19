import styles from './Button.module.css';

const Button = ({text, type='btnGeneral', onClick, addClassName=""}) => {
    // Types of buttons:
    //      btnGeneral
    //      btnWarning
    //      
    return (
        <button className={`${styles[type]} ${addClassName}`} onClick={onClick}>{text}</button>
    );
};

export default Button;