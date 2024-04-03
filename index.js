//import * as fs from "node:fs";
//import * as http from "node:http";
//import * as path from "node:path";

const fs = require('node:fs');
const http = require('node:http');
const path = require('node:path');
const velocity = require('velocityjs');

const PORT = 8000;

const MIME_TYPES = {
    default: "application/octet-stream",
    html: "text/html; charset=UTF-8",
    js: "application/javascript",
    css: "text/css",
    png: "image/png",
    jpg: "image/jpg",
    gif: "image/gif",
    ico: "image/x-icon",
    svg: "image/svg+xml",
};

const STATIC_PATH = path.join(process.cwd(), "./static");

const toBool = [() => true, () => false];

function processVmTemplate(vmPath, vmContext) {
    try {
        const vmTemplateContent = fs.readFileSync(vmPath, 'utf-8');
        const macros = {};
        return velocity.render(vmTemplateContent, vmContext);
        // option 2
        // velocityContent = new velocity.Compile(vmTemplateContent).render(vmContext);

        // option 3
        // const asts = velocity.parse(vmTemplateContent);
        // velocityContent = (new velocity.Compile(asts)).render(vmContext, macros);
    } catch (err) {
        console.error(err);
    }
    return undefined;
}

const prepareFile = async (url) => {
    let resourcePath = url;
    let queryString = "";
    if (url.indexOf("?") > -1) {
        resourcePath = url.substring(0, url.indexOf("?"));
        queryString = url.substring(url.indexOf("?") + 1);
        console.log("resourcePath: " + resourcePath + ", queryString: " + queryString)
    }
    const paths = [STATIC_PATH, resourcePath];
    if (!resourcePath || resourcePath.length === 0 || resourcePath.endsWith("/")) paths.push("pages/index.html");
    const filePath = path.join(...paths);
    const exists = await fs.promises.access(filePath).then(...toBool);
    const pathTraversal = !filePath.startsWith(STATIC_PATH);

    let found = false;
    let ext = "";
    const fileExtname = path.extname(filePath);
    if (fileExtname && fileExtname.length > 0) {
        ext = fileExtname.substring(1).toLowerCase();
    }

    console.log("filePath: " + filePath + ", exists: " + exists + ", fileExtname: " + fileExtname + ", ext: " + ext);
    if (pathTraversal || exists) {
        if (pathTraversal) {
            // returns 404.html
            ext = "html";
            streamPath = STATIC_PATH + "/404.html";
        } else if (exists) {
            found = true;
            streamPath = filePath;
        }
        const stream = fs.createReadStream(streamPath);
        return { found, ext, stream };
    }

    let vmResourcePath = "";
    if (ext === "html") {
        const resourceDirname = path.dirname(filePath);
        const resourcePathWithoutExt = path.basename(filePath, '.html');
        vmResourcePath = path.join(resourceDirname, resourcePathWithoutExt + ".vm");
        found = await fs.promises.access(vmResourcePath).then(...toBool);
    }

    if (!found) {
        // returns 404.html
        found = false;
        ext = "html";
        streamPath = STATIC_PATH + "/404.html";
        const stream = fs.createReadStream(streamPath);
        return { found, ext, stream };
    } else {
        const resourceDirname = path.dirname(filePath);
        const headerVmPath = path.join(resourceDirname, "_header.vm");
        const footerVmPath = path.join(resourceDirname, "_footer.vm");
        const vmContext = {sampleField : "sample text"};

        const headerContent = processVmTemplate(headerVmPath, vmContext);
        const pageContent = processVmTemplate(vmResourcePath, vmContext);
        const footerContent = processVmTemplate(footerVmPath, vmContext);

        const velocityContent = headerContent + pageContent + footerContent;

        return { found, ext, velocityContent };
    }
};

http
    .createServer(async (req, res) => {
        const file = await prepareFile(req.url);
        const statusCode = file.found ? 200 : 404;
        console.log("file.ext: " + file.ext);
        const mimeType = MIME_TYPES[file.ext] || MIME_TYPES.default;
        res.writeHead(statusCode, { "Content-Type": mimeType });

        if (file.velocityContent) {
            res.end(file.velocityContent);
        } else {
            file.stream.pipe(res);
        }
        console.log(`${req.method} ${req.url} ${statusCode}`);
    })
    .listen(PORT);

console.log(`Server running at http://127.0.0.1:${PORT}/`);
