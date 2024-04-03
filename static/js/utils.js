const pathname = window.location.pathname;
const locationSearch = decodeURIComponent(window.location.search);

function capitalizeFirstLetters(str) {
    if (!str || str.length === 0) {
        return str;
    }

    let prevSpace = true;
    let newStr = "";
    for (let i = 0; i < str.length; i++) {
        const charAt = str.charAt(i);
        if (prevSpace) {
            newStr += charAt.toUpperCase();
        } else {
            newStr += charAt;
        }
        prevSpace = charAt === ' ';
    }
    return newStr;
}

export {
    pathname,
    locationSearch,
    capitalizeFirstLetters
}
