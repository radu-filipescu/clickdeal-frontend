import { CONSTS } from "../shared/CONSTS.js"

// run this code after window loads,
// so we don't get null elements on getElementById
window.onload = init;

function init() {
    const submitButton = document.getElementById('submit-button-ID');

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        document.getElementById("exampleInputEmail1").setCustomValidity('');
        document.getElementById("exampleInputPassword1").setCustomValidity('')
        document.getElementById("username-invalid-message").innerHTML = "Câmp obligatoriu.";
        document.getElementById("password-invalid-message").innerHTML = "Câmp obligatoriu.";

        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();
        } else {
            handleFormSubmit(event)
        }
        form.classList.add('was-validated');
      }, false);
    });
}


function handleSuccesfulLogin() {
    window.location = CONSTS.URLS.frontendDevIndex;
}

function handleFormSubmit(event) {
    event.preventDefault();

    const form = document.getElementById('login-form');

    const formData = new FormData(form);
    let data = Array.from(formData.entries())
        .reduce((obj, [key, value]) => {
        obj[key] = value;

        return obj;
    }, {});

    data = JSON.stringify(data);
    let jsonData = JSON.parse(data);

    jsonData["rememberMe"] = document.getElementById("rememberMe").checked;
        
    const loginUrl = CONSTS.URLS.backendDevUrl + 'account/login';

    fetch(loginUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(jsonData),
        credentials: 'include' // include cookies in the request
    })
    .then(response => {
        console.log(response)
        if(!response.ok){
            throw new Error('Network response was not ok');
        }

        return response.json();
        
    }).then(data => {
        console.log(data)
        if (data.result == 1) {
            // login successful

            window.location.href = CONSTS.URLS.frontendDevIndex;
        } else if(data.result == 2) {
            handleWrongLogin("Datele de conectare sunt greșite!");
        } else if(data.result == 4){
            handleWrongLogin("Prea multe încercări eșuate. Vă rugăm să încercați mai târziu.")
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function handleWrongLogin(message){
    let username = document.getElementById("exampleInputEmail1");
    let password = document.getElementById("exampleInputPassword1");

    username.setCustomValidity("duplicate-username");
    password.setCustomValidity("invalid-password");
    document.getElementById("username-invalid-message").innerHTML = message;
    document.getElementById("password-invalid-message").innerHTML = message;
}



