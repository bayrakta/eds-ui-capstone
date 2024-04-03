import {locationSearch} from "../utils.js";
import {addToShoppingCart} from "../components/shopping-cart.js";

async function populateProductDetails() {
    const productId = new URLSearchParams(locationSearch).get("id");
    const dataUrl = "https://fakestoreapi.com/products/" + productId;

    fetch(dataUrl)
        .then((res) => res.json())
        .then((json) => {
            if (json) {
                const pageContentWrapper = document.querySelector(".page-content-wrapper");
                const pageContentHeader = pageContentWrapper.querySelector(".page-content-header");
                const productDetailsSection = pageContentWrapper.querySelector(".product-details");
                const productDescription = productDetailsSection.querySelector(".product-description-text");
                const productImageImg = productDetailsSection.querySelector("img");
                const likeButton = productDetailsSection.querySelector("button");
                const likeButtonImg = likeButton.querySelector("img");

                const altText = json.title;

                pageContentHeader.innerHTML = json.title;
                productImageImg.src = json.image;
                productImageImg.alt = altText;
                productDescription.innerHTML = json.description;

                likeButton.dataset.productId = json.id;
                likeButton.addEventListener("click", addToShoppingCart);
                likeButtonImg.dataset.productId = json.id;
                likeButtonImg.addEventListener("click", addToShoppingCart);
            }
        });
}

populateProductDetails()
    .then(r => console.log("Product details loaded."));
