import { CONSTS } from "../shared/CONSTS.js"

window.onload = init;
let concurrencyStamp = "";

function init() {
    const editProfileButton = document.getElementById("editProfile");
    editProfileButton.addEventListener('click', editProfile);
    getProfileData()
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
            concurrencyStamp = dataObject.concurrencyStamp
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

function editProfile(){
    let username = document.getElementById("username");
    let email = document.getElementById("email");
    let surname = document.getElementById("surname");
    let name = document.getElementById("name");
    let phoneNumber = document.getElementById("phoneNumber");

    let updateDto = {
        userName: username.value,
        email: email.value,
        name: name.value,
        surname: surname.value,
        phoneNumber: phoneNumber.value,
        concurrencyStamp: concurrencyStamp
    }

    console.log(concurrencyStamp)

    const profileUrl = CONSTS.URLS.backendDevUrl + 'account/my-profile';

    fetch(profileUrl, {
        method: 'PUT',
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
    }).catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
}