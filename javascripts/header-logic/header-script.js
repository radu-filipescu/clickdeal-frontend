import { isLoggedIn } from "../shared/utils.js"
import { CONSTS } from "../shared/CONSTS.js"

window.onload = init;

function profileClickLogged() {
    // TODO: navigate to profile page
}

function init() {
    const profileButton = document.getElementById('profile-button');
    const shoppingCartButton = document.getElementById('shopping-cart-button');

    isLoggedIn( () => {
        // true callback (what to do if user is logged)
        console.log('is logged in');

        // profile button goes to profile page
        profileButton.removeEventListener("click");

        profileButton.addEventListener("click", profileClickLogged);
    }, 
    () => {
        // false callback (what to do if user is not logged)
        console.log('in not logged');

        // profile button goes to login page
        profileButton.removeEventListener("click");

        profileButton.addEventListener("click", () => {
            window.location.href = CONSTS.frontendDevLogin;
        });
    });
}