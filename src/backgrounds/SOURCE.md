# Steam 主页动态背景来源

移动端静态背景另使用用户在 2026-10-27 提供的 `73562407ec385d91f806a1e9bb1d39a6.jpg`，保存为 `mobile-moon.jpg`。保留原图，网页以浅白蒙层淡化显示。

从用户提供的公开 Steam 主页 HTML 中提取，保留 CDN 分发文件原始字节，未转码。

- 来源主页：https://steamcommunity.com/profiles/76561199052355451/
- Steam 资源 app ID：1451940
- WebM：https://shared.fastly.steamstatic.com/community_assets/images/items/1451940/0e445044c223ce65901dc8610bda31e70845cf99.webm
- MP4：https://shared.fastly.steamstatic.com/community_assets/images/items/1451940/95864db21f32e953f290dad4bd57d69ffd4bd914.mp4
- 静态封面：https://shared.fastly.steamstatic.com/community_assets/images/items/1451940/1b771ff96a253c52640ff22502dfcae79cefdffe.jpg

本地文件实测：

| 文件 | 字节数 | 播放信息 |
| --- | ---: | --- |
| `steam-profile.webm` | 2,643,809 | 浏览器实测 1920 × 1080，30.333 秒 |
| `steam-profile.mp4` | 1,969,382 | MP4 兼容候选来源 |
| `steam-profile.jpg` | 234,422 | 1920 × 1080 静态封面 |

主页实际使用 HTML `<video playsinline autoplay muted loop>`，以 WebM / MP4 作为候选来源，并用 JPG 作 poster。这些是播放用的成品视频，不是动画制作工程或分层源文件。

Steam 官方资源规范：https://partner.steamgames.com/doc/marketing/pointsshopitems

这里只记录技术来源，不声明拥有作品版权或已获得站外使用许可。公开可下载不代表授权在其他网站再发布；公开上线前应确认素材权利人的使用条件。
