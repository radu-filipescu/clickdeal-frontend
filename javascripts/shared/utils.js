import { CONSTS } from './CONSTS.js'

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
        } else {
            // logged in
            
            let userData = JSON.parse(data);
            //console.log(userData);
            
            if(trueCallback != null)
                trueCallback(userData);
        }
    })
    .catch(error => {
        console.error('There was a problem with the fetch operation:', error);
    });
  }