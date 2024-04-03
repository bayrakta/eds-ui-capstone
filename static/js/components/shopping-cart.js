const SHOPPING_CART_STORAGE_KEY = "shoppingCart";

function loadShoppingCart() {
    let cartJsonText = localStorage.getItem(SHOPPING_CART_STORAGE_KEY);
    if (!cartJsonText) {
        cartJsonText = "[]";
    }
    return JSON.parse(cartJsonText);
}

function clearShoppingCart() {
    const cartJsonText = "[]";
    localStorage.setItem(SHOPPING_CART_STORAGE_KEY, cartJsonText);

    populateCart();
}

function populateCart() {
    const cartJson = loadShoppingCart();
    let counter = 0;
    for (const cartItem of cartJson) {
        counter += cartItem.count;
    }

    document.getElementById("basketBadge").innerHTML = counter.toString();
}

function saveShoppingCart(shoppingCart) {
    const cartJsonText = JSON.stringify(shoppingCart);
    localStorage.setItem(SHOPPING_CART_STORAGE_KEY, cartJsonText);
    populateCart();
}

function addToShoppingCart(e) {
    e = e || window.event;
    let button = e.currentTarget;
    // Example : data-href="location.href='/pages/category.html?category=women'"
    const productId = button.dataset.productId;

    const cartJson = loadShoppingCart();
    let incremented = false;
    for (const cartItem of cartJson) {
        if (cartItem.id === productId) {
            cartItem.count += 1;
            incremented = true;
            break;
        }
    }

    if (!incremented) {
        cartJson.push({id: productId, count: 1});
    }
    saveShoppingCart(cartJson);

    e.stopPropagation();
}

function updateShoppingCart(productId, count) {
    if (!productId) {
        return;
    }

    const shoppingCart = loadShoppingCart();
    const updatedShoppingCart = [];
    let added = false;
    for (let i= 0; i < shoppingCart.length; i++) {
        const shoppingCartItem = shoppingCart[i];
        if (shoppingCartItem.id === productId) {
            shoppingCartItem.count = count;
            if (count > 0) {
                updatedShoppingCart.push(shoppingCartItem);
            }
        } else {
            updatedShoppingCart.push(shoppingCartItem);
        }
    }
    saveShoppingCart(updatedShoppingCart);
}

//populateCart();

export {
    populateCart,
    addToShoppingCart,
    loadShoppingCart,
    updateShoppingCart,
    clearShoppingCart
}
