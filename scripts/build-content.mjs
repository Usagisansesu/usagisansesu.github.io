import fs from "node:fs/promises";
import path from "node:path";

const rootDir = process.cwd();
const siteConfig = JSON.parse(await fs.readFile(path.join(rootDir, "site.config.json"), "utf8"));
const siteTitle = siteConfig.name || siteConfig.title || "研究与创作";
const outputFile = path.join(rootDir, "content-manifest.js");
const siteUrl = (siteConfig.siteUrl || "").replace(/\/$/, "");
const rssFile = path.join(rootDir, "rss.xml");
const sitemapFile = path.join(rootDir, "sitemap.xml");
const robotsFile = path.join(rootDir, "robots.txt");
const htmlFiles = ["index.html", "blog.html", "game.html"].map((fileName) => path.join(rootDir, fileName));

const IMAGE_EXTENSIONS = new Set([".png", ".jpg", ".jpeg", ".webp", ".gif", ".avif"]);

async function getDirectories(baseDir) {
    try {
        const entries = await fs.readdir(baseDir, { withFileTypes: true });
        return entries.filter((entry) => entry.isDirectory()).map((entry) => entry.name);
    } catch {
        return [];
    }
}

function parseFrontMatter(markdown) {
    markdown = markdown.replace(/^\uFEFF/, "").replace(/\r\n?/g, "\n");
    if (!markdown.startsWith("---\n")) {
        return {
            attributes: {},
            body: markdown
        };
    }

    const closingIndex = markdown.indexOf("\n---\n", 4);
    if (closingIndex === -1) {
        return {
            attributes: {},
            body: markdown
        };
    }

    const rawFrontMatter = markdown.slice(4, closingIndex).trim();
    const body = markdown.slice(closingIndex + 5).trim();
    const attributes = {};

    rawFrontMatter.split(/\r?\n/).forEach((line) => {
        const separatorIndex = line.indexOf(":");
        if (separatorIndex === -1) {
            return;
        }

        const key = line.slice(0, separatorIndex).trim();
        const value = line.slice(separatorIndex + 1).trim();
        attributes[key] = value;
    });

    return {
        attributes,
        body
    };
}

function toUrlPath(filePath) {
    const relativePath = path.relative(rootDir, filePath);
    return relativePath
        .split(path.sep)
        .map((segment) => encodeURIComponent(segment))
        .join("/");
}

function normalizeTags(rawTags) {
    if (!rawTags) {
        return [];
    }

    return rawTags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);
}

function xmlEscape(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&apos;");
}

function sitePath(pathname = "") {
    return `${siteUrl || "."}/${pathname.replace(/^\/+/, "")}`;
}

function blogUrl(blog) {
    return sitePath(`blog.html?slug=${encodeURIComponent(blog.slug)}`);
}

function stripMarkdown(markdown) {
    return markdown
        .replace(/```[\s\S]*?```/g, " ")
        .replace(/`([^`]+)`/g, "$1")
        .replace(/!\[[^\]]*\]\([^)]+\)/g, " ")
        .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
        .replace(/^#{1,6}\s+/gm, "")
        .replace(/^>\s?/gm, "")
        .replace(/^[-*+]\s+/gm, "")
        .replace(/^\d+\.\s+/gm, "")
        .replace(/[*_~]/g, "")
        .replace(/\r?\n+/g, " ")
        .replace(/\s+/g, " ")
        .trim();
}

function extractSummary(markdown, fallbackTitle) {
    const cleaned = stripMarkdown(markdown);
    if (!cleaned) {
        return `${fallbackTitle} 的内容预览将在这里显示。`;
    }

    return cleaned.length > 120 ? `${cleaned.slice(0, 117)}...` : cleaned;
}

function rewriteRelativeMarkdownPaths(markdown, folderPath) {
    return markdown.replace(/(!?\[[^\]]*\]\()([^)]+)(\))/g, (match, prefix, target, suffix) => {
        const value = target.trim();
        if (
            value.startsWith("http://") ||
            value.startsWith("https://") ||
            value.startsWith("mailto:") ||
            value.startsWith("#") ||
            value.startsWith("/")
        ) {
            return match;
        }

        const absoluteTarget = path.resolve(folderPath, value);
        return `${prefix}${toUrlPath(absoluteTarget)}${suffix}`;
    });
}

function extractFirstMarkdownImage(markdown) {
    const match = markdown.match(/!\[[^\]]*\]\(([^)]+)\)/);
    return match?.[1] || "";
}

async function readBlog(folderName) {
    const folderPath = path.join(rootDir, "blogs", folderName);
    const entries = await fs.readdir(folderPath, { withFileTypes: true });
    const markdownEntry = entries.find((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".md"));
    const picDir = entries.find((entry) => entry.isDirectory() && entry.name === "pic");

    if (!markdownEntry) {
        return null;
    }

    const markdownPath = path.join(folderPath, markdownEntry.name);
    const rawMarkdown = await fs.readFile(markdownPath, "utf8");
    const { attributes, body } = parseFrontMatter(rawMarkdown);
    const content = rewriteRelativeMarkdownPaths(body, folderPath);

    let coverImage = extractFirstMarkdownImage(content);
    if (picDir) {
        const picEntries = await fs.readdir(path.join(folderPath, picDir.name), { withFileTypes: true });
        const imageEntry = picEntries.find(
            (entry) => entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())
        );
        if (!coverImage && imageEntry) {
            coverImage = toUrlPath(path.join(folderPath, picDir.name, imageEntry.name));
        }
    }

    return {
        slug: folderName,
        title: attributes.title || folderName,
        date: attributes.date || new Date().toISOString().slice(0, 10),
        category: attributes.category || "未分类",
        period: attributes.period || "",
        written: attributes.written || "",
        series: attributes.series || "",
        seriesOrder: Number(attributes.series_order) || 0,
        summary: attributes.summary || extractSummary(content, folderName),
        tags: normalizeTags(attributes.tags),
        coverImage,
        markdown: content
    };
}

async function readAlbum(folderName) {
    const folderPath = path.join(rootDir, "album", folderName);
    const entries = await fs.readdir(folderPath, { withFileTypes: true });
    const markdownEntry = entries.find((entry) => entry.isFile() && entry.name.toLowerCase().endsWith(".md"));
    const imageEntries = entries.filter(
        (entry) => entry.isFile() && IMAGE_EXTENSIONS.has(path.extname(entry.name).toLowerCase())
    ).sort((left, right) => left.name.localeCompare(right.name, "zh-CN", { numeric: true }));

    if (!markdownEntry) {
        return null;
    }

    const markdownPath = path.join(folderPath, markdownEntry.name);
    const rawMarkdown = await fs.readFile(markdownPath, "utf8");
    const { attributes, body } = parseFrontMatter(rawMarkdown);
    const content = rewriteRelativeMarkdownPaths(body, folderPath);

    const imagesBySource = new Map(imageEntries.map((entry) => {
        const src = toUrlPath(path.join(folderPath, entry.name));
        return [src, { src, alt: attributes.title || folderName }];
    }));
    // Move actual Markdown images into the gallery, preserving image examples in code.
    const textContent = content.split(/(```[\s\S]*?```|`[^`\n]+`)/g).map((part) => {
        if (part.startsWith("`")) return part;
        return part.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
            const source = src.trim();
            const previous = imagesBySource.get(source);
            imagesBySource.set(source, { src: source, alt: alt || previous?.alt || attributes.title || folderName });
            return "";
        });
    }).join("").trim();
    const images = Array.from(imagesBySource.values());
    if (!images.length) return null;

    return {
        slug: folderName,
        title: attributes.title || folderName,
        date: attributes.date || new Date().toISOString().slice(0, 10),
        summary: attributes.summary || extractSummary(textContent, folderName),
        tags: normalizeTags(attributes.tags),
        image: images[0].src,
        images,
        markdown: textContent
    };
}

function sortByDateDescending(left, right) {
    const leftTime = new Date(left.date).getTime();
    const rightTime = new Date(right.date).getTime();
    return rightTime - leftTime || (left.series && left.series === right.series ? right.seriesOrder - left.seriesOrder : 0);
}

async function readGameReviews() {
    const reviews = JSON.parse(await fs.readFile(path.join(rootDir, "games", "reviews.json"), "utf8"));
    if (!Array.isArray(reviews)) throw new Error("games/reviews.json 必须是短评数组。");
    const slugs = new Set();
    return Promise.all(reviews.map(async (review, index) => {
        if (!review || typeof review.title !== "string" || !review.title.trim() || typeof review.review !== "string" || !review.review.trim()) {
            throw new Error(`第 ${index + 1} 条游戏短评需要非空的 title 和 review。`);
        }
        if (review.score != null && (typeof review.score !== "number" || !Number.isFinite(review.score) || review.score < 0 || review.score > 10)) {
            throw new Error(`第 ${index + 1} 条游戏短评的 score 必须是 0 到 10 的数字，或省略。`);
        }
        if (review.date && (!/^\d{4}-\d{2}-\d{2}$/.test(review.date) || Number.isNaN(new Date(review.date).getTime()))) {
            throw new Error(`第 ${index + 1} 条游戏短评的 date 应使用 YYYY-MM-DD 格式。`);
        }
        const slug = String(review.slug || review.title).trim();
        if (!slug || slugs.has(slug)) throw new Error(`第 ${index + 1} 条游戏短评的 slug 为空或重复。`);
        slugs.add(slug);
        if (review.images != null && (!Array.isArray(review.images) || review.images.length > 2)) {
            throw new Error(`第 ${index + 1} 条游戏短评的 images 必须是最多两项的数组。`);
        }
        const images = await Promise.all((review.images || []).map(async (image, imageIndex) => {
            const value = typeof image === "string" ? { src: image } : image;
            if (!value || typeof value.src !== "string" || !value.src.trim()) throw new Error(`第 ${index + 1} 条游戏短评的配图缺少 src。`);
            const src = value.src.trim();
            if (!/^https?:\/\//i.test(src)) {
                if (/^[a-z][a-z\d+.-]*:/i.test(src) || src.startsWith("//")) throw new Error("游戏配图应使用本地相对路径或 HTTP(S) 地址。");
                const relative = path.relative(rootDir, path.resolve(rootDir, src));
                if (relative.startsWith("..") || path.isAbsolute(relative)) throw new Error("游戏配图必须位于项目内。");
                await fs.access(path.join(rootDir, src));
            }
            return { src, alt: String(value.alt || `${review.title.trim()} 配图 ${imageIndex + 1}`), caption: String(value.caption || "") };
        }));
        if (review.sources != null && !Array.isArray(review.sources)) {
            throw new Error(`第 ${index + 1} 条游戏短评的 sources 必须是数组。`);
        }
        const sources = (review.sources || []).map((source) => {
            if (!source || typeof source.title !== "string" || !source.title.trim() || typeof source.url !== "string") {
                throw new Error(`第 ${index + 1} 条游戏短评的来源需要 title 和 url。`);
            }
            let url;
            try {
                url = new URL(source.url);
            } catch {
                throw new Error(`第 ${index + 1} 条游戏短评的来源地址无效。`);
            }
            if (!["http:", "https:"].includes(url.protocol)) {
                throw new Error("游戏资料来源应使用 HTTP(S) 地址。");
            }
            return { title: source.title.trim(), url: url.href };
        });
        const summary = String(review.summary || review.review).trim().replace(/\s+/g, " ");
        return {
            slug,
            title: review.title.trim(),
            review: review.review.trim(),
            summary: summary.length > 140 ? `${summary.slice(0, 140)}…` : summary,
            images,
            sources,
            status: String(review.status || "未分类").trim() || "未分类",
            platform: String(review.platform || "").trim(),
            date: review.date || "",
            score: review.score ?? null
        };
    }));
}

function buildRss(blogs) {
    const latestDate = blogs.map((blog) => blog.written || blog.date).sort().at(-1) || new Date().toISOString().slice(0, 10);
    const items = blogs
        .map((blog) => {
            const url = blogUrl(blog);
            const categories = [blog.category, ...(blog.tags || [])]
                .filter(Boolean)
                .map((tag) => `<category>${xmlEscape(tag)}</category>`)
                .join("");

            return `        <item>
            <title>${xmlEscape(blog.title)}</title>
            <link>${xmlEscape(url)}</link>
            <guid>${xmlEscape(url)}</guid>
            <pubDate>${new Date(blog.written || blog.date).toUTCString()}</pubDate>
            <description>${xmlEscape(blog.summary)}</description>
            ${categories}
        </item>`;
        })
        .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0">
    <channel>
        <title>${xmlEscape(siteTitle)} · 技术笔记</title>
        <link>${xmlEscape(sitePath())}</link>
        <description>${xmlEscape(siteConfig.description)}</description>
        <language>zh-CN</language>
        <lastBuildDate>${new Date(latestDate).toUTCString()}</lastBuildDate>
${items}
    </channel>
</rss>
`;
}

function buildSitemap(blogs, games = []) {
    const staticUrls = [
        {
            loc: sitePath(""),
            lastmod: new Date().toISOString().slice(0, 10),
            priority: "1.0"
        }
    ];

    const blogUrls = blogs.map((blog) => ({
        loc: blogUrl(blog),
        lastmod: blog.date,
        priority: "0.8"
    }));
    const gameUrls = games.map((game) => ({
        loc: sitePath(`game.html?slug=${encodeURIComponent(game.slug)}`),
        lastmod: game.date || new Date().toISOString().slice(0, 10),
        priority: "0.7"
    }));

    const urls = (siteUrl ? [...staticUrls, ...blogUrls, ...gameUrls] : [])
        .map((entry) => `    <url>
        <loc>${xmlEscape(entry.loc)}</loc>
        <lastmod>${xmlEscape(entry.lastmod)}</lastmod>
        <priority>${entry.priority}</priority>
    </url>`)
        .join("\n");

    return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>
`;
}

function buildRobots() {
    return `User-agent: *
Allow: /

${siteUrl ? `Sitemap: ${sitePath("sitemap.xml")}` : "# Configure siteUrl in site.config.json before publishing."}
`;
}

function buildAssetVersion(date = new Date()) {
    return date.toISOString().replace(/\D/g, "").slice(0, 14);
}

async function updateAssetVersions(version) {
    await Promise.all(
        htmlFiles.map(async (htmlFile) => {
            const html = await fs.readFile(htmlFile, "utf8");
            const isHome = path.basename(htmlFile) === "index.html";
            const isGame = path.basename(htmlFile) === "game.html";
            const title = isHome ? siteTitle : `${isGame ? "游戏短评" : "技术笔记"} | ${siteTitle}`;
            const pageUrl = sitePath(isHome ? "" : path.basename(htmlFile));
            const metadata = `<!-- site-meta:start -->
    <title>${xmlEscape(title)}</title>
    <meta name="description" content="${xmlEscape(siteConfig.description)}">
    <meta name="theme-color" content="#fff9fb">
    <meta property="og:type" content="${isHome ? "website" : "article"}">
    <meta property="og:site_name" content="${xmlEscape(siteTitle)}">
    <meta property="og:title" content="${xmlEscape(title)}">
    <meta property="og:description" content="${xmlEscape(siteConfig.description)}">
    ${siteUrl ? `<link rel="canonical" href="${xmlEscape(pageUrl)}">\n    <meta property="og:url" content="${xmlEscape(pageUrl)}">\n    <meta property="og:image" content="${xmlEscape(sitePath(siteConfig.avatar))}">` : '<meta name="robots" content="noindex">'}
    <meta name="twitter:card" content="summary">
    <link rel="alternate" type="application/rss+xml" title="${xmlEscape(siteTitle)} · 技术笔记" href="${xmlEscape(sitePath("rss.xml"))}">
    <!-- site-meta:end -->`;
            const updatedHtml = html
                .replace(/<!-- site-meta:start -->[\s\S]*?<!-- site-meta:end -->/, metadata)
                .replace(/(href="style\.css)(?:\?v=[^"]*)?"/g, `$1?v=${version}"`)
                .replace(/(href="theme\.css)(?:\?v=[^"]*)?"/g, `$1?v=${version}"`)
                .replace(/(src="site-config\.js)(?:\?v=[^"]*)?"/g, `$1?v=${version}"`)
                .replace(/(src="content-manifest\.js)(?:\?v=[^"]*)?"/g, `$1?v=${version}"`)
                .replace(/(src="script\.js)(?:\?v=[^"]*)?"/g, `$1?v=${version}"`);

            await fs.writeFile(htmlFile, updatedHtml, "utf8");
        })
    );
}

async function buildManifest() {
    const blogFolders = await getDirectories(path.join(rootDir, "blogs"));
    const albumFolders = await getDirectories(path.join(rootDir, "album"));

    const blogs = (await Promise.all(blogFolders.map(readBlog))).filter(Boolean).sort(sortByDateDescending);
    const album = (await Promise.all(albumFolders.map(readAlbum))).filter(Boolean).sort(sortByDateDescending);
    const games = await readGameReviews();
    const generatedAt = new Date();

    const manifest = {
        generatedAt: generatedAt.toISOString(),
        blogs,
        album,
        games
    };

    const output = `window.CONTENT_MANIFEST = ${JSON.stringify(manifest, null, 4)};\n`;
    await fs.writeFile(path.join(rootDir, "site-config.js"), `window.SITE_CONFIG = ${JSON.stringify(siteConfig, null, 4)};\n`, "utf8");
    await fs.writeFile(outputFile, output, "utf8");
    await fs.writeFile(rssFile, buildRss(blogs), "utf8");
    await fs.writeFile(sitemapFile, buildSitemap(blogs, games), "utf8");
    await fs.writeFile(robotsFile, buildRobots(), "utf8");
    await updateAssetVersions(buildAssetVersion(generatedAt));

    console.log(
        `Generated ${path.basename(outputFile)}, ${path.basename(rssFile)}, ${path.basename(sitemapFile)}, ${path.basename(robotsFile)}, and refreshed asset versions with ${blogs.length} blog(s), ${album.length} album item(s), and ${games.length} game review(s).`
    );
}

buildManifest().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
