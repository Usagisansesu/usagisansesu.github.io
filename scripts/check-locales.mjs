import assert from "node:assert/strict";
import fs from "node:fs/promises";
import path from "node:path";
import vm from "node:vm";

const root = process.cwd();
async function readGlobal(file, key) {
    const context = { window: {} };
    vm.runInNewContext(await fs.readFile(file, "utf8"), context);
    return JSON.parse(JSON.stringify(context.window[key]));
}
const zh = await readGlobal("content-manifest.js", "CONTENT_MANIFEST");
const ja = await readGlobal("ja/content-manifest.js", "CONTENT_MANIFEST");
const config = await readGlobal("ja/site-config.js", "SITE_CONFIG");
const cpp = (text) => [...text.matchAll(/```cpp\n([\s\S]*?)```/g)].map((match) => match[1]);
const tables = (text) => text.split("\n").filter((line) => line.startsWith("|")).map((line) => [...line.matchAll(/-?\d+(?:\.\d+)?/g)].map((match) => match[0]));
const links = (text) => [...text.matchAll(/\]\((https?:[^)]+)\)/g)].map((match) => match[1]);
const assets = new Set();
for (const collection of ["blogs", "album", "games"]) {
    assert.deepEqual(ja[collection].map((item) => item.slug), zh[collection].map((item) => item.slug), `${collection}: content missing or reordered`);
    for (let index = 0; index < zh[collection].length; index++) {
        const original = zh[collection][index];
        const translated = ja[collection][index];
        assert.equal(translated.date, original.date, `${original.slug}: date changed`);
        for (const field of ["title", "summary", collection === "games" ? "review" : "markdown"]) {
            assert.ok(translated[field]?.trim(), `${original.slug}: missing ${field}`);
        }
        if (collection === "blogs") {
            assert.deepEqual(cpp(translated.markdown), cpp(original.markdown), `${original.slug}: C++ changed`);
            assert.deepEqual(tables(translated.markdown), tables(original.markdown), `${original.slug}: table data changed`);
            assert.deepEqual(links(translated.markdown), links(original.markdown), `${original.slug}: external sources changed`);
            assert.equal((translated.markdown.match(/^## /gm) || []).length, (original.markdown.match(/^## /gm) || []).length, `${original.slug}: sections missing`);
            assert.equal(translated.seriesOrder, original.seriesOrder);
            assert.equal(translated.period, original.period);
            assert.equal(translated.written, original.written);
            assert.ok(/[ぁ-んァ-ヶ]/.test(translated.markdown), `${original.slug}: Japanese body missing`);
            for (const match of translated.markdown.matchAll(/\]\((\.\.\/[^)]+)\)/g)) assets.add(match[1]);
        }
        if (collection === "games") {
            assert.equal(translated.score, original.score, `${original.slug}: score changed`);
            assert.equal(translated.review.split(/\n\n/).length, original.review.split(/\n\n/).length, `${original.slug}: review paragraphs missing`);
            assert.deepEqual(translated.sources.map((source) => source.url), original.sources.map((source) => source.url));
        }
        if (original.images) {
            assert.equal(translated.images.length, original.images.length, `${original.slug}: images missing`);
            original.images.forEach((image, i) => assert.equal(translated.images[i].src, `../${image.src}`));
            translated.images.forEach((image) => assets.add(image.src));
        }
        if (translated.coverImage) assets.add(translated.coverImage);
    }
}
assets.add(config.avatar);
for (const key of ["mobileImage", "poster", "webm", "mp4"]) assets.add(config.background[key]);
for (const resource of assets) {
    if (/^https?:/.test(resource)) continue;
    await fs.access(path.resolve(root, "ja", decodeURIComponent(resource)));
}
for (const file of ["index.html", "blog.html", "game.html"]) {
    const original = await fs.readFile(file, "utf8");
    const translated = await fs.readFile(`ja/${file}`, "utf8");
    const ids = (html) => [...html.matchAll(/\bid="([^"]+)"/g)].map((match) => match[1]);
    const tags = (html) => [...html.matchAll(/<\/?([a-z][a-z\d-]*)\b[^>]*>/gi)].map((match) => `${match[0][1] === "/" ? "/" : ""}${match[1]}`);
    assert.deepEqual(ids(translated), ids(original), `${file}: IDs differ`);
    assert.deepEqual(tags(translated), tags(original), `${file}: layout structure differs`);
    assert.ok(translated.includes('<html lang="ja">'));
    assert.ok(translated.includes('data-language-switch>中文'));
    assert.ok(original.includes('data-language-switch>日本語'));
    for (const match of translated.matchAll(/(?:src|href)="([^"#]+)"/g)) {
        if (/^(?:https?:|mailto:)/.test(match[1])) continue;
        await fs.access(path.resolve(root, "ja", match[1].split(/[?#]/)[0]));
    }
}
for (const file of ["script.js", "ja/script.js"]) new vm.Script(await fs.readFile(file, "utf8"), { filename: file });
assert.ok((await fs.readFile("ja/rss.xml", "utf8")).includes("<language>ja</language>"));
console.log(`Locale checks passed: ${ja.blogs.length} articles, ${ja.games.length} reviews, ${ja.album.length} essays; code, tables, dates, scores, images and layout preserved.`);
