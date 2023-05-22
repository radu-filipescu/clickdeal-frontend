import { isLoggedIn } from "../shared/utils.js"
import { CONSTS } from "../shared/CONSTS.js"

export function headerInitLogic() {
    const profileButton = document.getElementById('profile-button');
    const shoppingCartButton = document.getElementById('shopping-cart-button');

    isLoggedIn( () => {
        // true callback (what to do if user is logged)
        console.log('is logged in');

        // profile button goes to profile page
        profileButton.removeEventListener("click", profileClickNotLogged);

        profileButton.addEventListener("click", profileClickLogged);
    }, 
    () => {
        // false callback (what to do if user is not logged)
        console.log('in not logged');

        // profile button goes to login page
        profileButton.removeEventListener("click", profileClickLogged);

        profileButton.addEventListener("click", profileClickNotLogged);
    });

    // get product categories 
    getProductCategoriesForNavbar();
}

function profileClickLogged() {
    window.location.href = CONSTS.URLS.frontendDevProfilePage;
}

function profileClickNotLogged() {
    window.location.href = CONSTS.URLS.frontendDevLogin;
}

function getProductCategoriesForNavbar() {
    const categoriesUrl = CONSTS.URLS.backendDevUrl + 'app/categories/categories';

    fetch(categoriesUrl, {
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
        
        return response.json();
    })
    .then(data => {
        // set categories names to product menu (navbar)
        const categoriesMenu = document.getElementById('product-categories-navbar');

        for(let i = 0; i < data.length; i++) {
            let newChild = document.createElement('a');
            newChild.className = "nav-item nav-link";
            newChild.innerText = data[i].name;
            
            categoriesMenu.appendChild(newChild);
        }      
    })
    .catch(error => {
        console.error('There was a problem with getting categories:', error);
    });
}