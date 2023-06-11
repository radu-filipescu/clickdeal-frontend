import { isLoggedIn, areSpecsEqual } from "../shared/utils.js"
import { CONSTS } from "../shared/CONSTS.js"

function addNavToAdminPage() {
    let navBarEl = document.getElementById('navbar-list-el');

    let adminNav = document.createElement('a');
    adminNav.className = "nav-item nav-link";
    adminNav.href = "admin.html";
    adminNav.innerText = "ADMIN";

    navBarEl.appendChild(adminNav);
}

export function headerInitLogic() {
    // check storage integrity 

    let shoppingCartValue = localStorage.getItem(CONSTS.STORAGE.shoppingCart);

    if ( shoppingCartValue == null || refreshShoppingCart(shoppingCartValue) == true) {
        createShoppingCart();
    }

    mergeItemsShoppingCart();

    let cartCounter = document.getElementById('shopping-cart-nav-counter');

    if(cartCounter != null)
        cartCounter.innerText = JSON.parse(localStorage.getItem(CONSTS.STORAGE.shoppingCart)).Entries.length;

    
    const profileButton = document.getElementById('profile-button');

    isLoggedIn( (userData) => {
        console.log('is logged in with username', userData.userName);
        // true callback (what to do if user is logged)
  
        // add userId to shopping-cart
        let shoppingCart = localStorage.getItem(CONSTS.STORAGE.shoppingCart);

        shoppingCart = JSON.parse(shoppingCart);
        shoppingCart.Username = userData.userName;
        localStorage.setItem(CONSTS.STORAGE.shoppingCart, JSON.stringify(shoppingCart));

        // profile button goes to profile page
        profileButton.removeEventListener("click", profileClickNotLogged);

        profileButton.addEventListener("click", profileClickLogged);

        if(userData.userName == 'admin')
            addNavToAdminPage();
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
            newChild.href = CONSTS.URLS.frontendDevShopPage + "?" + new URLSearchParams({
                Category: '#' + data[i].name + "#",
                Page: 1
            });

            categoriesMenu.appendChild(newChild);
            // console.log('category', i, CONSTS.frontendDevShopPage);
        }      
    })
    .catch(error => {
        console.error('There was a problem with getting categories:', error);
    });
}

function refreshShoppingCart(value) {
    try {
        JSON.parse(value);
    } 
    catch (e) {
        return true;
    }

    let shoppingCartObj = JSON.parse(value);

    if (shoppingCartObj.Username == null)
        return true;

    if (shoppingCartObj.Entries == null)
        return true;

    return false;
}

function createShoppingCart() {
    let shoppingCartObj = {
        Entries: [],
        Username: "",
    };

    let shoppingString = JSON.stringify(shoppingCartObj);

    localStorage.setItem(CONSTS.STORAGE.shoppingCart, shoppingString);
}

function mergeItemsShoppingCart() {
    let shoppingCart = JSON.parse(localStorage.getItem(CONSTS.STORAGE.shoppingCart));
    let cartEntries = shoppingCart.Entries;
    let mergedEntries = [];

    for(let i = 0; i < cartEntries.length; i++)
        for(let j = i + 1; j < cartEntries.length; j++) {
            let A = cartEntries[i];
            let B = cartEntries[j];

            if (JSON.stringify(A.ProductId) === JSON.stringify(B.ProductId)) {
                if (areSpecsEqual(A.Specs, B.Specs)) {
                    let sum = parseInt(A.Quantity) + parseInt(B.Quantity)
                    A.Quantity = sum.toString();

                    cartEntries.splice(j, 1);
                    j--;
                }
            }

        }
    
    for(let i = 0; i < cartEntries.length; i++)
        mergedEntries.push(cartEntries[i]);

    shoppingCart.Entries = mergedEntries;
    shoppingCart = JSON.stringify(shoppingCart);
    localStorage.setItem(CONSTS.STORAGE.shoppingCart, shoppingCart);
}