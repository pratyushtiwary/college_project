const snackbar = {};

snackbar.create = ()=>{
    let s = document.body.querySelector(".snackbar");
    if(s){
        return s;
    }
    s = document.createElement("div");
    s.classList.add("snackbar")
    s.classList.add("hide")
    document.body.append(s);
    return s;

}

snackbar.show = (txt,duration=5000)=>{
    let s = snackbar.create();
    s.innerHTML = txt;
    s.classList.remove("hide");
    setTimeout(()=>{
        snackbar.hide();
    },duration)
}

snackbar.hide = ()=>{
    let s = snackbar.create();
    s.classList.add("hide");
}

export default snackbar;