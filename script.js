function login() {
    const validUser = "keyman" ;
    const validPass = "0000" ;
    let user = document.getElementById("user").value.trim();
    let pass = document.getElementById("pass").value;
    let message = document.getElementById("mess");
    
 if (user === validUser && pass === validPass){
     window.location.href = "page1.html" ;
 }  
else if (user === "" || pass === ""){
    alert ("Remplissage des champs obligatoire");
}  
else{
    mess.textContent ="Identifiant incorrect";
    mess.style.color ="red";
}    
}

