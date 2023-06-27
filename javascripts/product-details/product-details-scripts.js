import { CONSTS } from "../shared/CONSTS.js"
import { headerInitLogic } from "../header-logic/header-script.js"

window.onload = init;

function init() {
    headerInitLogic();
    getProductInfo();
    initAddToCartButton();
    getReviews();

    // Fetch all the forms we want to apply custom Bootstrap validation styles to
    var forms = document.getElementsByClassName('needs-validation');
    // Loop over them and prevent submission
    var validation = Array.prototype.filter.call(forms, function(form) {
      form.addEventListener('submit', function(event) {
        event.preventDefault();
        event.stopPropagation(); 
        if (form.checkValidity() !== false) {
            submitReview(); 
        }
        form.classList.add('was-validated');
      }, false);
    });
}

var globalSpecsObj = null;

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

        let reviewCounter2 = document.getElementById('review-counter2');
        reviewCounter2.innerText = reviewCounter2.innerText + ' review-uri pentru ' + data.name;

        let productPrice = document.getElementById('product-price');
        productPrice.innerText = data.price + ' RON';

        let productShortDescription = document.getElementById('short-description');
        productShortDescription.innerText = data.descriptionShort;

        let productLongDescription = document.getElementById('long-description');
        productLongDescription.innerText = data.descriptionLong;

        let productImage = document.getElementById('product-image');
        productImage.src = data.image.split('#')[1];

        if(data.image == undefined || data.image == null || data.image.length < 2 || productImage.src == null || productImage.src == undefined || productImage.src.length < 2) {
            productImage.src = 'img/missing-image.jpg';
        }

        let specs = document.getElementById('specs-wrapper');

        let specsObj;

        if (data.specs == null || data.specs == "") 
            specsObj = "";
        else
            specsObj = JSON.parse(data.specs)

        globalSpecsObj = specsObj;

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
            form1.className = "radio-selector-input";
            form1.id = property;

            for(let i = 0; i < specsObj[property].length; i++) {
                let div2 = document.createElement('div');
                div2.className = "custom-control custom-radio custom-control-inline";

                    let input1 = document.createElement('input');
                    input1.type = "radio";
                    input1.className = "custom-control-input";
                    input1.name = property;
                    input1.id = specsObj[property][i];

                    input1.addEventListener('change', function() {
                        getInStockStatus();
                    });

                    if (i == 0)
                        input1.checked = true;

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

        // check if product is in stock
        getInStockStatus(data.quantity);
    });
}

var selectedStars = 1;

function getReviews() {
    getReviewsForProduct();

    let star1 = document.getElementById('hover-star-1');
    let star2 = document.getElementById('hover-star-2');
    let star3 = document.getElementById('hover-star-3');
    let star4 = document.getElementById('hover-star-4');
    let star5 = document.getElementById('hover-star-5');

    star1.addEventListener('mouseenter', function() {
        star2.className = "far fa-star";
        star3.className = "far fa-star";
        star4.className = "far fa-star";
        star5.className = "far fa-star";

        star1.className = "fas fa-star";
    });

    star1.addEventListener('mouseleave', function() {
        if (selectedStars < 1)
            star1.className = "far fa-star";
    });

    star2.addEventListener('mouseenter', function() {
        star3.className = "far fa-star";
        star4.className = "far fa-star";
        star5.className = "far fa-star";

        star1.className = "fas fa-star";
        star2.className = "fas fa-star";
    });

    star1.addEventListener('mouseleave', function() {
        if (selectedStars < 1)
            star1.className = "far fa-star";
        if (selectedStars < 2)
            star2.className = "far fa-star";
    });

    star3.addEventListener('mouseenter', function() {
        star4.className = "far fa-star";
        star5.className = "far fa-star";

        star1.className = "fas fa-star";
        star2.className = "fas fa-star";
        star3.className = "fas fa-star";
    });

    star3.addEventListener('mouseleave', function() {
        if (selectedStars < 1)
            star1.className = "far fa-star";
        if (selectedStars < 2)
            star2.className = "far fa-star";
        if (selectedStars < 3)
            star3.className = "far fa-star";
    });

    star4.addEventListener('mouseenter', function() {
        star5.className = "far fa-star";

        star1.className = "fas fa-star";
        star2.className = "fas fa-star";
        star3.className = "fas fa-star";
        star4.className = "fas fa-star";
    });

    star4.addEventListener('mouseleave', function() {
        if (selectedStars < 1)
            star1.className = "far fa-star";
        if (selectedStars < 2)
            star2.className = "far fa-star";
        if (selectedStars < 3)
            star3.className = "far fa-star";
        if(selectedStars < 4)
            star4.className = "far fa-star";
    });

    star5.addEventListener('mouseenter', function() {
        star1.className = "fas fa-star";
        star2.className = "fas fa-star";
        star3.className = "fas fa-star";
        star4.className = "fas fa-star";
        star5.className = "fas fa-star";
    });

    star5.addEventListener('mouseleave', function() {
        if (selectedStars < 1)
            star1.className = "far fa-star";
        if (selectedStars < 2)
            star2.className = "far fa-star";
        if (selectedStars < 3)
            star3.className = "far fa-star";
        if(selectedStars < 4)
            star4.className = "far fa-star";
        if(selectedStars < 5)
            star5.className = "far fa-star";
    });

    star1.addEventListener('click', function() {
        selectedStars = 1;
    });
    star2.addEventListener('click', function() {
        selectedStars = 2;
    });
    star3.addEventListener('click', function() {
        selectedStars = 3;
    });
    star4.addEventListener('click', function() {
        selectedStars = 4;
    });
    star5.addEventListener('click', function() {
        selectedStars = 5;
    });

    let submitButton = document.getElementById('submit-button');

    // submitButton.addEventListener('click', function() {
    //     submitReview();
    // })
}

function getInStockStatus(inStock) {
    let inStockStatus = document.getElementById('in-stock-status');

    if(inStock == 1) {
        inStockStatus.innerText = "în stoc";
        inStockStatus.style.color = "green";
    }
    else {
        inStockStatus.innerText = "nu este în stoc";
        inStockStatus.style.color = "red";
    }
}

function getSelectedSpecs() {
    let radioInputs = document.getElementsByClassName('radio-selector-input');

    let specsObj = {}

    for(let i = 0; i < radioInputs.length; i++) {
        let currentInput = radioInputs[i];
        let inputChildren = currentInput.childNodes;

        for(let j = 0; j < inputChildren.length; j++) {
            if(inputChildren[j].firstChild.checked) {
                specsObj[currentInput.id] = inputChildren[j].childNodes[1].innerText;
                break;
            }
        }
    }

    return specsObj;
}

function initAddToCartButton() {
    let cartButton = document.getElementById('add-to-cart-button');

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    let productId = urlParams.get('ProductId');

    cartButton.addEventListener('click', function() {
        let productQuantity = document.getElementById('product-quantity');

        let quantity = productQuantity.value;

        let shoppingCart = JSON.parse(localStorage.getItem(CONSTS.STORAGE.shoppingCart));

        let newEntity = {
            ProductId: productId,
            Quantity: quantity
        };

        shoppingCart.Entries.push(newEntity);
        localStorage.setItem(CONSTS.STORAGE.shoppingCart, JSON.stringify(shoppingCart));

        location.reload();
    })
}

function submitReview() {
    let contentInput = document.getElementById('message');
    let reviewContent = contentInput.value;
    
    let usernameInput = document.getElementById('name');
    let reviewUsername = usernameInput.value;

    let reviewStars = selectedStars;

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    let productReviewId = urlParams.get("ProductId");

    const addReviewUrl = CONSTS.URLS.backendDevUrl + 'app/review';

    // TODO: add some validation here

    let review = { 'reviewUsername': reviewUsername, 'content': reviewContent, 'numberOfStars': reviewStars, 'productId': productReviewId };

    fetch(addReviewUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include', // include cookies in the request
        body: JSON.stringify(review)
    })
    .then(async response => {
        //const reader = stream.getReader();

        console.log(response);
        // TODO: message for succesfull review send

        window.location.reload();
    });
}

function getReviewsForProduct() {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);

    let getReviewsUrl = CONSTS.URLS.backendDevUrl + 'app/review/reviews-for-product?' + urlParams; 

    let reviewCounter = document.getElementById('review-counter');
    let reviewCounter2 = document.getElementById('review-counter2');
    let reviewCounter3 = document.getElementById('review-counter3');

    fetch(getReviewsUrl, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'include', // include cookies in the request
    })
    .then(response => {
        //const reader = stream.getReader();

        return response.json();
    })
    .then(data => {
        let reviewArea = document.getElementById('review-zone');

        // <div class="media mb-4" >
        //     <img src="img/user.jpg" alt="Image" class="img-fluid mr-3 mt-1" style="width: 45px;">
        //     <div class="media-body">
        //         <h6>John Doe<small> - <i>01 Jan 2045</i></small></h6>
        //         <div class="text-primary mb-2">
        //             <i class="fas fa-star"></i>
        //             <i class="fas fa-star"></i>
        //             <i class="fas fa-star"></i>
        //             <i class="fas fa-star-half-alt"></i>
        //             <i class="far fa-star"></i>
        //         </div>
        //         <p>Diam amet duo labore stet elitr ea clita ipsum, tempor labore accusam ipsum et no at. Kasd diam tempor rebum magna dolores sed sed eirmod ipsum.</p>
        //     </div>
        // </div>

        reviewCounter.innerText += ' (' + data.length + ')';
        reviewCounter2.innerText = data.length + reviewCounter2.innerText; 
        reviewCounter3.innerText = '(' + data.length + ' review-uri)';

        let starSum = 0;

        for(let i = 0; i < data.length; i++) {
            starSum += parseInt(data[i].numberOfStars);

            let div0 = document.createElement('div');
            div0.className = "media mb-4";
                let img1 = document.createElement('img');
                img1.src = "img/default-user.jpg";
                img1.className = "img-fluid mr-3 mt-1";
                img1.style.width = "45px";

                let div1 = document.createElement('div');
                div1.className = "media-body";
                    let h61 = document.createElement('h6');
                    h61.innerText = data[i].username;
                        let small1 = document.createElement('small');
                        small1.innerText = " - ";
                            let i1 = document.createElement('i');
                            i1.innerText = data[i].date;
                    let div2 = document.createElement('div');
                    div2.className = "text-primary mb-2";
                        for(let j = 1; j <= data[i].numberOfStars; j++) {
                            let newStar = document.createElement('i');
                            newStar.className = "fas fa-star";

                            div2.appendChild(newStar);
                        }
                        for(let j = data[i].numberOfStars + 1; j <= 5; j++) {
                            let newStar = document.createElement('i');
                            newStar.className = "far fa-star";

                            div2.appendChild(newStar);
                        }
                    let p1 = document.createElement('p');
                    p1.innerText = data[i].content;

            small1.appendChild(i1);
            h61.appendChild(small1);

            div1.appendChild(h61);
            div1.appendChild(div2);
            div1.appendChild(p1);

            div0.appendChild(img1);
            div0.appendChild(div1);

            reviewArea.appendChild(div0);
        }

        let starAvg = Math.ceil(starSum / data.length);

        let starAvgEl = document.getElementById('stars-average');

        for(let i = 1; i <= starAvg; i++) {
            let newStar = document.createElement('small');
            newStar.className = "fas fa-star";
            starAvgEl.appendChild(newStar);
        }

        for(let i = starAvg + 1; i <= 5; i++) {
            let newStar = document.createElement('small');
            newStar.className = "far fa-star";
            starAvgEl.appendChild(newStar);
        }
    });
}