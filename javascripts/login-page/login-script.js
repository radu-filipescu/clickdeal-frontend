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

    jsonData["rememberMe"] = false;
    if(jsonData.rememberMe == "on")
        jsonData["rememberMe"] = true;
        
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
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        console.log('Login successful');
        // You can now make authenticated requests with the saved cookies
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });

    // const xhr = new XMLHttpRequest();
    // xhr.open('POST', loginUrl);
    // xhr.setRequestHeader('Content-Type', 'application/json');
    // xhr.onload = function() {
    //     if (xhr.status === 200) {
    //         const response = JSON.parse(xhr.responseText);

    //         // if all is good
    //         if(response["description"] == "Success") {
    //             //handleSuccesfulLogin();
    //         }        
    //     } 
    //     else {
    //       // TODO: maybe?
    //     }
    // };
    
    // xhr.onerror = function() {
    //     console.error('An error occurred while sending the request.');
    // };   

    // xhr.send(JSON.stringify(jsonData));
}



