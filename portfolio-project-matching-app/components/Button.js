const Button = ({text, type='btnGeneral', onClick}) => {
    // Types of buttons:
    //      btnGeneral
    //      btnWarning
    return (
        <button className={type} onClick={onClick}>{text}</button>
    );
};

export default Button;