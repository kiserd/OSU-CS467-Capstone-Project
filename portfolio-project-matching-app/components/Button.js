const Button = ({type, onClick}) => {
    // Types of buttons:
    //      btnGeneral
    //      btnWarning
    return (
        <button className={type} onClick={onClick}>Hello</button>
    );
};

export default Button;