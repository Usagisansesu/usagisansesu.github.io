const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const pageType = document.body.dataset.page || "home";
const manifest = window.CONTENT_MANIFEST || { blogs: [], album: [] };
const siteConfig = window.SITE_CONFIG || {};
const SITE_TITLE = siteConfig.name || siteConfig.title || "研究与创作";
const SITE_URL = (siteConfig.siteUrl || new URL(".", window.location.href).href).replace(/\/$/, "");
const SITE_ASSET_VERSION = "20261018050544";
const RESUME_PACKET = {
    path: `src/documents/resume-packet.bin?v=${SITE_ASSET_VERSION}`,
    salt: "Ok0RgEDtDOhjYyGbH6HKXg==",
    iv: "I6cezrX1S/OeGJ7/",
    iterations: 310000,
    filename: "detailed-resume.pdf"
};
const blogState = {
    query: "",
    category: "全部"
};

function escapeHtml(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}

function setupProfile() {
    const setText = (selector, value) => {
        document.querySelectorAll(selector).forEach((element) => {
            element.textContent = value;
        });
    };
    setText("[data-profile-title], [data-profile-footer]", SITE_TITLE);
    setText("[data-profile-focus]", siteConfig.focus || "");
    setText("[data-profile-life]", siteConfig.life || "");
    setText("[data-profile-bio]", siteConfig.bio || "");
    document.querySelectorAll("[data-profile-bio]").forEach((element) => {
        element.hidden = !siteConfig.bio;
    });
    document.querySelectorAll("[data-profile-avatar]").forEach((element) => {
        element.src = siteConfig.avatar || "src/pictures/profile-placeholder.svg";
        element.alt = siteConfig.name ? `${siteConfig.name} 的头像` : "研究与创作的抽象图案";
    });
    document.querySelectorAll("[data-template-note]").forEach((element) => {
        element.hidden = !siteConfig.templateContent;
    });
    document.querySelectorAll("[data-contact]").forEach((card) => {
        const type = card.dataset.contact;
        const value = siteConfig[type];
        if (!value) return;
        card.querySelector("strong").textContent = value;
        const isGithub = type === "github" && /^https:\/\/github\.com\/[\w-]+\/?$/.test(value);
        const isEmail = type === "email" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        if (!isGithub && !isEmail) return;
        const link = document.createElement("a");
        link.className = card.className;
        link.href = isEmail ? `mailto:${value}` : value;
        if (isGithub) {
            link.target = "_blank";
            link.rel = "noreferrer";
        }
        link.append(...card.childNodes);
        card.replaceWith(link);
    });
}

function setupBackground() {
    const background = siteConfig.background;
    const layer = document.getElementById("site-background");
    const video = document.getElementById("site-background-video");
    const toggle = document.getElementById("background-toggle");
    if (!background?.enabled || !layer || !video || !toggle) return;

    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 720px)");
    const usesMobileBackground = () => mobile.matches && Boolean(background.mobileImage);
    const storageKey = "site-background-paused";
    let userPaused = false;
    let explicitPlay = false;
    let sourcesLoaded = false;
    let failed = false;
    try {
        userPaused = localStorage.getItem(storageKey) === "true";
    } catch {
        // The background still works when browser storage is unavailable.
    }

    document.body.classList.add("has-steam-background");
    layer.hidden = false;
    const sources = [
        [background.webm, "video/webm"],
        [background.mp4, "video/mp4"]
    ].filter(([src]) => src);
    video.muted = true;

    const updateControl = () => {
        const playing = !video.paused && !video.ended && !failed;
        toggle.textContent = playing ? "暂停背景" : "播放背景";
        toggle.setAttribute("aria-pressed", String(playing));
    };
    const syncPlayback = () => {
        const mobileStatic = usesMobileBackground();
        document.body.classList.toggle("has-mobile-background", mobileStatic);
        if (mobileStatic) {
            layer.style.backgroundImage = `url(${JSON.stringify(background.mobileImage)})`;
            video.pause();
            video.hidden = true;
            toggle.hidden = true;
            return;
        }
        layer.style.backgroundImage = background.poster ? `url(${JSON.stringify(background.poster)})` : "";
        if (background.poster && video.getAttribute("poster") !== background.poster) {
            video.poster = background.poster;
        }
        toggle.hidden = failed || !sources.length;
        if (!sources.length) return;
        if (failed || userPaused || document.hidden || (motion.matches && !explicitPlay)) {
            video.pause();
            if (motion.matches && !explicitPlay) video.hidden = true;
            updateControl();
            return;
        }
        if (!sourcesLoaded) {
            sources.forEach(([src, type]) => {
                const source = document.createElement("source");
                source.src = src;
                source.type = type;
                video.append(source);
            });
            sourcesLoaded = true;
            video.load();
        }
        video.play().catch(() => {
            // Keep the poster and play button if autoplay is blocked.
            updateControl();
        });
    };
    video.addEventListener("playing", () => {
        if (usesMobileBackground()) {
            video.pause();
            return;
        }
        video.hidden = false;
        updateControl();
    });
    video.addEventListener("pause", updateControl);
    video.addEventListener("error", () => {
        failed = true;
        video.hidden = true;
        toggle.hidden = true;
    });
    toggle.addEventListener("click", () => {
        userPaused = !video.paused;
        explicitPlay = !userPaused;
        try {
            localStorage.setItem(storageKey, String(userPaused));
        } catch {
            // Session-only controls remain usable.
        }
        syncPlayback();
    });
    document.addEventListener("visibilitychange", syncPlayback);
    mobile.addEventListener("change", syncPlayback);
    motion.addEventListener("change", () => {
        explicitPlay = false;
        syncPlayback();
    });
    syncPlayback();
}

function formatDate(dateString) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) {
        return escapeHtml(dateString || "");
    }

    return new Intl.DateTimeFormat("zh-CN", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit"
    }).format(date);
}

function absoluteSiteUrl(path = "") {
    if (/^https?:\/\//.test(path)) {
        return path;
    }

    return `${SITE_URL}/${String(path).replace(/^\.?\//, "")}`;
}

function setMeta(selector, attribute, value) {
    const element = document.head.querySelector(selector);
    if (element) {
        element.setAttribute(attribute, value);
    }
}

function updatePageMeta({ title, description, url, image }) {
    if (title) {
        document.title = title;
        setMeta('meta[property="og:title"]', "content", title);
    }

    if (description) {
        setMeta('meta[name="description"]', "content", description);
        setMeta('meta[property="og:description"]', "content", description);
    }

    if (url) {
        setMeta('link[rel="canonical"]', "href", url);
        setMeta('meta[property="og:url"]', "content", url);
    }

    if (image) {
        setMeta('meta[property="og:image"]', "content", absoluteSiteUrl(image));
    }
}

function renderTagPills(container, tags, category = "") {
    if (!container) {
        return;
    }

    const pills = [];
    if (category) {
        pills.push({
            label: category,
            className: "category-pill"
        });
    }

    if (tags && tags.length) {
        tags.forEach((tag) => {
            pills.push({
                label: tag,
                className: ""
            });
        });
    }

    if (!pills.length) {
        container.innerHTML = "";
        return;
    }

    container.innerHTML = pills
        .map((pill) => `<span${pill.className ? ` class="${pill.className}"` : ""}>${escapeHtml(pill.label)}</span>`)
        .join("");
}

function renderMiniTags(tags, limit = 3) {
    if (!tags || !tags.length) {
        return "";
    }

    return `
        <div class="mini-tags">
            ${tags
                .slice(0, limit)
                .map((tag) => `<span>${escapeHtml(tag)}</span>`)
                .join("")}
        </div>
    `;
}

function renderInline(markdown) {
    const placeholders = [];
    let output = escapeHtml(markdown);

    output = output.replace(/`([^`]+)`/g, (_, code) => {
        const token = `@@CODE${placeholders.length}@@`;
        placeholders.push(`<code>${escapeHtml(code)}</code>`);
        return token;
    });

    output = output.replace(/!\[([^\]]*)\]\(([^)]+)\)/g, (_, alt, src) => {
        return `<figure><img src="${escapeHtml(src)}" alt="${escapeHtml(alt)}"></figure>`;
    });

    output = output.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (_, text, href) => {
        const isExternal = /^https?:\/\//.test(href);
        const target = isExternal ? ' target="_blank" rel="noreferrer"' : "";
        return `<a href="${escapeHtml(href)}"${target}>${escapeHtml(text)}</a>`;
    });

    output = output.replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>");
    output = output.replace(/__([^_]+)__/g, "<strong>$1</strong>");
    output = output.replace(/(^|[\s(])\*([^*]+)\*(?=[\s).,!?:;]|$)/g, "$1<em>$2</em>");
    output = output.replace(/(^|[\s(])_([^_]+)_(?=[\s).,!?:;]|$)/g, "$1<em>$2</em>");

    placeholders.forEach((replacement, index) => {
        output = output.replace(`@@CODE${index}@@`, replacement);
    });

    return output;
}

function renderMarkdown(markdown) {
    if (!markdown || !markdown.trim()) {
        return "<p>暂无内容。</p>";
    }

    const codeBlocks = [];
    const normalized = markdown
        .replace(/\r\n/g, "\n")
        .replace(/```([\w-]*)\n([\s\S]*?)```/g, (_, language, code) => {
            const token = `@@BLOCK${codeBlocks.length}@@`;
            codeBlocks.push({
                language,
                code
            });
            return token;
        })
        .trim();

    const blocks = normalized.split(/\n{2,}/).filter(Boolean);

    return blocks
        .map((block) => {
            const trimmed = block.trim();
            const codeTokenMatch = trimmed.match(/^@@BLOCK(\d+)@@$/);

            if (codeTokenMatch) {
                const codeBlock = codeBlocks[Number(codeTokenMatch[1])];
                const languageClass = codeBlock.language ? ` class="language-${escapeHtml(codeBlock.language)}"` : "";
                return `<pre><code${languageClass}>${escapeHtml(codeBlock.code.trimEnd())}</code></pre>`;
            }

            const headingMatch = trimmed.match(/^(#{1,6})\s+(.+)$/);
            if (headingMatch) {
                const level = headingMatch[1].length;
                return `<h${level}>${renderInline(headingMatch[2])}</h${level}>`;
            }

            if (/^([-*_]){3,}$/.test(trimmed.replace(/\s/g, ""))) {
                return "<hr>";
            }

            const tableLines = trimmed.split("\n");
            const cells = (line) => line.trim().replace(/^\|/, "").replace(/\|$/, "").split("|").map((cell) => cell.trim());
            if (tableLines.length >= 2 && tableLines[0].includes("|") && cells(tableLines[0]).length === cells(tableLines[1]).length && cells(tableLines[1]).every((cell) => /^:?-{3,}:?$/.test(cell))) {
                const headings = cells(tableLines[0]);
                const alignments = cells(tableLines[1]).map((cell) => cell.endsWith(":") ? (cell.startsWith(":") ? "center" : "right") : "left");
                const rows = tableLines.slice(2).map(cells);
                return `<div class="markdown-table-scroll"><table><thead><tr>${headings.map((cell, index) => `<th scope="col" data-align="${alignments[index]}">${renderInline(cell)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${headings.map((_, index) => `<td data-align="${alignments[index]}">${renderInline(row[index] || "")}</td>`).join("")}</tr>`).join("")}</tbody></table></div>`;
            }

            const quoteLines = trimmed.split("\n");
            if (quoteLines.every((line) => /^>\s?/.test(line))) {
                const content = quoteLines.map((line) => line.replace(/^>\s?/, "")).join("\n");
                return `<blockquote>${renderMarkdown(content)}</blockquote>`;
            }

            const unorderedLines = trimmed.split("\n");
            if (unorderedLines.every((line) => /^[-*+]\s+/.test(line))) {
                return `<ul>${unorderedLines
                    .map((line) => `<li>${renderInline(line.replace(/^[-*+]\s+/, ""))}</li>`)
                    .join("")}</ul>`;
            }

            const orderedLines = trimmed.split("\n");
            if (orderedLines.every((line) => /^\d+\.\s+/.test(line))) {
                return `<ol>${orderedLines
                    .map((line) => `<li>${renderInline(line.replace(/^\d+\.\s+/, ""))}</li>`)
                    .join("")}</ol>`;
            }

            const paragraphHtml = renderInline(trimmed).replace(/\n/g, "<br>");
            if (/^<figure>[\s\S]*<\/figure>$/.test(paragraphHtml)) {
                return paragraphHtml;
            }

            return `<p>${paragraphHtml}</p>`;
        })
        .join("");
}

function updateYear() {
    const yearTarget = document.getElementById("year");
    if (yearTarget) {
        yearTarget.textContent = String(new Date().getFullYear());
    }
}

function base64ToBytes(value) {
    return Uint8Array.from(atob(value), (char) => char.charCodeAt(0));
}

async function decryptResumePacket(password) {
    const encryptedResponse = await fetch(RESUME_PACKET.path);
    if (!encryptedResponse.ok) {
        throw new Error("network");
    }

    const passwordBytes = new TextEncoder().encode(password);
    const baseKey = await crypto.subtle.importKey(
        "raw",
        passwordBytes,
        "PBKDF2",
        false,
        ["deriveKey"]
    );
    const key = await crypto.subtle.deriveKey(
        {
            name: "PBKDF2",
            salt: base64ToBytes(RESUME_PACKET.salt),
            iterations: RESUME_PACKET.iterations,
            hash: "SHA-256"
        },
        baseKey,
        {
            name: "AES-GCM",
            length: 256
        },
        false,
        ["decrypt"]
    );

    return crypto.subtle.decrypt(
        {
            name: "AES-GCM",
            iv: base64ToBytes(RESUME_PACKET.iv)
        },
        key,
        await encryptedResponse.arrayBuffer()
    );
}

function setupResumeDownload() {
    const modal = document.getElementById("resume-download-modal");
    const openButton = document.querySelector("[data-open-resume-download]");
    const form = document.getElementById("resume-download-form");
    const passwordInput = document.getElementById("resume-password");
    const status = document.getElementById("resume-download-status");
    const submitButton = form ? form.querySelector(".resume-confirm-button") : null;

    if (!modal || !openButton || !form || !passwordInput || !status || !submitButton) {
        return;
    }

    const setStatus = (message, isError = false) => {
        status.textContent = message;
        status.classList.toggle("is-error", isError);
    };

    const closeModal = () => {
        modal.hidden = true;
        form.reset();
        setStatus("");
    };

    const openModal = () => {
        modal.hidden = false;
        setStatus("");
        window.setTimeout(() => passwordInput.focus(), 80);
    };

    openButton.addEventListener("click", openModal);
    modal.querySelectorAll("[data-close-resume-download]").forEach((element) => {
        element.addEventListener("click", closeModal);
    });

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const password = passwordInput.value.trim();
        if (!password) {
            setStatus("请输入验证密码。", true);
            passwordInput.focus();
            return;
        }

        submitButton.disabled = true;
        setStatus("正在验证并准备下载...");

        try {
            const pdfBuffer = await decryptResumePacket(password);
            const blob = new Blob([pdfBuffer], {
                type: "application/pdf"
            });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = RESUME_PACKET.filename;
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.setTimeout(() => URL.revokeObjectURL(url), 1200);
            closeModal();
        } catch (error) {
            const message = error && error.message === "network"
                ? "下载资源暂时不可用，请稍后再试。"
                : "密码不正确，请重新输入。";
            setStatus(message, true);
            passwordInput.select();
        } finally {
            submitButton.disabled = false;
        }
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !modal.hidden) {
            closeModal();
        }
    });
}

function setupSmoothScroll() {
    document.querySelectorAll("[data-scroll]").forEach((link) => {
        link.addEventListener("click", (event) => {
            const targetSelector = link.getAttribute("href");
            if (!targetSelector || !targetSelector.startsWith("#")) {
                return;
            }

            const target = document.querySelector(targetSelector);
            if (!target) {
                return;
            }

            event.preventDefault();
            target.scrollIntoView({
                behavior: prefersReducedMotion ? "auto" : "smooth",
                block: "start"
            });
        });
    });
}

function setupReveal() {
    const items = document.querySelectorAll(".reveal");
    if (!items.length) {
        return;
    }

    if (!("IntersectionObserver" in window) || prefersReducedMotion) {
        items.forEach((item) => item.classList.add("is-visible"));
        return;
    }

    const observer = new IntersectionObserver(
        (entries, currentObserver) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.classList.add("is-visible");
                currentObserver.unobserve(entry.target);
            });
        },
        {
            threshold: 0.14
        }
    );

    items.forEach((item) => observer.observe(item));
}

function setupSurfaceGlow() {
    if (prefersReducedMotion || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        return;
    }

    const surfaces = document.querySelectorAll(".glass-panel, .blog-card, .album-card, .contact-card");
    surfaces.forEach((surface) => {
        let frame = 0;
        let pointerX = 0;
        let pointerY = 0;

        surface.addEventListener("pointermove", (event) => {
            const rect = surface.getBoundingClientRect();
            pointerX = event.clientX - rect.left;
            pointerY = event.clientY - rect.top;
            if (frame) {
                return;
            }

            frame = window.requestAnimationFrame(() => {
                surface.style.setProperty("--glow-x", `${pointerX}px`);
                surface.style.setProperty("--glow-y", `${pointerY}px`);
                frame = 0;
            });
        }, { passive: true });
    });
}

function createBlogCard(item) {
    return `
        <a class="blog-card" href="blog.html?slug=${encodeURIComponent(item.slug)}">
            ${item.series ? `<p class="blog-series-label">${escapeHtml(item.series)} · ${String(item.seriesOrder).padStart(2, "0")}</p>` : ""}
            <h4 class="blog-card-title">${escapeHtml(item.title)}</h4>
            <div class="blog-meta">
                <span>${item.period ? "记录于 " : ""}${formatDate(item.date)}</span>
                <span>${escapeHtml(item.category || "未分类")}</span>
                <span>阅读全文</span>
            </div>
            <p class="blog-summary">${escapeHtml(item.summary)}</p>
            ${renderMiniTags(item.tags)}
        </a>
    `;
}

function getBlogCategories() {
    const preferredCategories = ["量子化学基础", "meta-GGA 实现", "GPU 计算优化", "r²SCAN", "性能实验", "Unity"];
    const existingCategories = new Set(manifest.blogs.map((item) => item.category || "未分类"));
    const orderedCategories = preferredCategories.filter((category) => existingCategories.has(category));
    const otherCategories = Array.from(existingCategories).filter((category) => !preferredCategories.includes(category));
    return ["全部", ...orderedCategories, ...otherCategories];
}

function filterBlogs() {
    const normalizedQuery = blogState.query.trim().toLowerCase();

    return manifest.blogs.filter((item) => {
        const matchesCategory = blogState.category === "全部" || (item.category || "未分类") === blogState.category;
        if (!matchesCategory) {
            return false;
        }

        if (!normalizedQuery) {
            return true;
        }

        const searchable = [
            item.title,
            item.summary,
            item.category,
            ...(item.tags || [])
        ]
            .filter(Boolean)
            .join(" ")
            .toLowerCase();

        return searchable.includes(normalizedQuery);
    });
}

function renderBlogCategoryFilter() {
    const filter = document.getElementById("blog-category-filter");
    if (!filter) {
        return;
    }

    filter.innerHTML = getBlogCategories()
        .map((category) => {
            const isActive = category === blogState.category;
            return `<button class="category-chip${isActive ? " is-active" : ""}" type="button" data-category="${escapeHtml(category)}">${escapeHtml(category)}</button>`;
        })
        .join("");
}

function renderBlogList() {
    const blogsList = document.getElementById("blogs-list");
    if (!blogsList) {
        return;
    }

    const visibleBlogs = filterBlogs();
    blogsList.innerHTML = visibleBlogs.length
        ? visibleBlogs.map(createBlogCard).join("")
        : `<div class="empty-state">${manifest.blogs.length ? "没有找到匹配的文章。" : "技术文章正在整理中，接下来会记录 GANSU 的学习与开发过程。"}</div>`;
}

function setupBlogTools() {
    const search = document.getElementById("blog-search");
    const filter = document.getElementById("blog-category-filter");
    const tools = document.querySelector(".blog-tools");
    if (tools) tools.hidden = !manifest.blogs.length;

    renderBlogCategoryFilter();

    if (search) {
        search.addEventListener("input", () => {
            blogState.query = search.value;
            renderBlogList();
        });
    }

    if (filter) {
        filter.addEventListener("click", (event) => {
            const button = event.target.closest("[data-category]");
            if (!button) {
                return;
            }

            blogState.category = button.dataset.category;
            renderBlogCategoryFilter();
            renderBlogList();
        });
    }
}

function createAlbumCard(item) {
    return `
        <button class="album-card" type="button" data-album-slug="${escapeHtml(item.slug)}">
            <div class="album-card-image">
                <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.title)}">
            </div>
            <p class="detail-date">${formatDate(item.date)}</p>
            <h4 class="album-card-title">${escapeHtml(item.title)}</h4>
            <p class="album-summary">${escapeHtml(item.summary)}</p>
        </button>
    `;
}

function createGameReview(item) {
    const metadata = [item.platform, item.date ? formatDate(item.date) : ""].filter(Boolean);
    return `
        <li><a class="game-review-row" href="game.html?slug=${encodeURIComponent(item.slug || item.title)}">
            <div class="game-review-identity">
                <span class="game-review-status">${escapeHtml(item.status || "未分类")}</span>
                <h3>${escapeHtml(item.title)}</h3>
                ${metadata.length ? `<p class="game-review-meta">${metadata.map(escapeHtml).join(" · ")}</p>` : ""}
            </div>
            <div class="game-review-copy">
                <p class="game-review-summary">${escapeHtml(item.summary || item.review)}</p>
                <span class="game-review-open">阅读完整短评 ↗${item.images?.length ? ` · ${item.images.length} 张配图` : ""}</span>
            </div>
            <div class="game-review-score" aria-label="${item.score == null ? "未评分" : `${Number(item.score)} 分，满分 10 分`}">
                <strong>${item.score == null ? "—" : Number(item.score).toFixed(1)}</strong>
                <span>${item.score == null ? "未评分" : "/ 10.0"}</span>
            </div>
        </a></li>
    `;
}

function setupGameReviews() {
    const list = document.getElementById("game-review-list");
    const empty = document.getElementById("game-review-empty");
    const count = document.getElementById("game-review-count");
    if (!list || !empty || !count) return;
    const games = manifest.games || [];
    count.textContent = String(games.length).padStart(2, "0");
    list.innerHTML = games.map(createGameReview).join("");
    list.hidden = !games.length;
    empty.hidden = Boolean(games.length);
}

function renderHomePage() {
    const blogsList = document.getElementById("blogs-list");
    const albumList = document.getElementById("album-list");

    if (blogsList) {
        setupBlogTools();
        renderBlogList();
    }

    if (albumList) {
        albumList.innerHTML = manifest.album.length
            ? manifest.album.map(createAlbumCard).join("")
            : '<div class="empty-state">随笔和照片还在整理中。</div>';
    }

    setupGameReviews();
    setupAlbumModal();
}

function setupImageFullscreen() {
    const shell = document.getElementById("image-fullscreen");
    const image = document.getElementById("image-fullscreen-img");
    if (!shell || !image) {
        return;
    }

    let previousBodyOverflow = "";
    const imageSelector = "#album-modal-image, #album-modal-markdown img, #detail-cover-image, #detail-markdown img, .game-detail-gallery img";

    const close = () => {
        shell.hidden = true;
        image.removeAttribute("src");
        image.alt = "";
        document.body.style.overflow = previousBodyOverflow;
    };

    const open = (sourceImage) => {
        const source = sourceImage.currentSrc || sourceImage.src;
        if (!source) {
            return;
        }

        previousBodyOverflow = document.body.style.overflow;
        image.src = source;
        image.alt = sourceImage.alt || "";
        shell.hidden = false;
        document.body.style.overflow = "hidden";
    };

    document.addEventListener("click", (event) => {
        const sourceImage = event.target.closest(imageSelector) || event.target.closest("[data-fullscreen-image]")?.querySelector("img");
        if (!sourceImage) {
            return;
        }

        event.preventDefault();
        open(sourceImage);
    });

    shell.querySelectorAll("[data-close-fullscreen-image]").forEach((element) => {
        element.addEventListener("click", close);
    });

    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && !shell.hidden) {
            event.preventDefault();
            close();
        }
    });
}

function setupAlbumModal() {
    const modal = document.getElementById("album-modal");
    const albumList = document.getElementById("album-list");
    if (!modal || !albumList) {
        return;
    }

    const pageStack = document.querySelector(".page-stack");
    const modalWindow = modal.querySelector(".modal-window");
    const image = document.getElementById("album-modal-image");
    const date = document.getElementById("album-modal-date");
    const title = document.getElementById("album-modal-title");
    const tags = document.getElementById("album-modal-tags");
    const markdown = document.getElementById("album-modal-markdown");
    let currentAlbumIndex = -1;

    const setModalLayout = () => {
        const ratio = image.naturalWidth / Math.max(image.naturalHeight, 1);
        modalWindow.classList.remove("layout-landscape", "layout-portrait", "layout-square");

        if (ratio >= 1.18) {
            modalWindow.classList.add("layout-landscape");
            return;
        }

        if (ratio <= 0.86) {
            modalWindow.classList.add("layout-portrait");
            return;
        }

        modalWindow.classList.add("layout-square");
    };

    const closeModal = () => {
        modal.hidden = true;
        if (pageStack) {
            pageStack.style.overflow = "";
        }
    };

    const openModal = (item, index = manifest.album.indexOf(item)) => {
        currentAlbumIndex = index;
        modalWindow.classList.remove("layout-landscape", "layout-portrait", "layout-square");
        image.src = item.image;
        image.alt = item.title;
        date.textContent = formatDate(item.date);
        title.textContent = item.title;
        renderTagPills(tags, item.tags);
        markdown.innerHTML = renderMarkdown(item.markdown);
        markdown.scrollTop = 0;
        modal.hidden = false;
        if (pageStack) {
            pageStack.style.overflow = "hidden";
        }

        if (image.complete) {
            setModalLayout();
        }
    };

    const switchAlbum = (direction) => {
        if (modal.hidden || manifest.album.length < 2) {
            return;
        }

        const offset = direction === "next" ? 1 : -1;
        const nextIndex = (currentAlbumIndex + offset + manifest.album.length) % manifest.album.length;
        openModal(manifest.album[nextIndex], nextIndex);
    };

    image.addEventListener("load", setModalLayout);

    albumList.addEventListener("click", (event) => {
        const trigger = event.target.closest("[data-album-slug]");
        if (!trigger) {
            return;
        }

        const itemIndex = manifest.album.findIndex((entry) => entry.slug === trigger.dataset.albumSlug);
        const item = manifest.album[itemIndex];
        if (item) {
            openModal(item, itemIndex);
        }
    });

    modal.querySelectorAll("[data-album-nav]").forEach((element) => {
        element.addEventListener("click", () => switchAlbum(element.dataset.albumNav));
    });

    modal.querySelectorAll("[data-close-album]").forEach((element) => {
        element.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", (event) => {
        const fullscreenShell = document.getElementById("image-fullscreen");
        if (fullscreenShell && !fullscreenShell.hidden) {
            return;
        }

        if (event.key === "Escape" && !modal.hidden) {
            closeModal();
        }

        if (event.key === "ArrowLeft") {
            switchAlbum("prev");
        }

        if (event.key === "ArrowRight") {
            switchAlbum("next");
        }
    });
}

function renderBlogDetail() {
    const params = new URLSearchParams(window.location.search);
    const slug = params.get("slug");
    const article = manifest.blogs.find((item) => item.slug === slug);

    const titleTarget = document.getElementById("detail-title");
    const dateTarget = document.getElementById("detail-date");
    const tagsTarget = document.getElementById("detail-tags");
    const markdownTarget = document.getElementById("detail-markdown");
    const cover = document.getElementById("detail-cover");
    const coverImage = document.getElementById("detail-cover-image");

    if (!article) {
        document.title = `未找到文章 | ${SITE_TITLE}`;
        titleTarget.textContent = "没有找到这篇文章";
        dateTarget.textContent = "NOT FOUND";
        markdownTarget.innerHTML = "<p>这篇文章暂时不可访问，请返回首页查看已有内容。</p>";
        renderTagPills(tagsTarget, []);
        return;
    }

    const articleUrl = `${SITE_URL}/blog.html?slug=${encodeURIComponent(article.slug)}`;
    updatePageMeta({
        title: `${article.title} | ${SITE_TITLE}`,
        description: article.summary || siteConfig.description,
        url: articleUrl,
        image: article.coverImage || siteConfig.avatar
    });
    titleTarget.textContent = article.title;
    dateTarget.textContent = formatDate(article.date);
    renderTagPills(tagsTarget, article.tags, article.category);
    markdownTarget.innerHTML = renderMarkdown(article.markdown);
    const provenance = document.getElementById("article-provenance");
    if (provenance && article.written) {
        provenance.hidden = false;
        provenance.textContent = `记录阶段：${article.period || article.date} · 补记：${formatDate(article.written)}${article.series ? ` · ${article.series} 系列 ${article.seriesOrder}` : ""}。依据当时资料回顾整理，文中会区分阶段结果与后续修订。`;
    }
    const seriesNav = document.getElementById("article-series-nav");
    if (seriesNav && article.series) {
        const ordered = manifest.blogs.filter((item) => item.series === article.series).sort((a, b) => a.seriesOrder - b.seriesOrder);
        const index = ordered.findIndex((item) => item.slug === article.slug);
        const link = (item, label) => item ? `<a href="blog.html?slug=${encodeURIComponent(item.slug)}"><span>${label}</span><strong>${escapeHtml(item.title)}</strong></a>` : "<span></span>";
        seriesNav.hidden = false;
        seriesNav.innerHTML = link(ordered[index - 1], "← 上一篇") + link(ordered[index + 1], "下一篇 →");
    }

    if (article.coverImage) {
        const firstMarkdownImage = article.markdown.match(/!\[[^\]]*\]\(([^)]+)\)/)?.[1] || "";
        const duplicatesFirstImage = decodeURIComponent(firstMarkdownImage) === decodeURIComponent(article.coverImage);
        cover.hidden = duplicatesFirstImage;
        if (!duplicatesFirstImage) {
            coverImage.src = article.coverImage;
            coverImage.alt = article.title;
        }
    }
}

function renderGameDetail() {
    const slug = new URLSearchParams(window.location.search).get("slug");
    const game = (manifest.games || []).find((item) => item.slug === slug);
    const title = document.getElementById("game-detail-title");
    const meta = document.getElementById("game-detail-meta");
    const body = document.getElementById("game-detail-body");
    const score = document.getElementById("game-detail-score");
    const gallery = document.getElementById("game-detail-gallery");
    const sources = document.getElementById("game-detail-sources");
    if (!game) {
        document.title = `未找到游戏短评 | ${SITE_TITLE}`;
        title.textContent = "没有找到这篇游戏短评";
        body.innerHTML = "<p>这篇短评暂时不可访问，可以返回游戏短评查看已有记录。</p>";
        score.hidden = true;
        return;
    }
    title.textContent = game.title;
    const metadata = [game.status, game.platform, game.date ? formatDate(game.date) : ""].filter(Boolean);
    meta.innerHTML = metadata.map((value) => `<span>${escapeHtml(value)}</span>`).join("");
    score.innerHTML = `<strong>${game.score == null ? "—" : Number(game.score).toFixed(1)}</strong><span>${game.score == null ? "未评分" : "/ 10.0"}</span>`;
    score.setAttribute("aria-label", game.score == null ? "未评分" : `${Number(game.score)} 分，满分 10 分`);
    body.innerHTML = game.review.split(/\n\s*\n/).map((paragraph) => `<p>${escapeHtml(paragraph).replace(/\n/g, "<br>")}</p>`).join("");
    const images = game.images || [];
    gallery.hidden = !images.length;
    gallery.dataset.count = String(images.length);
    gallery.innerHTML = images.map((image) => `
        <figure>
            <button class="game-image-button" type="button" aria-label="放大：${escapeHtml(image.alt)}" data-fullscreen-image>
                <img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.alt)}" loading="lazy">
            </button>
            ${image.caption ? `<figcaption>${escapeHtml(image.caption)}</figcaption>` : ""}
        </figure>
    `).join("");
    if (sources) {
        const references = game.sources || [];
        sources.hidden = !references.length;
        sources.innerHTML = references.length ? `<span>游戏资料</span>${references.map((source) => `<a href="${escapeHtml(source.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(source.title)} ↗</a>`).join("")}` : "";
    }
    updatePageMeta({
        title: `${game.title} · 游戏短评 | ${SITE_TITLE}`,
        description: game.summary || game.review.slice(0, 140),
        url: `${SITE_URL}/game.html?slug=${encodeURIComponent(game.slug)}`,
        image: images[0]?.src || siteConfig.avatar
    });
}

setupProfile();
setupBackground();
updateYear();
setupSmoothScroll();
setupReveal();
setupResumeDownload();

if (pageType === "home") {
    renderHomePage();
}

if (pageType === "blog-detail") {
    renderBlogDetail();
}

if (pageType === "game-detail") {
    renderGameDetail();
}

setupImageFullscreen();
setupSurfaceGlow();
