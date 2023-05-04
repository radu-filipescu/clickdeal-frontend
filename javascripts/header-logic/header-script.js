import { isLoggedIn } from "../shared/CONSTS.js"

window.onload = init;

function init() {
    isLoggedIn( () => {
        console.log('true');
    }, 
    () => {
        console.log('false');
    });
}