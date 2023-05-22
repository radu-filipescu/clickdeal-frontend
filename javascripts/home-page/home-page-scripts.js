import { isLoggedIn } from "../shared/utils.js"
import { CONSTS } from "../shared/CONSTS.js"
import { headerInitLogic } from "../header-logic/header-script.js"

window.onload = init;

function init() {
    headerInitLogic();
    getProductCategories();
    getRecentProducts();
}

function getProductCategories() {
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
        
        const categoriesZone = document.getElementById('categories-zone');

        for(let i = 0; i < data.length; i++) {
            // <div class="col-lg-3 col-md-4 col-sm-6 pb-1">
            //     <a class="text-decoration-none" href="">
            //         <div class="cat-item d-flex align-items-center mb-4">
            //             <div class="overflow-hidden" style="width: 100px; height: 100px;">
            //                 <img class="img-fluid" src="img/cat-1.jpg">
            //             </div>
            //             <div class="flex-fill pl-3">
            //                 <h6>Category Name</h6>
            //                 <small class="text-body">100 Products</small>
            //             </div>
            //         </div>
            //     </a>
            // </div>
            let div1 = document.createElement('div');
            div1.className = "col-lg-3 col-md-4 col-sm-6 pb-1";

            let a1 = document.createElement('a');
            a1.className = "text-decoration-none";

            // TODO: a1.href should go to product details

            let div2 = document.createElement('div');
            div2.className = "cat-item d-flex align-items-center mb-4";

            let div3 = document.createElement('div');
            div3.className = "overflow-hidden";
            div3.style.width = "100px";
            div3.style.height = "100px";

            let img = document.createElement('img');
            img.className = "img-fluid";
            img.src = data[i].photoBase64;

            let div4 = document.createElement('div');
            div4.className = "flex-fill pl-3";

            let h6 = document.createElement('h6');
            h6.innerText = data[i].name;

            let small = document.createElement('small');
            small.className = "text-body";
            small.innerText = data[i].productsNumber + " de produse";

            div4.appendChild(h6);
            div4.appendChild(small);

            div3.appendChild(img);

            div2.appendChild(div3);
            div2.appendChild(div4);
            a1.appendChild(div2);

            div1.appendChild(a1);
            
            categoriesZone.appendChild(div1);
        }       
    })
    .catch(error => {
        console.error('There was a problem with getting categories:', error);
    });
}


function getRecentProducts() {
    let categoriesUrl = CONSTS.URLS.backendDevUrl + 'app/product/products-filtered?';

    categoriesUrl = categoriesUrl + new URLSearchParams({
        MaxResultCount: 8,
        OrderBy: "DATE-DESC"
    });

    fetch(categoriesUrl, {
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
        console.log(data);

        // add 8 most recent products to homepage
        const recentProductsZone = document.getElementById('recent-products-area');
        
        for(let i = 0; i < data.length; i++) {
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
            div1.className = "col-lg-3 col-md-4 col-sm-6 pb-1";

                let div2 = document.createElement('div');
                div2.className = "product-item bg-light mb-4";

                    let div3 = document.createElement('div');
                    div3.className = "product-img position-relative overflow-hidden";

                        let img1 = document.createElement('img');
                        img1.className = "img-fluid w-100";
                        img1.src = data[i].image;

                        // TODO: make all product background squared the same size

                        let div4 = document.createElement('div');
                        div4.className = "product-action";

                            let a1 = document.createElement('a');
                            a1.className = "btn btn-outline-dark btn-square";
                            a1.href = "";
                            let i1 = document.createElement('i');
                            i1.className = "fa fa-shopping-cart";

                            let a2 = document.createElement('a');
                            a2.className = "btn btn-outline-dark btn-square";
                            a2.href = "";
                            let i2 = document.createElement('i');
                            i2.className = "far fa-heart";

                            let a3 = document.createElement('a');
                            a3.className = "btn btn-outline-dark btn-square";
                            a3.href = "";
                            let i3 = document.createElement('i');
                            i3.className = "fa fa-sync-alt";

                            let a4 = document.createElement('a');
                            a4.className = "btn btn-outline-dark btn-square";
                            a4.href = "";
                            let i4 = document.createElement('i');
                            i4.className = "fa fa-search";

                    let div5 = document.createElement('div');
                    div5.className = "text-center py-4";

                        let a5 = document.createElement('a');
                        a5.className = "h6 text-decoration-none text-truncate";
                        a5.innerText = data[i].name;

                        if (data[i].name.length > 35)
                            a5.innerText = data[i].name.substring(0, 35) + "..";

                        let div6 = document.createElement('div');
                        div6.className = "d-flex align-items-center justify-content-center mt-2";

                            let h51 = document.createElement('h5');
                            h51.innerText = data[i].price + " RON";

                        let div7 = document.createElement('div');
                        div7.className = "d-flex align-items-center justify-content-center mb-1";
                            for(let i = 0; i < 5; i++) {
                                let starEl = document.createElement('small');
                                starEl.className = "fa fa-star text-primary mr-1";

                                div7.appendChild(starEl);
                            }
                        

            div6.appendChild(h51);
            div5.appendChild(a5);
            div5.appendChild(div6);
            div5.appendChild(div7);
            a1.appendChild(i1);
            a2.appendChild(i2);
            a3.appendChild(i3);
            a4.appendChild(i4);
            div4.appendChild(a1);
            div4.appendChild(a2);
            div4.appendChild(a3);
            div4.appendChild(a4);
            div3.appendChild(img1);
            div3.appendChild(div4);
            div2.appendChild(div3);
            div2.appendChild(div5);
            div1.appendChild(div2);
            
            recentProductsZone.appendChild(div1);
        }       
    })
    .catch(error => {
        console.error('There was a problem with getting categories:', error);
    });
}
