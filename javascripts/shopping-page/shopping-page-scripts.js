import { CONSTS } from "../shared/CONSTS.js"
import { headerInitLogic } from "../header-logic/header-script.js"

window.onload = init;

const items_per_page = 9;
let total_items = -1;

function init() {
    headerInitLogic();
    getDiscountFilter();
    getCategoriesFilter();
    initItemPageNavigation();
    getFilteredProducts();
}

function getDiscountFilter() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let discountFilter = document.getElementById('discount-check');

    if (urlParams.get('MinDiscount') != null) {
        discountFilter.checked = true;

        discountFilter.addEventListener('click', function() {
            urlParams.delete('MinDiscount');
    
            window.location.search = urlParams;
        });
    }
    else {
        discountFilter.addEventListener('click', function() {
            urlParams.set('MinDiscount', 1);
    
            window.location.search = urlParams;
        });
    }
}

function getCategoriesFilter() {
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
        // set categories names to filters
        const categoriesFilter = document.getElementById('categories-filter');
        
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);

        for(let i = 0; i < data.length; i++) {
            // <div class="custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3">
            //      <input type="checkbox" class="custom-control-input" checked id="color-all">
            //      <label class="custom-control-label" for="price-all">All Color</label>
            //      <span class="badge border font-weight-normal">1000</span>
            // </div>

            let div1 = document.createElement('div');
            div1.className = "custom-control custom-checkbox d-flex align-items-center justify-content-between mb-3";

                let input1 = document.createElement('input');
                input1.type = "checkbox";
                input1.className = "custom-control-input";
                input1.id = "category-filter-" + data[i].name;

                let label1 = document.createElement('label');
                label1.className = "custom-control-label";
                label1.innerText = data[i].name;
                label1.htmlFor = input1.id;

                let span1 = document.createElement('span');
                span1.className = "badge border font-weight-normal";
                span1.innerText = data[i].productsNumber;

                if(urlParams.get('Category') != null && urlParams.get('Category') === '#' + data[i].name + '#') {
                    input1.checked = true;

                    input1.addEventListener('click', function() {
                        window.location.href = CONSTS.URLS.frontendDevShopPage;
                    })
                }
                else 
                    input1.addEventListener('click', function() {
                        window.location.href = CONSTS.URLS.frontendDevShopPage + "?" + new URLSearchParams({
                            Category: '#' + data[i].name + "#"
                        });
                    })

            
            div1.appendChild(input1);
            div1.appendChild(label1);
            div1.appendChild(span1);

            categoriesFilter.appendChild(div1);
        }      
    })
    .catch(error => {
        console.error('There was a problem with getting categories:', error);
    });
}

function getFilteredProducts() {
    let productsUrl = CONSTS.URLS.backendDevUrl + 'app/product/products-filtered?';

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    let currentPage = 1;

    if (urlParams.get('Page') != null && urlParams.get('Page') >= 0)
        currentPage = urlParams.get('Page');

    urlParams.set('SkipCount', (currentPage - 1) * items_per_page);
    urlParams.set('MaxResultCount', items_per_page);

    productsUrl = productsUrl + urlParams;

    const pageNavigation = document.getElementById('shop-page-navigation');
    pageNavigation.style.visibility = "hidden";

    fetch(productsUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include' // include cookies in the request
    })
    .then(response => {
        if (!response.ok) {
            console.log(response);
            throw new Error('Network response was not ok');
        }
    
        return response.json();
    })
    .then(data => {
        // filtered products to shop page
        const recentProductsZone = document.getElementById('shop-product-area');

        // keeping items page navigation last

        for(let i = data.length - 1; i >= 0; i--) {
            // <div class="col-lg-3 col-md-4 col-sm-6 pb-1">
            //     <div class="product-item bg-light mb-4">
            //         <div class="product-img position-relative overflow-hidden">
            //             <img class="img-fluid w-100" src="img/product-1.jpg" alt="">
            //             <div class="product-action">
            //                 <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-shopping-cart"></i></a>
            //                 <a class="btn btn-outline-dark btn-square" href=""><i class="far fa-heart"></i></a>
            //                 <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-sync-alt"></i></a>
            //                 <a class="btn btn-outline-dark btn-square" href=""><i class="fa fa-search"></i></a>
            //             </div>
            //         </div>
            //         <div class="text-center py-4">
            //             <a class="h6 text-decoration-none text-truncate" href="">Product Name Goes Here</a>
            //             <div class="d-flex align-items-center justify-content-center mt-2">
            //                 <h5>$123.00</h5>
            //                 <h6 class="text-muted ml-2"><del>$123.00</del></h6>
            //             </div>
            //             <div class="d-flex align-items-center justify-content-center mb-1">
            //                 <small class="fa fa-star text-primary mr-1"></small>
            //                 <small class="fa fa-star text-primary mr-1"></small>
            //                 <small class="fa fa-star text-primary mr-1"></small>
            //                 <small class="fa fa-star text-primary mr-1"></small>
            //                 <small class="fa fa-star text-primary mr-1"></small>
            //                 <small>(99)</small>
            //             </div>
            //         </div>
            //     </div>
            // </div>

            let div1 = document.createElement('div');
            div1.className = "col-lg-4 col-md-4 col-sm-6 pb-1";

            div1.addEventListener('click', function() {
                window.location.href = CONSTS.URLS.frontendDevDetailPage + "?" + new URLSearchParams({
                    ProductId: data[i].productId
                });
            });
                //console.log(data);

                let div2 = document.createElement('div');
                div2.className = "product-item bg-light mb-4";

                    let div3 = document.createElement('div');
                    div3.className = "product-img position-relative overflow-hidden";

                        let img1 = document.createElement('img');
                        img1.className = "img-fluid w-100";
                        img1.src = data[i].image.split('#')[1];

                        if(data[i].image == undefined || data[i].image == null || data[i].image.length < 2 || img1.src == null || img1.src == undefined || img1.src.length < 2) {
                            img1.src = 'img/missing-image.jpg';
                        }

                        if (img1.naturalWidth > img1.naturalHeight) {
                            img1.classList.add("center-vertical")
                        } else if (img1.naturalWidth < img1.naturalHeight) {
                            img1.classList.add("center-horizontal")
                        }

                        let div4 = document.createElement('div');
                        div4.className = "product-action";

                    let div5 = document.createElement('div');
                    div5.className = "text-center py-4";

                        let a5 = document.createElement('a');
                        a5.className = "h6 text-decoration-none text-truncate";
                        a5.innerText = data[i].name;

                        if (data[i].name.length > 25)
                            a5.innerText = data[i].name.substring(0, 25) + "..";

                        let div6 = document.createElement('div');
                        div6.className = "d-flex align-items-center justify-content-center mt-2";

                            let h51 = document.createElement('h5');
                            h51.innerText = data[i].price + " RON";

                            let h61 = document.createElement('h6');
                            h61.className = "text-muted ml-2";
                            
                                let del1 = document.createElement('del');
                                del1.innerText = Math.ceil((data[i].price * (100 + data[i].priceDiscount)) / 100) + " RON";

                                h61.appendChild(del1);

                        let div7 = document.createElement('div');
                        div7.className = "d-flex align-items-center justify-content-center mb-1";
                            for(let i = 0; i < 5; i++) {
                                let starEl = document.createElement('small');
                                starEl.className = "fa fa-star text-primary mr-1";

                                div7.appendChild(starEl);
                            }
                        

            div6.appendChild(h51);
            if(data[i].priceDiscount > 0)
                div6.appendChild(h61);
            div5.appendChild(a5);
            div5.appendChild(div6);
            div5.appendChild(div7);
            div3.appendChild(img1);
            div3.appendChild(div4);
            div2.appendChild(div3);
            div2.appendChild(div5);
            div1.appendChild(div2);
            
            recentProductsZone.insertBefore(div1, recentProductsZone.firstChild);
        }  
        
        if(data.length == 0) {
            document.getElementById('shop-product-area').style.display = "none";
        }
    })
    .then( () => {
        const pageNavigation = document.getElementById('shop-page-navigation');
        pageNavigation.style.visibility = "visible";
    })
    .catch(error => {
        console.error('There was a problem with getting categories:', error);
    });
}

function initItemPageNavigation() {
    CheckMoreToFetch();
    
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    let currentPage = 1;

    if (urlParams.get('Page') != null && urlParams.get('Page') >= 0 && parseInt(urlParams.get('Page')) != NaN)
        currentPage = parseInt(urlParams.get('Page'));
    else {
        urlParams.set('Page', 1);

        window.location.search = urlParams;
    }
    
    let prevButton = document.getElementById('prev-page');
    if (currentPage > 1)
        prevButton.addEventListener('click', function() {
            urlParams.set('Page', currentPage - 1);

            window.location.search = urlParams;
        })
    else
        prevButton.style.color = "gray";

    let firstButton = document.getElementById('current-page');
    firstButton.innerText = currentPage;

    let firstButtonAnd1 = document.getElementById('current-page_and1');
    firstButtonAnd1.innerText = currentPage + 1;
    
    if (currentPage * items_per_page < total_items)
        firstButtonAnd1.addEventListener('click', function() {
            urlParams.set('Page', currentPage + 1);

            window.location.search = urlParams;
        });
    else 
        firstButtonAnd1.style.color = "gray";

    let firstButtonAnd2 = document.getElementById('current-page_and2');
    firstButtonAnd2.innerText = currentPage + 2;

    if ((currentPage + 1) * items_per_page < total_items)
        firstButtonAnd2.addEventListener('click', function() {
            urlParams.set('Page', currentPage + 2);

            window.location.search = urlParams;
        });
    else
        firstButtonAnd2.style.color = "gray";

    let nextButton = document.getElementById('next-page');

    if (currentPage * items_per_page < total_items)
    nextButton.addEventListener('click', function() {
            urlParams.set('Page', currentPage + 1);

            window.location.search = urlParams;
        });
    else 
        nextButton.style.color = "gray";
}


function CheckMoreToFetch() {
    let productCountUrl = CONSTS.URLS.backendDevUrl + 'app/product/products-count-with-filters';

    fetch(productCountUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include' // include cookies in the request
    })
    .then(response => {
        if (!response.ok) {
            console.log(response);
            throw new Error('Network response was not ok');
        }
    
        return response.json();
    })
    .then(data => {
        total_items = data.value;
    });
}