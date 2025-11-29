

function bookNow(){
  alert("Please Sign In to Book Now");
}

function signIn(){
  alert(" Please Sign In To Reserve ");
}

function bookRoom(){
  alert(" Please Sign In To Book a Room");
}

function vistWebsite(){
  alert("Please first sign-up");
}


document.getElementById("openAlertBtn").addEventListener("click", function() {
    alert("Sign in");
    document.getElementById("popup").style.display = "flex";
});

document.getElementById("closePopupBtn").addEventListener("click", function() {
    document.getElementById("popup").style.display = "none";
});



