function Input(props){

    function submit(e){
        if(e.which===13){
            document.querySelector(props.enter).click();
        }
    }

    return (
        <div className="input">
            <label htmlFor={props.id}>{props.label}{props.forgot}</label>
            <input id={props.id} autoFocus={props.af} type={props.type} placeholder={props.placeholder} onKeyUp={submit}/>
            <p className="error">{props.error}</p>
        </div>
    )
}

export default Input