# 头像处理记录

- 工具：内置 imagegen，图片编辑模式。
- 用户提供的原图：`download20261002120219.png`。
- 网站使用的处理结果：`src/pictures/usausa-v2.png`。
- 处理目标：去除左下角白色水印，尽量保留人物、构图、背景和画风。
- 上一版头像保留在 `src/pictures/usausa.png`。

## 使用的提示词

Use case: precise-object-edit. Edit target: the supplied square anime/chibi avatar illustration. Remove only the small white handwritten watermark/signature at the bottom-left corner (the text starting with @). Reconstruct the underlying beige/brown cardigan with matching flat colors, seam lines and subtle shading. Preserve the character's face, eyes, glasses, hair, ears, blue halo, cup, hands, white background, exact framing and original pastel drawing style. Do not crop, recompose, add text, or redraw any other part. Keep the output square and preserve existing transparency if present.
