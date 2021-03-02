import secure from "./secure"

const s = {}

s.save = (key,data)=>{
    if(s.get(key)===0){
        localStorage.setItem("data",secure.encrypt("{}"))
    }

    let j = secure.decrypt(localStorage.getItem("data"));
    j = JSON.parse(j);
    j[key] = data;
    j = JSON.stringify(j);
    j = secure.encrypt(j);
    localStorage.setItem("data",j);
    return 1;

}

s.get = (key="")=>{
    if(localStorage.getItem("data")){
        let data = secure.decrypt(localStorage.getItem("data"));
        data = JSON.parse(data);
        if(key!==""&&data[key]){
            return data[key]
        }
        return 2;
    }
    return 0;
}

s.save_auth = (auth_json)=>{
    const data = secure.jwt_encode(JSON.stringify(auth_json))
    s.save("__auth",data)
}

s.get_auth = ()=>{
    let auth_json = s.get("__auth");
    if(auth_json===0||auth_json===2){
        return 0;
    }

    auth_json = secure.jwt_decode(auth_json);
    return auth_json;
}

export default s;