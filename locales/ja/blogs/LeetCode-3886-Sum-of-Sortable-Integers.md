---
title: 今日の一問 · 3886. ソート可能な整数の総和
summary: 配列長の約数を列挙し、各ブロックの巡回シフトによる整列と、ブロック間の大小関係を判定して可能な k を足す。
tags: LeetCode, C++, 配列, 全探索, 巡回シフト
---

配列を等長の連続ブロックに分け、各ブロックを独立に巡回シフトして、全体を非減少にする問題。私はブロック長を列挙し、内部とブロック間の条件を確認する方法を使った。実際の回転やソートはしない。

## k の意味を確認する

k は各部分配列の長さであり、ブロック数ではない。配列長 n が k で割り切れ、ブロック数は n / k になる。

位置は固定され、巡回シフトでは同じブロック内しか動かせない。そこで k の判定を二つに分ける。

- 各ブロックは巡回シフトで非減少にできるか。
- 整列後、前ブロックの最大値が次ブロックの最小値以下か。

両方を満たす k だけを答えへ加える。

## 元から整列していればすべての約数を加える

主関数は issorted で元配列が非減少か調べる。

整列済みなら、どの合法分割でも動かさずに済むため、n のすべての正の約数を直接加算できる。

未整列で k = 1 なら一要素ずつで何も変わらず不可能なので、コードは 2 から列挙し、n を割り切らない候補を飛ばす。

## ifsort：一ブロックを回転で整列できる条件

隣接要素で「後が前より小さい」位置を厳密下降点と呼ぶ。

下降点がなければ既に整列している。一つならそこで切り、後半を前へ移すことを考える。

```text
[3, 4, 1, 2]
       ↓ ここで切る
[1, 2] + [3, 4]
```

ただし「高々一つ」だけでは不十分だ。移動後、後半の末尾が前半の先頭以下でなければならない。[1, 3, 2, 4] は下降が一つでも、回転後の [2, 4, 1, 3] には下降が残る。

単一ブロックの条件をまとめる。

```text
厳密下降点がない：
    既に整列しているので受理。

厳密下降点が一つ：
    両部分が非減少で、元の末要素 <= 元の先頭要素。

厳密下降点が二つ以上：
    巡回的な並べ替えだけでは全下降を取り除けない。
```

ここで数えるのは線形配列内部の下降であり、先頭・末尾の接続は別に確認する。

## 元コードでの条件の維持

limit は下降点を数え、1 を超えると false を返す。

num_min はブロック先頭で初期化された後は変わらず、常に全体の最小を更新しているわけではない。最初の下降前は接頭辞が非減少なので、前半の最小はこの先頭値である。

最初の下降で、下がった値が元の先頭以下かを確認し、small と num_min_set を設定する。以後また下降すれば limit で拒否し、非減少でも num_min_set を超えたら拒否する。これで後半を前半の前へ置けることを保証する。

num_max は非減少の隣接対で更新され、最初の下降前には接頭辞末尾を表す。large と num_max_set の分岐もあるが、正整数入力・初回下降前が非減少という条件では到達しない。「下降点の個数＋後半が元の先頭を超えない」という要点を捉えればよく、余分な分岐を新たな数学条件と考える必要はない。

## ブロック間で最大・最小を比べる理由

回転で整列できる二ブロックでは、整列後の先頭・末尾はそれぞれ最小・最大になる。必要なのは次の条件だ。

```text
max(前ブロック) <= min(現在のブロック)
```

MaxOfVector、MinOfVector で範囲を取得し、max_last、min_last に前ブロックの情報を保存する。

元実装は最大同士、最小同士、前の最大と現在の最小を比較している。接続を決めるのは最後の項で、それが成立すれば最初の二つも成立するため、余分な検査だが判定結果は変わらない。

補助関数と主ループは -1 を未初期化の印に使う。この問題は正整数なので衝突しないが、負数を許す問題へ再利用する場合は初期化を見直す必要がある。

## 例：ブロック内が整列しても全体は整列しない

nums = [2, 1, 4, 3] は長さ 4 で、候補 k は 1、2、4。

| k | 判定 | 数えるか |
| --- | --- | --- |
| 1 | 一要素ずつで未整列を変えられない | いいえ |
| 2 | [2, 1]、[4, 3] を [1, 2]、[3, 4] にでき、2 <= 3 | はい |
| 4 | 全体に厳密下降点が二つある | いいえ |

答えは 2 となる。

[1, 3, 2, 4] の k = 2 では、[1, 3] と [2, 4] は各々整列しているが、前の最大 3 が後の最小 2 より大きい。ブロックをまたいで交換できないため、この k は不可能だ。

## C++ 実装

提出コードの構造をそのまま残す。

```cpp
class Solution {
public:
    bool ifsort (vector<int>& nums) {
        int limit = 0;
        int num_min = nums[0];
        int num_min_set = -1;
        int num_max = -1;
        int num_max_set = -1;
        bool small = false;
        bool large = false;
        for (int i = 0; i < nums.size() - 1; i++) {
            if (nums[i + 1] >= nums[i]) {
                num_max = nums[i + 1];
                if (limit == 1) {
                    if (small) {
                        if (nums[i + 1] > num_min_set) {
                            return false;
                        }
                    }
                    if (large) {
                        if (nums[i + 1] < num_max_set) {
                            return false;
                        }
                    }
                }
            }
            else if (nums[i + 1] < nums[i]) {
                limit++;
                if (limit > 1) {
                    return false;
                }
                if (num_max != -1) {
                    if (nums[i + 1] <= num_min && nums[i + 1] <= num_max) {
                        small = true;
                        num_min_set = num_min;
                    }
                    else if (nums[i + 1] >= num_min && nums[i + 1] >= num_max) {
                        large = true;
                        num_max_set = num_max;
                    }
                    else {
                        return false;
                    }
                }
                else {
                    if (nums[i + 1] < num_min) {
                        small = true;
                        num_min_set = num_min;
                    }
                    else if (nums[i + 1] > num_min) {
                        large = true;
                        num_max_set = num_min;
                    }
                }
            }
        }
        return true;
    }

    int MaxOfVector (vector<int>& nums) {
        int num_max = -1;
        for (int i = 0; i < nums.size(); i++) {
            if (num_max < nums[i]) {
                num_max = nums[i];
            }
        }
        return num_max;
    };

    int MinOfVector (vector<int>& nums) {
        int num_min = -1;
        for (int i = 0; i < nums.size(); i++) {
            if (num_min > nums[i] || num_min == -1) {
                num_min = nums[i];
            }
        }
        return num_min;
    };

    int sortableIntegers(vector<int>& nums) {
        int answer = 0;
        bool issorted = true;
        for (int i = 0; i < nums.size() - 1; i++) {
            if (nums[i + 1] < nums[i]) {
                issorted = false;
                break;
            };
        }
        if (issorted) {
            for (int i = 1; i <= nums.size(); i++) {
                if (nums.size() % i == 0) {
                    answer += i;
                }
            };
        }
        else {
            for (int i = 2; i <= nums.size(); i++) {
                if (nums.size() % i != 0) {
                    continue;
                }
                int vector_nums = nums.size() / i;
                int max_last = -1;
                int min_last = -1;
                bool ifthisloop = true;
                for (int j = 0; j < vector_nums; j++) {
                    vector<int> arr(nums.begin() + i * j, nums.begin() + i * (j + 1));
                    if (ifsort(arr)) {
                        if (max_last == -1 && min_last == -1) {
                            max_last = MaxOfVector(arr);
                            min_last = MinOfVector(arr);
                        }
                        else {
                            if (max_last > MaxOfVector(arr) || min_last > MinOfVector(arr) || max_last > MinOfVector(arr)) {
                                ifthisloop = false;
                                break;
                            }
                            else {
                                max_last = MaxOfVector(arr);
                                min_last = MinOfVector(arr);
                            }
                        }
                    }
                    else {
                        ifthisloop = false;
                        break;
                    }
                };
                if (ifthisloop) {
                    answer += i;
                }
            };
        }
        return answer;
    }
};
```

## 正しさの説明

コードは n の約数のみを調べ、合法な長さをすべて覆う。未整列時の k = 1 の除外で可能な答えを失うことはない。

各 k で ifsort が各ブロックの回転による非減少化を判定し、一つでも失敗すればその k は不可能となる。

全ブロックが通れば隣接境界を確認する。すべて満たせば各々の整列回転をつなげて全体を非減少にできる。逆に、前の最大が次の最小を超える境界があれば、どの回転でも整列した二ブロックを正しく接続できない。

したがって、条件を満たす k だけをちょうど加算する。

## 計算量

n の正の約数の個数を d(n) とする。

- 時間：候補列挙に O(n)。各合法長さについてコピー、内部判定、極値走査の合計は O(n) なので、全体は O(n × d(n))。重複走査は定数倍を増やすが、このオーダーは変わらない。
- 補助空間：現在のブロックを一時 vector にし、最悪の長さは n なので O(n)。状態変数は少なくても、この実装は O(1) 空間ではない。

全体のソートを「内部が回転で整列できるか」と「ブロック間を接続できるか」に分けることが鍵だった。操作で動かせる位置を区別すると、調べるべき境界が見えてくる。

問題と正整数の制約：[LeetCode 3886 · ソート可能な整数の総和](https://leetcode.cn/problems/sum-of-sortable-integers/)。
