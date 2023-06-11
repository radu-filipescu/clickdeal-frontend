import { CONSTS } from "../shared/CONSTS.js"
import { headerInitLogic } from "../header-logic/header-script.js"

window.onload = init;

function init() {
    headerInitLogic();
    getProductCategories();
    //getDiscountedProducts();
    //getRecentProducts();
    getAllProducts();
    //getProductInfo('ProductId=3a0b553a-08ca-3d65-fe79-248dee1afdd5');
}

var currentProduct = null;
var productImages = [];

function deleteCategory(name) {
    console.log('delete category called for', name);
}

function searchProductByCode() {
    var value = document.getElementById('product-smartbill-code').value;
    const productDetailUrl = CONSTS.URLS.backendDevUrl + 'app/product/product-details-smartbill-code?ProductId=' + value;

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
        console.log(data);
        currentProduct = data;

        document.getElementById('product-details').style.display = "block";

        var prodImage = document.getElementById('detail-img');
        prodImage.src = data.image;

        var prodSmartbillcode = document.getElementById('detail-product-smartbill-code');
        prodSmartbillcode.value = data.codIdentificareSmartbill;

        var prodInternalcode = document.getElementById('detail-product-internal-code');
        prodInternalcode.value = data.id;

        var prodSmartbillname = document.getElementById('detail-product-smartbill-name');
        prodSmartbillname.value = data.smartbillProductName;

        var prodSmartbillVisible = document.getElementById('detail-product-smartbill-is-visible');
        prodSmartbillVisible.checked = data.visibleOnWebsite;
        
        productImages = [];
        if(!data.photoPaths || data.photoPaths == undefined || data.photoPaths.length < 3) {
            prodImage.src = "img/missing-image.jpg";
        }
        else {
            var picsList = data.photoPaths.split('#');

            for(let i = 0; i < picsList.length; i++) {
                if(picsList[i].length > 1)
                    productImages.push(picsList[i]);
            }

            prodImage.src = "img/missing-image.jpg";
            prodImage.src = productImages[0];
        }

        var prodName = document.getElementById('detail-product-name');
        prodName.value = data.name;

        var prodName = document.getElementById('detail-product-brand');
        prodName.value = data.brand;

        var prodCategories = document.getElementById('detail-product-categories');
        prodCategories.value = data.categories;

        var prodShortDesc = document.getElementById('detail-product-short-desc');
        prodShortDesc.value = data.descriptionShort;

        var prodLongDesc = document.getElementById('detail-product-long-desc');
        prodLongDesc.value = data.descriptionLong;

        var prodQuantity = document.getElementById('detail-product-smartbill-stock-left');
        prodQuantity.value = data.quantity;

        var prodPrice = document.getElementById('detail-product-price');
        prodPrice.value = data.price;

        var prodImg = document.getElementById('detail-product-img-upload');
        prodImg.value = data.photoPaths;
    });
}

function saveProductEdits() {
    let requestObj = {}

    requestObj["productId"] = document.getElementById('detail-product-internal-code').value;
    requestObj["codIdentificareSmartBill"] = document.getElementById('detail-product-smartbill-code').value;
    requestObj["name"] = document.getElementById('detail-product-name').value;
    requestObj["price"] = document.getElementById('detail-product-price').value;
    requestObj["descriptionShort"] = document.getElementById('detail-product-short-desc').value;
    requestObj["descriptionLong"] = document.getElementById('detail-product-long-desc').value;
    requestObj["brand"] = document.getElementById('detail-product-brand').value;
    requestObj["categories"] = document.getElementById('detail-product-categories').value;
    requestObj["isVisible"] = document.getElementById('detail-product-smartbill-is-visible').checked;
    requestObj['image'] = document.getElementById('detail-product-img-upload').value;
    
    console.log(requestObj);

    const productEditUrl = CONSTS.URLS.backendDevUrl + 'app/edit-product-working';
    fetch(productEditUrl, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestObj),
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

        if(data.name == "Editing succesful!") {
            document.getElementById('success-message-editing').style.display = "block";

            setTimeout(function() {document.getElementById('success-message-editing').style.display = "none";}, 3000);
        }
    });

}

function getAllProducts() {
    var saveModifications = document.getElementById('save-product-button');
    saveModifications.addEventListener('click', function() {
        saveProductEdits();
    })

    var searchProdByCodeButton = document.getElementById('search-product-smartbill-code');
    searchProdByCodeButton.addEventListener('click', function() {
        searchProductByCode();
    });
    
    let productsUrl = CONSTS.URLS.backendDevUrl + 'app/product/products-filtered?';

    fetch(productsUrl, {
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
        //console.log(data);

        var prodList = document.getElementById('admin-page-all-products-wrapper');

        for(let i = 0; i < data.length; i++) {
            let newTableRow = document.createElement('tr');

            let codSmartbillColumn = document.createElement('td');
            codSmartbillColumn.className = "admin-page-all-products-table-column";
            codSmartbillColumn.innerText = data[i].codIdentificareSmartbill;

            let numeSmartbillColumn = document.createElement('td');
            numeSmartbillColumn.className = "admin-page-all-products-table-column";
            numeSmartbillColumn.innerText = data[i].smartbillName;

            let numeSiteColumn = document.createElement('td');
            numeSiteColumn.className = "admin-page-all-products-table-column";
            numeSiteColumn.innerText = data[i].name;

            let isVisibleColumn = document.createElement('td');
            isVisibleColumn.className = "admin-page-all-products-table-column";
            isVisibleColumn.innerText = data[i].isVisible;

            newTableRow.appendChild(codSmartbillColumn);
            newTableRow.appendChild(numeSmartbillColumn);
            newTableRow.appendChild(numeSiteColumn);
            newTableRow.appendChild(isVisibleColumn);

            newTableRow.addEventListener('dblclick', function() {
                document.getElementById('product-smartbill-code').value = data[i].codIdentificareSmartbill;
                searchProductByCode();
            });

            prodList.appendChild(newTableRow);
        }
    });
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
        const categoriesZone = document.getElementById('categories-zone');

        for(let i = 0; i < data.length; i++) {
            let div1 = document.createElement('div');
            div1.className = "col-lg-3 col-md-4 col-sm-6 pb-1";

            let a1 = document.createElement('a');
            a1.className = "text-decoration-none";

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

            let small2 = document.createElement('small');
            small2.style.color = "red";
            small2.innerText = "ȘTERGE CATEGORIA";
            small2.style.display = "block";
            small2.style.cursor = "pointer";

            small2.addEventListener('click', function() {
                deleteCategory(data[i].name)
            });

            div4.appendChild(h6);
            div4.appendChild(small);
            div4.appendChild(small2);

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