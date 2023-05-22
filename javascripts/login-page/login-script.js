import { CONSTS } from "../shared/CONSTS.js"

// run this code after window loads,
// so we don't get null elements on getElementById
window.onload = init;

function init() {
    const submitButton = document.getElementById('submit-button-ID');

    submitButton.addEventListener('click', handleFormSubmit);
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

            //window.location.href = CONSTS.URLS.frontendDevIndex;
        } else {
            
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}



