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
        // if not logged in
        if(data.includes("<!DOCTYPE html>")) {
            if(falseCallback != null)
                falseCallback();
        } else {
            // logged in
            if(trueCallback != null)
            trueCallback();
        }

        
    })
}