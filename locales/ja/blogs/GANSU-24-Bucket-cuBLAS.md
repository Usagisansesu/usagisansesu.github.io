---
title: Bucket + cuBLAS：不規則な bin をバッチ行列積へ変える
summary: active AO/bin を bucket、padding、pack で batched GEMM に変換する流れと、leading dimension・stride を整理する。
---

7 月 10 日には Bucket-cuBLAS の部分実装を示した。空間スクリーニングが作る不揃いな局所リストと、規則的で連続した配列を得意とする行列ライブラリをつなぐ作業だった。

## bucket に padding が必要な理由

各 bin の active AO 数と格子点数は異なる。近い形状の bin を同じ bucket に入れ、整合するサイズまで埋めれば、同じ行列パラメータで複数の局所演算を実行できる。

padding は余分な演算と記憶領域を増やすため、bucket を細分すれば速くなるとは限らない。GEMM のピーク利用率だけでなく、バッチ規模、空きの割合、pack、scatter のコストも考える。

## pack が行うこと

元の AO データは非連続な point ID と AO ID でアクセスする場合がある。pack で必要なデータを連続小行列にし、重みと局所導関数を含む RHS を作る。行列積後、大域 AO マッピングを使って Vxc へ書き戻す。

`Φ` を nA×nG の列優先表現とすれば、局所縮約は `Φ Rᵀ` のように書ける。ただし meta-GGA には勾配・τ 項も含まれ、一つの行列積が Vxc 全体ではない。

## leading dimension と stride

leading dimension はメモリ上の主ストライドであり、常に論理行数を入れればよいわけではない。strided-batched の stride は隣接行列の開始点の間隔で、通常はバイトでなく要素数を表す。

```text
論理形状      有効な物理データを決める
padding 形状  規則的な計算と一部のアクセス範囲を決める
leading dim   行列内部のアドレス計算を決める
batch stride  次の行列の開始位置を決める
```

transpose 引数は演算での解釈を変えるだけで、メモリを並べ替えてはくれない。m、n、k、lda と実際の確保領域を一緒に導出する必要がある。

## GEMM の成功だけで検証を終えない

小さな bin の結果を直接縮約と比べ、複数 bin、末尾ブロック、空リスト、大きな padding 比率へ広げる。補助領域の無効位置は必要に応じゼロ化しないと、埋めた部分のデータも結果に入る。

この段階は部分実装の記録だった。後のバッファサイズの問題が示すように、GEMM として式を書くことは仕事の半分であり、配置、確保、アクセス範囲を整合させることがもう半分である。

## 参考資料と記録

- [NVIDIA：cuBLAS 公式ドキュメント](https://docs.nvidia.com/cuda/cublas/index.html)
