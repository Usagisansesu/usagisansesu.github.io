---
title: Bucket + cuBLAS：不规则 bin 如何变成批量矩阵乘法
date: 2026-07-10
period: 2026-07
written: 2026-10-27
series: GANSU
series_order: 24
category: GPU 计算优化
summary: 解释不规则 active AO/bin 如何通过 bucket、padding 和 pack 转成 batched GEMM，并厘清 leading dimension 与 stride。
tags: GANSU, cuBLAS, Bucket, Batched GEMM
---

7 月 10 日的组会开始展示 Bucket-cuBLAS 的部分实现。它连接了两个原本不匹配的世界：空间筛选产生大小不一的局部列表，而高效矩阵库更擅长处理规则的连续数组。

## bucket 为什么需要 padding

不同 bin 的 active AO 数与格点数不同。把形状相近的 bin 分到同一 bucket，再填充到相容尺寸，就能让多个局部运算使用同一组矩阵参数。

padding 会增加额外运算和存储，因此 bucket 分得更细并不必然更快。还要考虑批量规模、空位比例、pack 和 scatter 成本，而不是只追求每次 GEMM 的峰值利用率。

## pack 的工作内容

原始 AO 数据可能通过非连续的格点 ID 和 AO ID 访问。pack 把需要的数据整理为连续小矩阵，再形成带权重和局部导数的 RHS。矩阵乘法完成后，通过全局 AO 映射写回 Vxc。

若采用 `Φ` 为 nA×nG 的列主序表示，常见局部收缩可表达为 `Φ Rᵀ` 一类形式。真正的 meta-GGA 还包括梯度与 τ 项，不能把一项乘法当作全部 Vxc。

## leading dimension 与 stride

leading dimension 描述矩阵在内存中的主步长，不等于逻辑行数总能直接照填。strided-batched 的 stride 又描述相邻矩阵起点的间隔，通常以元素数量计，而不是字节。

```text
逻辑形状     决定有效的物理数据
padding形状  决定规则计算与部分访问范围
leading dim  决定矩阵内部寻址
batch stride 决定下一块矩阵从哪里开始
```

transpose 参数改变运算中的解释，不会替你把内存重排。接口中的 m、n、k、lda 与实际分配必须一起推导。

## 验证不能只看 GEMM 返回成功

先把一个小 bin 的库结果与直接收缩比较，再覆盖多 bin、尾块、空列表和大 padding 比例。每个辅助区的无效位置必须按要求置零，否则填充区的数据也会进入结果。

本阶段是部分实现记录。后面出现的缓冲区尺寸错误，恰好说明把公式写成 GEMM 只是其中一半，另一半是让布局、分配和访问范围完全相容。

## 资料与记录

- [NVIDIA：cuBLAS 官方文档](https://docs.nvidia.com/cuda/cublas/index.html)

