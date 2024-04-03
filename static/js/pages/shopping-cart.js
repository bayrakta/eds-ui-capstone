import {clearShoppingCart, loadShoppingCart} from "../components/shopping-cart.js";

function checkout() {
    alert("Check out coming soon ;)");
}

function removeAll() {
    clearShoppingCart();

    const tbody = document.querySelector("tbody");
    tbody.textContent = "";
    populateShoppingCartTable()
        .then(r => console.log("Shopping cart re-loaded."));
}

async function populateShoppingCartTable() {
    const pageContentWrapper = document.querySelector(".page-content-wrapper");
    const shoppingCartTable = pageContentWrapper.querySelector(".shopping-cart-table");
    const tbody = shoppingCartTable.querySelector("tbody");
    const checkoutButton = pageContentWrapper.querySelector(".checkout");
    checkoutButton.addEventListener("click", checkout);
    const removeAllButton = pageContentWrapper.querySelector(".remove-all");
    removeAllButton.addEventListener("click", removeAll);

    const dataUrl = "https://fakestoreapi.com/products";

    const shoppingCartJson = loadShoppingCart();

    // Test to see if the browser supports the HTML template element by checking
    // for the presence of the template element's content attribute.
    if (tbody
        && shoppingCartJson
        && shoppingCartJson.length > 0
        && "content" in document.createElement("template")) {
        const rowTemplate = document.querySelector("#shopping-cart-table-row");
        const rowTemplateContent = rowTemplate.content;

        fetch(dataUrl)
            .then((res) => res.json())
            .then((json) => {
                const productsMap = new Map();
                if (json && json.length > 0) {
                    for (const productJson of json) {
                        productsMap.set(productJson.id, productJson);
                    }

                    let totalQuantity = 0;
                    let totalPrice = 0;
                    for (const cartItem of shoppingCartJson) {
                        const productJson = productsMap.get(Number(cartItem.id));
                        if (!productJson) {
                            continue;
                        }
                        const quantity = cartItem.count;
                        totalQuantity += quantity;
                        totalPrice += (quantity * productJson.price);

                        const cartRow = createCartRow(rowTemplateContent, productJson, quantity);
                        if (cartRow) {
                            tbody.appendChild(cartRow);
                        }
                    }
                    const summaryProduct = {id:-1, price : totalPrice};
                    const summaryRow = createCartRow(rowTemplateContent, summaryProduct, totalQuantity);
                    if (summaryRow) {
                        tbody.appendChild(summaryRow);
                    }
                }
            });
    }
}


function createCartRow(rowTemplateContent, productJson, quantity) {
    if (!rowTemplateContent || !productJson) {
        return undefined;
    }

    // Clone the template content and populate its content
    const clone = rowTemplateContent.cloneNode(true);

    const tdArray = clone.querySelectorAll("td");
    const summarySpanArray = tdArray[0].querySelectorAll("span");
    const summaryImage = summarySpanArray[0].querySelector("img");

    let totalPrice = productJson.price;
    if (productJson.id >= 0) {
        summaryImage.src = productJson.image;
        summaryImage.alt = productJson.title;
        summarySpanArray[1].textContent = productJson.title;
        totalPrice = quantity * productJson.price;
    } else {
        summaryImage.parentNode.removeChild(summaryImage);
        summarySpanArray[0].textContent = "SUBTOTAL";
    }

    tdArray[1].textContent = quantity.toString();
    tdArray[2].textContent = "$" + totalPrice.toString();

    return clone;
}

populateShoppingCartTable()
    .then(r => console.log("Shopping cart loaded."));
