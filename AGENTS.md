# 文章维护与发布

- 用户要求：每次发布新文章时，中文和日文版本必须同时发布；两版保留一致的内容、代码、数据、日期和排版。
- 中文技术文章源文件为 `blogs/<slug>/article.md`，对应日文完整译文为 `locales/ja/blogs/<slug>.md`，保持相同的 slug。
- 修改中文文章时，也应同步对应日文译文。不要只翻译标题和摘要而遗漏正文。
- `ja/` 中的页面、脚本、配置和内容清单是生成文件；修改中文模板、共享样式或翻译源后，运行 `node scripts/build-content.mjs` 统一生成两版。
- 发布前运行 `node scripts/check-locales.mjs` 和 `git diff --check`，确认两版内容数量、代码、表格、日期、图片和布局一致。新增分类或标签时维护 `locales/ja/ui.json`，或在日文文章 front matter 中提供日文 tags。
- 按用户明确要求的发布范围操作；双语同步要求本身不扩大其他操作权限。
