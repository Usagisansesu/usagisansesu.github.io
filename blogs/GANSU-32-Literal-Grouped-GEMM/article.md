---
title: 真正的 grouped GEMM：meta-GGA 的分组收缩与缓存修复
date: 2026-10-13
period: 2026-10
written: 2026-10-27
series: GANSU
series_order: 32
category: GPU 计算优化
summary: 记录实际 grouped GEMM 接入与缓存修复，说明 Grid 4 下约 1.20 倍是该路径上启用 AIXC 的组装收益。
tags: GANSU, grouped GEMM, cuBLAS, meta-GGA
---

早期 bucket cuBLAS 通过填充，把同一个桶内的矩阵变成相同形状。10 月的新路径进一步使用真正的 grouped GEMM，让不同组保留实际形状。这解决的是填充浪费与批量调度问题，不意味着整次 XC 都变成了一个库调用。

## grouped 与 padded bucket 的区别

strided batched GEMM 适合形状和批间跨度一致的一批矩阵。bucket 先人为制造这种一致性，代价是填充。literal grouped 路径使用 cublasDgemmGroupedBatched，为不同组提供各自的矩阵形状。

这条接口需要 cuBLAS 12.5 或更新版本支持。实现还设置可配置的 workspace，记录中的默认预算为 512 MiB；workspace 之外仍有 AO、密度、缓存及其他临时数据，不能把这个数当作总显存用量。

meta-GGA 的组装包含普通 AO 项及三个方向的 τ 相关收缩，形状、转置和系数必须逐项对应，不能仅替换一个函数名。

## 两处与矩阵库无关的修复

接线期间修复了 AO/网格裁剪后 bin ID 未同步的问题；另一个调度问题是 rho/grouped 交替请求共享 task cache，造成反复重建。前者关系数值正确性，后者带来不必要的准备开销。库调用之外的元数据与缓存同样影响最终结果。

验证应先固定密度比较 Vxc，再走完整 SCF。将新库调用与缓存修复同时合并后，性能比较双方也必须使用一致的正确性修复，避免把旧错误路径当基线。

## 报告中的网格标注需要校正

10 月 14 日组会幻灯片把这组实验写成 Grid 3，但对应报告与 36 条实际运行命令均为 Grid 4。本文采用可核查的运行记录，统一写作 Grid 4。

条件为 SCAN/RKS、Cartesian cc-pVDZ、RI-J 与 cc-pVDZ-JKFIT 辅助基组、RTX A6000、BGM 64/midpoint。两边都使用真实 grouped_v、相同的密度量矩阵化与 AO pack cache；其中一边启用 AIXC，代表比例为 0.5。

AIXC 使用 warmup 3、start RMS 0.01、anchor RMS 0.05、refresh 24、max_delta 16；初猜与收敛方式为 core+damping 0.25，能量/密度阈值为 10⁻⁹/10⁻⁷。这与 9 月消融的刷新条件也不同。

三个独立新进程的全部有效请求合并统计，以下为平均每次请求的组装时间，单位毫秒；anchor 的两次组装计入同一个请求。这不是 bucket 与 grouped 两种矩阵后端的直接比较。

| 分子 | AO 数 | BGM + grouped | BGM + AIXC（grouped 底层） | 加速比 |
| --- | ---: | ---: | ---: | ---: |
| Pentacene | 400 | 843.549 | 698.471 | 1.208× |
| Indigo | 350 | 644.716 | 533.827 | 1.208× |
| Tetracene | 330 | 640.984 | 530.927 | 1.207× |
| Anthracene | 260 | 444.307 | 369.567 | 1.202× |

## 约 1.20 倍具体指什么

表中的 assembly 由 pack_metadata、zeroV 与 grouped_v 等对应阶段组成。它不包含 ρ/σ/τ、泛函求值、J 或 AIXC 外层全部成本。

因此，约 1.20 倍是在同一个 grouped 底层上启用 AIXC 后，这一受控实验里的组装收益。代表网格减少了部分请求的工作量，双方并非固定同一密度、同一工作量的微基准。它没有单独量出取消 bucket padding 的贡献。若讨论完整 XC 或墙钟时间，需要引用各自单独的计时结果。

这轮工作打通了保留真实尺寸的分组收缩，并验证其与 AIXC 协同运行的路径，同时整理了映射和缓存正确性。四个体系是选定条件下的适用案例；参数在 Pentacene 试跑中选定后共用，不能把结果推广为普遍加速。它也给后面分析 r²SCAN 留下了明确的组装基线。

## 资料与记录

- [NVIDIA：cuBLAS 官方文档](https://docs.nvidia.com/cuda/cublas/index.html)

