// run this code after window loads,
// so we don't get null elements on getElementById

window.onload = init;

function init() {
    const submitButton = document.getElementById('submit-button-ID');

    submitButton.addEventListener('click', handleFormSubmit);
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
        

    const loginUrl = 'https://localhost:44396/api/account/login';

    const xhr = new XMLHttpRequest();
    xhr.open('POST', loginUrl);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onload = function() {
        const response = JSON.parse(xhr.responseText);
        console.log(response);

        if (xhr.status === 200) {
        

        } 
        else {
          console.log('shit happened');
        }
    };
    
    xhr.onerror = function() {
        console.error('An error occurred while sending the request.');
    };   

    console.log('sending data:', JSON.stringify(jsonData));

    xhr.send(JSON.stringify(jsonData));
}



