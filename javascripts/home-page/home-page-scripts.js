import { isLoggedIn } from "../shared/utils.js"
import { CONSTS } from "../shared/CONSTS.js"

window.onload = init;

function init() {
    getProductCategories();
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
        console.log(data);

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

