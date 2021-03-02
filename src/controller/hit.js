import secure from "./secure"

async function hit(url,data){
    return await new Promise((r,err)=>{
        const path = "http://localhost:5000/";
        let t = secure.encrypt(JSON.stringify(data))
        const form_data = new FormData();
        form_data.append("data",t);
        fetch(path+url,{
            method: "POST",
            body: form_data
        }).then((c)=>{
            c.json().then(c=>{
                r(c);
            }).catch(e=>err(e))
        }).catch(e=>err(e))
    });
}

export default hit