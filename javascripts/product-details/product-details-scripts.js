import { CONSTS } from "../shared/CONSTS.js"
import { headerInitLogic } from "../header-logic/header-script.js"

window.onload = init;

product = {};

function init() {
    headerInitLogic();
    getProductInfo();
    getReviews();
}

function getProductInfo() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    const productDetailUrl = CONSTS.URLS.backendDevUrl + 'app/product/product-details?' + urlParams;

    fetch(productDetailUrl, {
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
        let productName = document.getElementById('product-name');
        productName.innerText = data.name;

        let productPrice = document.getElementById('product-price');
        productPrice.innerText = data.price + ' RON';

        let productShortDescription = document.getElementById('short-description');
        productShortDescription.innerText = data.descriptionShort;

        let productLongDescription = document.getElementById('long-description');
        productLongDescription.innerText = data.descriptionLong;

        let productImage = document.getElementById('product-image');
        productImage.src = data.image;

        let specs = document.getElementById('specs-wrapper');

        let specsObj = JSON.parse(data.specs);

        // <div class="d-flex mb-3">
        //     <strong class="text-dark mr-3">Sizes:</strong>
        //     <form>
        //         <div class="custom-control custom-radio custom-control-inline">
        //             <input type="radio" class="custom-control-input" id="size-1" name="size">
        //             <label class="custom-control-label" for="size-1">XS</label>
        //         </div>
        //         <div class="custom-control custom-radio custom-control-inline">
        //             <input type="radio" class="custom-control-input" id="size-2" name="size">
        //             <label class="custom-control-label" for="size-2">S</label>
        //         </div>
        //         <div class="custom-control custom-radio custom-control-inline">
        //             <input type="radio" class="custom-control-input" id="size-3" name="size">
        //             <label class="custom-control-label" for="size-3">M</label>
        //         </div>
        //         <div class="custom-control custom-radio custom-control-inline">
        //             <input type="radio" class="custom-control-input" id="size-4" name="size">
        //             <label class="custom-control-label" for="size-4">L</label>
        //         </div>
        //         <div class="custom-control custom-radio custom-control-inline">
        //             <input type="radio" class="custom-control-input" id="size-5" name="size">
        //             <label class="custom-control-label" for="size-5">XL</label>
        //         </div>
        //     </form>
        // </div>

        for (const property in specsObj) {
            let div1 = document.createElement('div');
            div1.className = "d-flex mb-3";

            let strong1 = document.createElement('strong');
            strong1.className = "text-dark mr-3";
            strong1.innerText = property + ':';

            let form1 = document.createElement('form');

            for(let i = 0; i < specsObj[property].length; i++) {
                let div2 = document.createElement('div');
                div2.className = "custom-control custom-radio custom-control-inline";

                    let input1 = document.createElement('input');
                    input1.type = "radio";
                    input1.className = "custom-control-input";
                    input1.name = property;
                    input1.id = specsObj[property][i];

                    let label1 = document.createElement('label');
                    label1.className = "custom-control-label";
                    label1.htmlFor = specsObj[property][i];
                    label1.innerText = specsObj[property][i];

                div2.appendChild(input1);
                div2.appendChild(label1);

                form1.appendChild(div2);
            }

            div1.appendChild(strong1);
            div1.appendChild(form1);

            specs.appendChild(div1);
        }
    });
}

function getReviews() {
    let stars = document.getElementsByClassName('hoverable-star-review');

    for(let i = 0; i < stars.length; i++) {
        let star = stars[i];

        star.addEventListener('mouseenter', function() {
            star.className = "fas fa-star";
        });

        star.addEventListener('mouseleave', function() {
            star.className = "far fa-star";
        });
    }
}