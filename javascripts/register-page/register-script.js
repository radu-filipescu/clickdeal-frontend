import { CONSTS } from "../shared/CONSTS.js"

window.onload = init;

function init() {

    let username = document.getElementById("username");
    let email = document.getElementById("email");
    let password = document.getElementById("password");
    let repeatPassword = document.getElementById("repeat-password");

    const submitButton = document.getElementById('submitButton');

    //submitButton.addEventListener('click', handleRegister);

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        document.getElementById("username-invalid-message").innerHTML = "Câmp obligatoriu.";
        document.getElementById("email-invalid-message").innerHTML = "Câmp obligatoriu.";
        document.getElementById("password-invalid-message").innerHTML = "Câmp obligatoriu.";
        username.setCustomValidity('');
        email.setCustomValidity('');
        password.setCustomValidity('');

        if(password.value != repeatPassword.value) {
            repeatPassword.setCustomValidity("Passwords Don't Match");
            document.getElementById("confirm-password-invalid-message").innerHTML = "Parolele nu coincid.";
          } else {
            repeatPassword.setCustomValidity('');
            document.getElementById("confirm-password-invalid-message").innerHTML = "Câmp obligatoriu.";
          }

        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();          
        } else {
            handleRegister(event);
        }
        form.classList.add('was-validated');
      }, false);
    });
}

function handleRegister(event){
    event.preventDefault();
    let username = document.getElementById("username").value;
    let email = document.getElementById("email").value;
    let password = document.getElementById("password").value;
    let repeatPassword = document.getElementById("repeat-password").value;

    if(password === repeatPassword){
        let data = {
            userName: username,
            emailAddress: email,
            password: password,
            appName: 'clickdeal'
        }

        const registerUrl = CONSTS.URLS.backendDevUrl + 'account/register';

        fetch(registerUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data),
            credentials: 'include' // include cookies in the request
        })
        .then(response => {
            console.log(response)
    
            return response.json();
            
        }).then(data => {
            console.log(data.error);
            handleRegisterErrors(data.error.code, data.error.message);
            if (data) {
                // register successful
    
                //window.location.href = CONSTS.URLS.frontendDevLogin;
            } else {
                
            }
        })
        .catch(error => {
            console.error('There was a problem with the fetch operation:', error);
        });


    } else {
        console.log("parolele nu coincid")
    }
}

function handleRegisterErrors(code, message){
    let username = document.getElementById("username");
    let email = document.getElementById("email");
    let password = document.getElementById("password");

    if(code === "Volo.Abp.Identity:DuplicateUserName") {
        username.setCustomValidity("duplicate-username");
        document.getElementById("username-invalid-message").innerHTML = message;
    } else if(code === "Volo.Abp.Identity:PasswordRequiresNonAlphanumeric") {
        password.setCustomValidity("invalid-password");
        document.getElementById("password-invalid-message").innerHTML = message;
    } else if(code === "Volo.Abp.Identity:PasswordRequiresDigit") {
        password.setCustomValidity("invalid-password");
        document.getElementById("password-invalid-message").innerHTML = message;
    } else if(code === "Volo.Abp.Identity:PasswordRequiresUpper"){
        password.setCustomValidity("invalid-password");
        document.getElementById("password-invalid-message").innerHTML = message;
    } else if(code === "Volo.Abp.Identity:DuplicateEmail") {
        email.setCustomValidity("invalid-email");
        document.getElementById("email-invalid-message").innerHTML = message;
    }

}