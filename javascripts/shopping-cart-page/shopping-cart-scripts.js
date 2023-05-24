import { CONSTS } from "../shared/CONSTS.js"
import { headerInitLogic } from "../header-logic/header-script.js"

window.onload = init;

var products = []
var shoppingCart;

function init() {
    headerInitLogic();
    loadProducts();
}

function loadProducts() {
    shoppingCart = JSON.parse(localStorage.getItem(CONSTS.STORAGE.shoppingCart));

    for(let i = 0; i < shoppingCart.Entries.length; i++) {
        let entry = shoppingCart.Entries[i];

        const productDetailUrl = CONSTS.URLS.backendDevUrl + 'app/product/product-details?ProductId=' + entry.ProductId;

        fetch(productDetailUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include' // include cookies in the request
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Error getting products details');
            }
            
            return response.json();
        })
        .then(data => { 
            products.push(data);

            if(products.length == shoppingCart.Entries.length) {
                showProductsInCart();
            }
        });
    }
}

function showProductsInCart() {
    let cartTable = document.getElementById('shopping-cart-table');

    console.log(shoppingCart);

    for(let i = 0; i < products.length; i++) {
        let product = products[i];

        // <tr>
        //     <td class="align-middle">
        //          <img src="img/product-1.jpg" style="width: 50px;">
        //          <span>Product Name<span/>
        //     </td>
        //     <td class="align-middle">$150</td>
        //     <td class="align-middle">
        //         <div class="input-group quantity mx-auto" style="width: 100px;">
        //             <div class="input-group-btn">
        //                 <button class="btn btn-sm btn-primary btn-minus" >
        //                      <i class="fa fa-minus"></i>
        //                 </button>
        //             </div>
        //             <input type="text" class="form-control form-control-sm bg-secondary border-0 text-center" value="1">
        //             <div class="input-group-btn">
        //                 <button class="btn btn-sm btn-primary btn-plus">
        //                     <i class="fa fa-plus"></i>
        //                 </button>
        //             </div>
        //         </div>
        //     </td>
        //     <td class="align-middle">$150</td>
        //     <td class="align-middle"><button class="btn btn-sm btn-danger"><i class="fa fa-times"></i></button></td>
        // </tr>

        let tr1 = document.createElement('tr')
            let td1 = document.createElement('td')
            td1.className = "align-middle";
                let img1 = document.createElement('img');
                img1.src = product.image;
                img1.style.width="50px";

                let span1 = document.createElement('span');
                span1.innerText = ' ' + product.name;

            let td2 = document.createElement('td');
            td2.className = "align-middle";
            td2.innerText = product.price + " RON";

            let td3 = document.createElement('td');
            td3.className = "align-middle";
                let div1 = document.createElement('div');
                div1.className = "input-group quantity mx-auto";
                div1.style.width="100px";
                    let div2 = document.createElement('div');
                    div2.className = "input-group-btn";
                        let button1 = document.createElement('button');
                        button1.className = "btn btn-sm btn-primary btn-minus";
                            let i1 = document.createElement('i');
                            i1.className = "fa fa-minus";
                    
                    let input1 = document.createElement('input');
                    input1.type = "text";
                    input1.className = "form-control form-control-sm bg-secondary border-0 text-center";
                    input1.value = 1;

                    let div3 = document.createElement('div');
                    div3.className = "input-group-btn";
                        let button2 = document.createElement('button');
                        button2.className = "btn btn-sm btn-primary btn-plus";
                            let i2 = document.createElement('i');
                            i2.className = "fa fa-plus";

            let td4 = document.createElement('td');
            td4.className = "align-middle";
            td4.innerText = product.price + " RON";

            let td5 = document.createElement('td');
            td5.className = "align-middle";
                let button3 = document.createElement('button')
                button3.className = "btn btn-sm btn-danger";
                    let i3 = document.createElement('i');
                    i3.className = "fa fa-times";

          
        td1.appendChild(img1);
        td1.appendChild(span1);

        button3.appendChild(i3);
        td5.appendChild(button3);

        button1.appendChild(i1);
        div2.appendChild(button1);

        button2.appendChild(i2);
        div3.appendChild(button2);

        div1.appendChild(div2);
        div1.appendChild(input1);
        div1.appendChild(div3);
        td3.appendChild(div1);

        tr1.appendChild(td1);
        tr1.appendChild(td2);
        tr1.appendChild(td3);
        tr1.appendChild(td4);
        tr1.appendChild(td5);

        cartTable.appendChild(tr1);
    }
}