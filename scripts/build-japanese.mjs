import fs from "node:fs/promises";
import path from "node:path";

function readTranslation(raw) {
    const normalized = raw.replace(/\r\n?/g, "\n");
    const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) throw new Error("Japanese articles need front matter and a Markdown body.");
    const attributes = Object.fromEntries(match[1].split("\n").map((line) => {
        const index = line.indexOf(":");
        return index > 0 ? [line.slice(0, index).trim(), line.slice(index + 1).trim()] : null;
    }).filter(Boolean));
    if (!attributes.title || !attributes.summary || !match[2].trim()) {
        throw new Error("Japanese articles need a title, summary and full body.");
    }
    return { attributes, markdown: match[2].trim() };
}

const asset = (value) => value && !/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(value) ? `../${value.replace(/^\.\//, "")}` : value;
const escapeXml = (value) => String(value).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&apos;" })[c]);

export async function buildJapaneseSite({ rootDir, siteConfig, manifest }) {
    const localeDir = path.join(rootDir, "locales", "ja");
    const outputDir = path.join(rootDir, "ja");
    const dictionary = JSON.parse(await fs.readFile(path.join(localeDir, "ui.json"), "utf8"));
    const translations = Object.entries(dictionary).sort((a, b) => b[0].length - a[0].length);
    const translate = (text) => translations.reduce((result, [zh, ja]) => result.split(zh).join(ja), text);
    const blogs = await Promise.all(manifest.blogs.map(async (original) => {
        const { attributes, markdown } = readTranslation(await fs.readFile(path.join(localeDir, "blogs", `${original.slug}.md`), "utf8"));
        const tags = attributes.tags ? attributes.tags.split(",").map((tag) => tag.trim()) : original.tags.map(translate);
        // Links in translated Markdown use the original article's asset folder.
        const body = markdown.replace(/(!?\[[^\]]*\]\()([^)]+)(\))/g, (match, prefix, target, suffix) => {
            if (/^(?:[a-z][a-z\d+.-]*:|\/|#)/i.test(target)) return match;
            const resolved = path.posix.normalize(`blogs/${original.slug}/${target}`);
            return `${prefix}../${resolved}${suffix}`;
        });
        return { ...original, title: attributes.title, summary: attributes.summary, category: translate(original.category), tags, coverImage: asset(original.coverImage), markdown: body };
    }));
    const albumTranslations = JSON.parse(await fs.readFile(path.join(localeDir, "album.json"), "utf8"));
    const album = manifest.album.map((original) => {
        const translation = albumTranslations[original.slug];
        if (!translation?.title || !translation.summary || !translation.markdown) throw new Error(`Missing Japanese essay: ${original.slug}`);
        if (translation.imageAlts.length !== original.images.length) throw new Error(`Japanese gallery mismatch: ${original.slug}`);
        return { ...original, ...translation, tags: original.tags.map(translate), image: asset(original.image), images: original.images.map((image, index) => ({ ...image, src: asset(image.src), alt: translation.imageAlts[index] })) };
    });
    const gameTranslations = JSON.parse(await fs.readFile(path.join(localeDir, "games.json"), "utf8"));
    const games = manifest.games.map((original) => {
        const translation = gameTranslations[original.slug];
        if (!translation?.title || !translation.summary || !translation.review || !translation.status) throw new Error(`Missing Japanese game review: ${original.slug}`);
        if (translation.images.length !== original.images.length || translation.sources.length !== original.sources.length) throw new Error(`Japanese game assets mismatch: ${original.slug}`);
        return { ...original, ...translation, images: original.images.map((image, index) => ({ ...image, ...translation.images[index], src: asset(image.src) })), sources: original.sources.map((source, index) => ({ ...source, title: translation.sources[index] })) };
    });
    const config = { ...siteConfig, title: translate(siteConfig.title), description: translate(siteConfig.description), focus: translate(siteConfig.focus), life: translate(siteConfig.life), bio: translate(siteConfig.bio), avatar: asset(siteConfig.avatar), siteUrl: siteConfig.siteUrl ? `${siteConfig.siteUrl.replace(/\/$/, "")}/ja` : "", background: { ...siteConfig.background, ...Object.fromEntries(["mobileImage", "poster", "webm", "mp4"].map((key) => [key, asset(siteConfig.background[key])])) } };
    await fs.mkdir(outputDir, { recursive: true });
    await fs.writeFile(path.join(outputDir, "content-manifest.js"), `window.CONTENT_MANIFEST = ${JSON.stringify({ ...manifest, blogs, album, games }, null, 4)};\n`);
    await fs.writeFile(path.join(outputDir, "site-config.js"), `window.SITE_CONFIG = ${JSON.stringify(config, null, 4)};\n`);
    const sourceScript = await fs.readFile(path.join(rootDir, "script.js"), "utf8");
    const localizedScript = translate(sourceScript)
        .replace('Intl.DateTimeFormat("zh-CN"', 'Intl.DateTimeFormat("ja-JP"')
        .replace(/(["'`])src\//g, "$1../src/");
    await fs.writeFile(path.join(outputDir, "script.js"), localizedScript);
    for (const file of ["index.html", "blog.html", "game.html"]) {
        let html = translate(await fs.readFile(path.join(rootDir, file), "utf8"))
            .replace('<html lang="zh-CN">', '<html lang="ja">')
            .replace(/((?:href|src)=")(style\.css|theme\.css|retro\.css|\.?\/?src\/)/g, "$1../$2")
            .replace(/\.\.\/\.\/src\//g, "../src/")
            .replace(/href="ja\/(index|blog|game)\.html" lang="ja" hreflang="ja" data-language-switch>日本語/g, 'href="../$1.html" lang="zh-CN" hreflang="zh-CN" data-language-switch>中文');
        html = html.replace(/\s*<link rel="alternate" hreflang="[^"]+"[^>]*>/g, "");
        if (siteConfig.siteUrl) {
            const pageUrl = `${config.siteUrl}/${file === "index.html" ? "" : file}`;
            html = html.replace(/(<link rel="canonical" href=")[^"]+/, `$1${escapeXml(pageUrl)}`)
                .replace(/(<meta property="og:url" content=")[^"]+/, `$1${escapeXml(pageUrl)}`)
                .replace(/(<link rel="alternate" type="application\/rss\+xml"[^>]*href=")[^"]+/, `$1${escapeXml(`${config.siteUrl}/rss.xml`)}`);
        }
        const alternate = `\n    <link rel="alternate" hreflang="zh-CN" href="${siteConfig.siteUrl || ".."}/${file}">\n    <link rel="alternate" hreflang="ja" href="${config.siteUrl || "."}/${file}">`;
        html = html.replace("</head>", `${alternate}\n</head>`);
        await fs.writeFile(path.join(outputDir, file), html);
    }
    const root = config.siteUrl || ".";
    const items = blogs.map((blog) => `<item><title>${escapeXml(blog.title)}</title><link>${escapeXml(`${root}/blog.html?slug=${blog.slug}`)}</link><guid>${escapeXml(`${root}/blog.html?slug=${blog.slug}`)}</guid><pubDate>${new Date(blog.written || blog.date).toUTCString()}</pubDate><description>${escapeXml(blog.summary)}</description></item>`).join("\n");
    await fs.writeFile(path.join(outputDir, "rss.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>${escapeXml(config.name)} · 技術ノート</title><link>${escapeXml(root)}</link><description>${escapeXml(config.description)}</description><language>ja</language>${items}</channel></rss>\n`);
    console.log(`Generated /ja/: ${blogs.length} articles, ${album.length} essays, ${games.length} game reviews.`);
}
