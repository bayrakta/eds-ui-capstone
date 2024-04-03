import {locationSearch, capitalizeFirstLetters} from "../utils.js";
import {addToShoppingCart} from "../components/shopping-cart.js";

async function populateProducts() {
    const category = new URLSearchParams(locationSearch).get("category");
    const pageContentWrapper = document.querySelector(".page-content-wrapper");
    const pageContentHeader = pageContentWrapper.querySelector(".page-content-header");
    const productsSection = pageContentWrapper.querySelector(".products");

    let dataUrl = "https://fakestoreapi.com/products";
    if (category && category.length > 0) {
        dataUrl += "/category/" + category;
        pageContentHeader.innerHTML = capitalizeFirstLetters(category);
    } else {
        pageContentHeader.innerHTML = "All Products";
    }

    // Test to see if the browser supports the HTML template element by checking
    // for the presence of the template element's content attribute.
    if (productsSection && "content" in document.createElement("template")) {
        const productTemplate = document.querySelector("#productTemplate");
        const productTemplateContent = productTemplate.content;

        fetch(dataUrl)
            .then((res) => res.json())
            .then((json) => {
                if (json && json.length > 0) {
                    for (const productJson of json) {
                        const productElement = createProductItem(productTemplateContent, productJson);
                        if (productElement) {
                            productsSection.appendChild(productElement);
                        }
                    }
                }
            });
    } else {
        // The HTML template element is not supported.
        console.error("The HTML template element is not supported.");
    }
}


function createProductItem(productTemplateContent, productJson) {
    if (!productTemplateContent || !productJson) {
        return undefined;
    }

    // Clone the template content and populate its content
    const clone = productTemplateContent.cloneNode(true);

    const productImage = clone.querySelector(".product-image");
    const productImageImg = productImage.querySelector("img");

    const productTitleLink = clone.querySelector(".product-title-link");
    const productTitleText = productTitleLink.querySelector(".product-title-text");

    const productPriceLink = clone.querySelector(".product-price-link");
    const productPriceText = productPriceLink.querySelector(".product-price-text");
    const likeButton = clone.querySelector("button");

    const altText = productJson.title;
    const queryStr = "id=" + productJson.id;
    const productDetailsHref = "/pages/product-details.html?" + queryStr;
    productImageImg.src = productJson.image;
    productImageImg.alt = altText;

    productImage.href = productDetailsHref;
    productTitleLink.href = productDetailsHref;
    productTitleText.innerText = productJson.title;
    productPriceLink.href = productDetailsHref;
    productPriceText.innerText = "$" + productJson.price;
    likeButton.dataset.productId = productJson.id;
    likeButton.addEventListener("click", addToShoppingCart);

    return clone;
}

populateProducts()
    .then(r => console.log("Products loaded."));
