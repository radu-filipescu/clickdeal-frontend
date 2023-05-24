import { CONSTS } from "../shared/CONSTS.js"
import { headerInitLogic } from "../header-logic/header-script.js"

window.onload = init;

function init() {
    headerInitLogic();

    //const editProfileButton = document.getElementById("editProfile");
    //editProfileButton.addEventListener('click', editProfile);

    const logoutButton = document.getElementById("logountBtn");
    logoutButton.addEventListener('click', logout);

    getProfileData();

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        document.getElementById("username-invalid-message").innerHTML = "Câmp obligatoriu.";
        username.setCustomValidity('');

        if (form.checkValidity() === false) {
          event.preventDefault();
          event.stopPropagation();          
        } else {
            editProfile(event);
        }
        form.classList.add('was-validated');
      }, false);
    });
}


function getProfileData(){
    const profileUrl = CONSTS.URLS.backendDevUrl + 'account/my-profile';

    fetch(profileUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include' // include cookies in the request
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.text();
    })
    .then(data => {
        console.log(data)
        if(data.includes("<!DOCTYPE html>")) {
            //user not logged in
            window.location.href = CONSTS.URLS.frontendDevLogin;
        } else {
            // logged in
            let dataObject = JSON.parse(data)
            fillEditForm(dataObject);
        }
    })
}

function fillEditForm(data){
    let username = document.getElementById("username");
    let email = document.getElementById("email");
    let surname = document.getElementById("surname");
    let name = document.getElementById("name");
    let phoneNumber = document.getElementById("phoneNumber");

    username.value = data.userName;
    email.value = data.email;
    surname.value = data.surname;
    name.value = data.name;
    phoneNumber.value = data.phoneNumber;
}

function editProfile(event){
    event.preventDefault();
    event.stopPropagation();  

    let username = document.getElementById("username");
    let surname = document.getElementById("surname");
    let name = document.getElementById("name");
    let phoneNumber = document.getElementById("phoneNumber");

    let updateDto = {
        userName: username.value,
        name: name.value,
        surname: surname.value,
        phoneNumber: phoneNumber.value,
    }
    //TODO fix username already taken message even if you don't change username (can't edit profile)

    const profileUrl = CONSTS.URLS.backendDevUrl + 'app/user-profile/edit-user-profile';

    fetch(profileUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateDto),
        credentials: 'include' // include cookies in the request
    }).then(response => {
        console.log(response)
        if(!response.ok){
            throw new Error('Network response was not ok');
        }

        return response.json();
    }).then(data => {
        console.log(data)
        if(data.success == false) {
            document.getElementById("username-invalid-message").innerHTML = "Username-ul există deja";
            username.setCustomValidity('username-taken');
        } else {
            localStorage.clear();
            window.location.reload();
        }
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}

function logout(){
    const loginUrl = CONSTS.URLS.backendDevUrl + 'account/logout';

    fetch(loginUrl, {
        method: 'GET',
        credentials: 'include' // include cookies in the request
    }).then(response => {
        console.log(response)
        if(!response.ok){
            throw new Error('Response not ok');
        } else {
            localStorage.clear();
            window.location.href = CONSTS.URLS.frontendDevIndex;
        }
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}