---
title: 実際の grouped GEMM：meta-GGA のグループ縮約とキャッシュ修正
summary: grouped GEMM 接続とキャッシュ修正を記録し、Grid 4 での約 1.20 倍が同経路上の AIXC 有効化による組み立ての改善であることを示す。
---

初期の bucket cuBLAS は、padding で同一 bucket 内の行列形状をそろえていた。10 月の新経路は実際の grouped GEMM を使い、各グループの形状を保つ。対象は padding の無駄とバッチ調整であり、XC 全体が一回のライブラリ呼び出しになったわけではない。

## grouped と padded bucket の違い

strided batched GEMM は同形状・同間隔の行列群に適する。bucket は padding によってその規則性を作る。literal grouped 経路は cublasDgemmGroupedBatched を使い、各グループに個別の形状を渡す。

この API には cuBLAS 12.5 以降が必要だ。workspace も設定可能で、記録の既定予算は 512 MiB だった。そのほかに AO、密度、キャッシュ、一時データがあるため、この値を GPU メモリ総使用量としてはいけない。

meta-GGA の組み立てには通常の AO 項と 3 方向の τ 縮約があり、形状、転置、係数を各項で対応させる必要がある。関数名一つの置換では済まない。

## 行列ライブラリ以外の二つの修正

接続時には AO・格子の枝刈り後に bin ID が更新されない問題を修正した。もう一つは rho/grouped が共有 task cache を交互に要求して再構築を繰り返す問題だった。前者は数値的な正しさ、後者は不要な準備コストに関わる。呼び出しの外側のメタデータとキャッシュも結果を左右する。

固定密度で Vxc を比較してから完全な SCF へ進む。新 API とキャッシュ修正を同時に統合した場合、比較する両側に同じ正しさの修正を適用し、旧不具合経路を基準にしない。

## 報告の格子表記を訂正する

10 月 14 日のスライドには Grid 3 とあったが、対応する報告と 36 本の実行コマンドは Grid 4 だった。ここでは確認可能な実行記録に従い、Grid 4 と表記する。

条件は SCAN/RKS、Cartesian cc-pVDZ、RI-J と cc-pVDZ-JKFIT 補助基底、RTX A6000、BGM 64/midpoint。両側で実際の grouped_v、同じ密度量の行列演算化、AO pack cache を使い、一方で代表比率 0.5 の AIXC を有効にした。

AIXC は warmup 3、start RMS 0.01、anchor RMS 0.05、refresh 24、max_delta 16。初期推定と収束法は core+damping 0.25、エネルギー／密度しきい値は 10⁻⁹/10⁻⁷ で、9 月のアブレーションとは更新条件も異なる。

独立した新規プロセス 3 回の全有効要求を統合した、要求あたりの平均組み立て時間をミリ秒で示す。anchor の 2 回の組み立ても同じ要求に含む。bucket と grouped の直接比較ではない。

| 分子 | AO 数 | BGM + grouped | BGM + AIXC（grouped 基盤） | 高速化率 |
| --- | ---: | ---: | ---: | ---: |
| Pentacene | 400 | 843.549 | 698.471 | 1.208× |
| Indigo | 350 | 644.716 | 533.827 | 1.208× |
| Tetracene | 330 | 640.984 | 530.927 | 1.207× |
| Anthracene | 260 | 444.307 | 369.567 | 1.202× |

## 約 1.20 倍は何を表すか

assembly は pack_metadata、zeroV、grouped_v などから構成され、ρ/σ/τ、汎関数評価、J、AIXC 外層の全コストは含まない。

約 1.20 倍とは、同じ grouped 基盤で AIXC を有効にしたこの比較の組み立て効果である。代表格子で一部の要求の処理量が減っており、固定密度・固定処理量のマイクロベンチマークではない。bucket padding 廃止の寄与を単独に測ったものでもない。完全な XC や実時間には別の計測を引用する必要がある。

実サイズを保つグループ縮約と AIXC の協調経路を動かし、対応付けとキャッシュの正しさを整えた。4 系は選定条件の適用例で、Pentacene の試行で選んだパラメータを共用している。普遍的な高速化へ一般化せず、後の r²SCAN 分析の明確な組み立て基準とした。

## 参考資料と記録

- [NVIDIA：cuBLAS 公式ドキュメント](https://docs.nvidia.com/cuda/cublas/index.html)
