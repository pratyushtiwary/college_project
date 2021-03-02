import { useState,useEffect } from "react"
import Input from "../components/input"
import Button from "../components/button"
import hit from "../controller/hit"
import session from "../controller/session"
import load from "../controller/load"
import snackbar from "../components/snackbar"
let step = 1;
function Forgot(props){
    const [content,setContent] = useState(null)
    const [button,setButton] = useState("Send OTP")
    const [mini_content,setMiniContent] = useState(null)

    useEffect(()=>{
        if(session.get("logged")===2||session.get("logged")===0){
            function process(e){
                snackbar.hide();
                const otp_btn = e.currentTarget,
                parent = otp_btn.parentElement,
                username = parent.querySelector("#username");
                if(step===1){
                    if(username.value.replace(" ","")===""){
                        snackbar.show("Enter a valid username!")
                        username.focus();
                        return;
                    }
                    username.disabled=true;
                    otp_btn.classList.add("process_loading")
                    hit("forgot",{
                        "username":username.value
                    }).then((e)=>{
                        otp_btn.classList.remove("process_loading")
                        if(e.error){
                            username.disabled=false;
                            if(e.error.msg===1070){
                                username.focus();
                                snackbar.show("Username not found!");
                            }
                            else{
                                snackbar.show(e.error.msg);
                            }
                        }
                        else if(e===1){
                            setMiniContent(()=>{
                                return (
                                    <>
                                        <Input type="text" id="otp" label="Enter OTP" placeholder="E.g. 123456" enter=".forgot .content .send_otp"/>
                                        <Input type="password" id="pwd" label="Enter New Password" placeholder="E.g. test12345" enter=".forgot .content .send_otp"/>
                                    </>
                                )
                            })
                            snackbar.show("OTP sent to email!")
                            setButton("Reset Password")
                            step = 2;
                        }
                    }).catch(()=>{
                        username.disabled = false;
                        otp_btn.classList.remove("process_loading")
                        snackbar.show("Some error occurred, please try again later!")
                    })
                }
                else if(step===2){
                    const otp = parent.querySelector("#otp"),
                    new_pass = parent.querySelector("#pwd");
                    if(otp.value.length<6||otp.value.replace(" ","")===""){
                        snackbar.show("Please enter a valid otp!")
                        otp.focus()
                        return;
                    }

                    if(new_pass.value.replace(" ","")!==""&&new_pass.value.length>9){
                        otp_btn.classList.add("process_loading");
                        otp.disabled=new_pass.disabled=true;
                        hit("reset",{
                            "username": username.value,
                            "new_pass": new_pass.value,
                            "otp": otp.value
                        }).then((e)=>{
                            otp_btn.classList.remove("process_loading")
                            if(e.error){
                                otp.disabled=new_pass.disabled=false;
                                if(e.error.msg===1069){
                                    otp.focus();
                                    snackbar.show("Please recheck your otp!");
                                }
                                else{
                                    snackbar.show(e.error.msg);
                                }
                            }
                            else if(e===1){
                                step = 1;
                                snackbar.show("Password reset successfully! Login to continue");
                                load("login");
                            }
                        }).catch(()=>{
                            username.disabled = new_pass.disabled = otp.disabled = false;
                            otp_btn.classList.remove("process_loading")
                            snackbar.show("Some error occurred, please try again later!")
                        })
                    }
                    else{
                        snackbar.show("Please enter a valid password!")
                        new_pass.focus()
                    }
                }
            }

            setContent(()=>{
                return (
                    <>
                        <div className="content">
                            <h1>Reset Password</h1>
                            <Input type="text" af={true} id="username" label="Enter Username" placeholder="E.g. JohnDoe" enter=".forgot .content .send_otp"/>
                            {mini_content}
                            <Button className="send_otp" onClick={process}>{button}</Button>
                        </div>
                    </>
                )
            })
        }
        else{
            load("");
            snackbar.show("User is already logged in!")
        }
    },[props,button,mini_content])

    return (
        <div className="forgot">
            {content}
        </div>
    )

}

export default Forgot;