import { CONSTS } from "../shared/CONSTS.js"
import { headerInitLogic } from "../header-logic/header-script.js"

window.onload = init;

function init() {
    headerInitLogic();
    getCategoriesFilter();
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

        console.log(data);
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