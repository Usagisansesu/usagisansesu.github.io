import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const types = {
    ".html": "text/html; charset=utf-8",
    ".css": "text/css; charset=utf-8",
    ".js": "text/javascript; charset=utf-8",
    ".json": "application/json; charset=utf-8",
    ".svg": "image/svg+xml",
    ".png": "image/png",
    ".jpg": "image/jpeg",
    ".jpeg": "image/jpeg",
    ".webm": "video/webm",
    ".mp4": "video/mp4",
    ".xml": "application/xml; charset=utf-8",
    ".txt": "text/plain; charset=utf-8"
};

http.createServer(async (request, response) => {
    try {
        const pathname = decodeURIComponent(new URL(request.url, "http://localhost").pathname);
        const target = path.resolve(root, `.${pathname === "/" ? "/index.html" : pathname}`);
        const relative = path.relative(root, target);
        if (relative.startsWith("..") || path.isAbsolute(relative) || relative.split(path.sep).some(part => part.startsWith("."))) {
            response.writeHead(403).end("Forbidden");
            return;
        }
        const body = await fs.readFile(target);
        response.writeHead(200, {
            "Content-Type": types[path.extname(target)] || "application/octet-stream",
            "Cache-Control": "no-store"
        });
        response.end(request.method === "HEAD" ? undefined : body);
    } catch {
        response.writeHead(404).end("Not found");
    }
}).listen(4173, "127.0.0.1", () => {
    console.log("Preview: http://127.0.0.1:4173");
});
