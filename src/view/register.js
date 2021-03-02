import { useState, useEffect } from "react"
import Button from "../components/button";
import Input from "../components/input";
import hit from "../controller/hit"
import session from "../controller/session"
import load from "../controller/load"
import snackbar from "../components/snackbar"

function Register(props){
    const [errors,setErrors] = useState(["","","",""]);
    const [content,setContent] = useState(null);

    useEffect(()=>{
        if(session.get("logged")===2||session.get("logged")===0){
            function validateEmail(e){
                if(e.match(/[\w\W]*@[\w]*[.]+[\w]{2,4}/gi)){
                    return true;
                }
                return false;
            }
        
            function validatePass(p1,p2){
                p1 = p1.replace(" ","");
                p2 = p2.replace(" ","");
                if(p1===p2){
                    return 1;
                }
                return 0;
            }
        
            function register(e){
                const reg_btn = e.currentTarget,
                parent = reg_btn.parentElement,
                username = parent.querySelector("#username"),
                email = parent.querySelector("#email"),
                pwd = parent.querySelector("#pwd"),
                cpwd = parent.querySelector("#cpwd");
        
                if(username.value.replace(" ","")!==""){
                    if(validateEmail(email.value)){
                        if(pwd.value.replace(" ","")===""){
                            pwd.focus();
                            setErrors(["","","Please enter a valid password!",""]);
                        }
                        else if(pwd.value.length<10){
                            pwd.focus();
                            setErrors(["","","Password needs to be >= 10",""]);
                        }
                        else{
                            if(validatePass(pwd.value,cpwd.value)){
                                setErrors(["","","",""]);
                                username.disabled = email.disabled = pwd.disabled = cpwd.disabled = true
                                reg_btn.classList.add("process_loading")
                                hit("register",{
                                    "username": username.value,
                                    "email": email.value,
                                    "password": pwd.value
                                }).then((e)=>{
                                    if(e.error){
                                        username.disabled = email.disabled = pwd.disabled = cpwd.disabled = false
                                        reg_btn.classList.remove("process_loading")
                                        if(e.error.code===1062){
                                            username.focus()
                                        }
                                        else if(e.error.code===1063){
                                            email.focus()
                                        }
                                        else if(e.error.code===1064){
                                            pwd.focus()
                                        }
                                        snackbar.show(e.error.msg)
                                    }
                                    else if(e===1){
                                        load("login");
                                        snackbar.show("Registration Done, Login to continue")
                                    }
                                }).catch(()=>{
                                    username.disabled = email.disabled = pwd.disabled = cpwd.disabled = false
                                    reg_btn.classList.remove("process_loading")
                                    snackbar.show("Some error occurred, please try after sometime!")
                                })
                            }
                            else{
                                cpwd.focus();
                                setErrors(["","","","Please recheck you passwords!"]);
                            }
                        }
                    }
                    else{
                        email.focus();
                        setErrors(["","Please enter a valid email","",""]);
                    }
                }
                else{
                    username.focus();
                    setErrors(["Please enter a valid username","","",""]);
                }
        
            }        
            setContent(()=>{
                return (
                    <>
                        <div className="background">
                            <div className="bg"></div>
                            <div className="attribution"><span>Photo by <a href="https://unsplash.com/@turner_imagery?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText" target="_blank" rel="noreferrer">Will Turner</a> on <a href="https://unsplash.com/t/nature?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText" target="_blank" rel="noreferrer">Unsplash</a></span></div>
                        </div>
                        <div className="content">
                            <h1>Register</h1>
                            <Input type="text" af={true} label="Username" id="username" placeholder="E.g. John Doe" error={errors[0]} enter=".register .register_btn"/>
                            <Input type="email" label="Email" id="email" placeholder="E.g. john@doe.com" error={errors[1]} enter=".register .register_btn"/>
                            <Input type="password" label="Password" id="pwd" placeholder="E.g. 1234" error={errors[2]} enter=".register .register_btn"/>
                            <Input type="password" label="Confirm Password" id="cpwd" placeholder="E.g. 1234" error={errors[3]} enter=".register .register_btn"/>
                            <Button className="register_btn" onClick={register}>Register</Button>
                            <p className="login_now">Already have a account? <a href="#/login">Login</a></p>
                        </div>
                    </>
                )     
            })
        }
        else{
            load("");
            snackbar.show("User is already logged in!")
        }
        
    },[props,errors])


    return (
        <>
            <div className="register">
                {content}
            </div>
        </>
    )
}
export default Register