import {populateHeader} from "./components/header.js";

async function populatePage() {
    await populateHeader();
}

populatePage().then(r => console.log("Page populated"))
