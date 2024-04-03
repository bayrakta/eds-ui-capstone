import {populateCart} from "./shopping-cart.js";
import {pathname, locationSearch} from "../utils.js";

const hamburger = document.querySelector(".hamburger");
const navMenu = document.querySelector(".nav-menu");
const navLink = document.querySelectorAll(".nav-link");

function navLinkClickHandler(e) {
    closeMenu();

    e = e || window.event;
    let button = e.currentTarget;
    // Example : data-href="location.href='/pages/category.html?category=women'"
    window.location = button.dataset.href;
}

function mobileMenu() {
    hamburger.classList.toggle("active");
    navMenu.classList.toggle("active");
}

function closeMenu() {
    hamburger.classList.remove("active");
    navMenu.classList.remove("active");
}

function resizeHandler() {
    closeMenu();
}

async function populateHeader() {
    hamburger.addEventListener("click", mobileMenu);
    navLink.forEach(n => {
        n.addEventListener("click", navLinkClickHandler);
        if (n.dataset.href) {
            const linkHref = n.dataset.href;
            if (linkHref  === pathname || linkHref === pathname + locationSearch) {
                n.classList.add("active-nav");
            }
        }
    });
    window.addEventListener("resize", resizeHandler);
    populateCart();
}


export {
    populateHeader
}
