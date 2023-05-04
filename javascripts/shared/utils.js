import { CONSTS } from './CONSTS.js'

function logout() {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', 'https://localhost:44396/api/account/logout');
    xhr.setRequestHeader('X-Requested-With', 'XMLHttpRequest');
    xhr.setRequestHeader('Content-Type', 'application/json');
    
    // TODO: implement logout 

    xhr.onload = function() {
        //const response = JSON.parse(xhr.responseText);

        console.log('logout reponse', xhr);
       
        if(xhr.status === 401) {
            //if(falseCallback != null) 
            //    falseCallback();
        }

        if (xhr.status === 200) {
            //if(trueCallback != null) 
            //    trueCallback();
        } 
    };   

   xhr.send();
}

export function isLoggedIn(trueCallback = null, falseCallback = null) {
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
        // if not logged in
        if(data.includes("<!DOCTYPE html>")) {
            if(falseCallback != null)
                falseCallback();
        }

        // logged in
        if(trueCallback != null)
            trueCallback();
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
  }