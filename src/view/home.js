import { useState, useEffect } from "react"
import Button from "../components/button"
import session from "../controller/session"
import load from "../controller/load"
import snackbar from "../components/snackbar"

function Home(props){
    const [content,setContent] = useState(null);

    useEffect(()=>{
        if(session.get("logged")===true){
            const data = session.get_auth(),
            username = data.username,
            email = data.email;
            function logout(e){
                session.save("logged",false);
                session.save_auth({});
                e.currentTarget.classList.add("process_loader")
                load("login");
                snackbar.show("User logged out!")
            }
            setContent(()=>{
                return (
                    <>
                        <div className="content">
                            <p className="title">Hi ,<b>{username}</b></p>
                            <p className="body1">This is a college project created by Pratyush</p>
                            <p className="body2">Hope You Liked It!</p>
                            <p className="meta">User Email = {email}</p>
                            <Button className="logout" onClick={logout}>Logout</Button>
                        </div>
                        <div className="background">
                            <div className="bg"></div>
                        </div>
                    </>
                )
            });
        }
        else{
            load("login")
            snackbar.show("Please login to continue!");
        }
    },[props])

    return (
        <div className="home">
            {content}
        </div>
    )
}

export default Home