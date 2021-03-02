import Input from "../components/input"
import Button from "../components/button"
import { useState, useEffect } from "react"
import hit from "../controller/hit"
import session from "../controller/session"
import load from "../controller/load"
import snackbar from "../components/snackbar"

function Login(props){

    const [error,setError] = useState(["","",]);
    const [content,setContent] = useState(null);

    useEffect(()=>{
        if(session.get("logged")===2||session.get("logged")===0){
            function login(e){
                const login_btn = e.currentTarget,
                parent = login_btn.parentElement,
                username = parent.querySelector(".input #username"),
                password = parent.querySelector(".input #password");
                if(username.value.replace(" ","")!==""){
                    if(password.value.replace(" ","")!==""){
                        username.disabled = password.disabled = true;
                        login_btn.classList.add("process_loading")
                        setError(["",""]);
                        hit("login",{"username": username.value,"password": password.value})
                        .then(e=>{
                            if(e===0){
                                username.disabled = password.disabled = false;
                                login_btn.classList.remove("process_loading")
                                password.focus();
                                snackbar.show("Please recheck your password!");
                            }
                            else if(e===2){
                                username.disabled = password.disabled = false;
                                login_btn.classList.remove("process_loading")
                                username.focus();
                                snackbar.show('Username not found, <a href="#/register">Register Now!</a>')
                            }
                            else if(e.error){
                                username.disabled = password.disabled = false;
                                login_btn.classList.remove("process_loading")
                                snackbar.show("Some error occurred, please try after sometime!")
                            }
                            else{
                                session.save("logged",true);
                                session.save_auth(e);
                                load("")
                            }
                        })
                        .catch(e=>{
                            console.log(e);
                            username.disabled = password.disabled = false;
                            login_btn.classList.remove("process_loading")
                            snackbar.show("Some error occurred, please try after sometime!")
                        })
                    }
                    else{
                        setError(["","Please Recheck Your Password"]);
                        password.focus();
                    }
                }
                else{
                    setError(["Please Recheck Your Username",""]);
                    username.focus();
                }
            }
        
            setContent(()=>{
                return (
                    <>
                        <div className="content">
                            <h1>Login</h1>
                            <Input type="text" af={true} id="username" label="Username" placeholder="E.g. John Doe" error={error[0]} enter=".login .content .login_btn"/>
                            <Input type="password" id="password" label="Password" placeholder="E.g. 1234" error={error[1]} enter=".login .content .login_btn" forgot={<a className="reset-pass" href="#/forgot">Forgot Password?</a>}/>
                            <Button className="login_btn" onClick={login}>Login</Button>
                            <p className="register_now">Don't have an account? <a href="#/register">Register Now!</a></p>
                        </div>
                        <div className="background">
                            <div className="bg"></div>
                            <div className="attribution"><span>Photo by <a href="https://unsplash.com/@24ameer?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText" target="_blank" rel="noreferrer">Ameer Basheer</a> on <a href="https://unsplash.com/t/nature?utm_source=unsplash&amp;utm_medium=referral&amp;utm_content=creditCopyText" target="_blank" rel="noreferrer">Unsplash</a></span></div>
                        </div>
                    </>
                )
            })
        }
        else{
            load("");
            snackbar.show("User is already logged in!")
        }
    },[props,error])


    return (
        <>
            <div className="login">
                {content}
            </div>
        </>
    )
}
export default Login