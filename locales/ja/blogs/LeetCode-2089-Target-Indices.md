---
title: 今日の一問 · 2089. ソート後の配列のターゲット添字を求める
summary: 実際にソートする必要はない。target より小さい要素数と等しい要素数を数えれば、答えの連続区間を直接求められる。
---

配列を非減少順に並べた後、target と等しい要素の添字をすべて返す問題。直感的にはソートして走査するが、私のコードはソート後の大小関係を使い、一回のカウントから答えを決める。

## 重要な観察：同じ要素はソート後に連続する

ソート後の配列は target より小さい部分、等しい部分、大きい部分に分けられる。

最初の二つの要素数が分かれば、中間部分の添字が決まる。各部分の内部順序を知る必要はない。

コードでは二つのカウンタを使う。

- `sub_sum`：target より小さい要素数。
- `sum`：target と等しい要素数。

どちらも要素の個数であり、要素の値の総和ではない。

## 答えが sub_sum から始まる理由

添字は 0 始まりである。target より小さい要素が sub_sum 個あれば、ソート後は最初の sub_sum 個の位置を占める。

よって target が存在すれば、最初の target の添字は sub_sum となる。target は sum 個あるため、答えは次の連続区間になる。

```text
sub_sum, sub_sum + 1, ..., sub_sum + sum - 1
```

実装は、配列を走査して数える段階と、この添字区間を順に結果へ追加する段階に分けられる。

## 例で確認する

次の配列を考える。

```text
nums = [1, 2, 5, 2, 3]
target = 2
```

2 より小さい要素は 1 のみなので sub_sum = 1、2 は二つなので sum = 2 となる。

実際にソートすると次のようになる。

```text
[1, 2, 2, 3, 5]
    ↑  ↑
    1  2
```

答えは [1, 2]。コードはこの二つの添字を直接生成し、ソートを省くため元の配列も変更しない。

## C++ 実装

```cpp
class Solution {
public:
    vector<int> targetIndices(vector<int>& nums, int target) {
        vector<int> answer;
        int sub_sum = 0;
        int sum = 0;
        for (int i = 0; i < nums.size(); i++) {
            if (nums[i] < target) {
                sub_sum++;
            }
            else if (nums[i] == target) {
                sum++;
            }
        };
        if (sum > 0) {
            for (int i = 0; i < sum; i++) {
                answer.push_back(sub_sum);
                sub_sum++;
            }
        }
        return answer;
    }
};
```

最初のループはカウントだけを行う。二つ目は sum 回実行し、現在の添字を answer へ追加してから 1 増やすので、結果は自然に昇順になる。

target がなければ sum は 0 で、答えを生成する分岐に入らず空配列を返す。全要素が target なら sub_sum は 0 となり、0 から n − 1 の全添字を生成する。

## 正しさの説明

ソート後、target より小さい要素はすべて target の前にある。その個数は sub_sum なので、最初の target の位置は一意に決まる。

等しい要素は連続し、個数は sum である。よって sub_sum から sub_sum + sum − 1 をちょうど占める。コードはこの全添字を出力し、欠落も別の要素の混入もない。

## 計算量

配列長を n、target と等しい要素数を k とする。

- 時間計算量：カウント O(n)、答えの生成 O(k)。k は n 以下なので全体は O(n)。
- 補助空間：返却結果を除けば二つのカウンタのみで O(1)。結果には O(k) が必要。

問題文にソートが含まれていても、実装でソートが必要とは限らない。答えが本当に必要とする情報を考えれば、数えるだけで十分な場合がある。

問題：[LeetCode 2089 · ソート後の配列のターゲット添字を求める](https://leetcode.cn/problems/find-target-indices-after-sorting-array/)。
