---
title: 每日一题 · 3886. 可排序整数求和
date: 2026-10-20
category: 每日一题
summary: 枚举数组长度的因数，将每个候选块长拆成块内旋转有序与块间大小衔接两个判断，累加所有可行的 k。
tags: LeetCode, C++, 数组, 枚举, 循环移动
---

这道题允许把数组分成等长的连续块，再独立循环移动每一块，最后要求整个数组非递减。我的做法是枚举可能的块长，再分别检查块内和块间的条件，不实际执行旋转或排序。

## 先明确 k 的含义

k 表示每个子数组的长度，而不是分成多少块。若原数组长度为 n，必须满足 n 能被 k 整除，最终共有 n / k 块。

块的位置固定，循环移动只能改变同一块内部的顺序，不能把一个元素送到另一块。因此，判断一个 k 是否可行，可以拆成两个问题：

- 每一块是否能通过循环移动变成非递减序列？
- 各块变成有序以后，前一块的最大值是否不超过后一块的最小值？

两个条件同时成立，这个 k 才能计入答案。

## 已有序时，直接累加所有因数

主函数先用 issorted 检查原数组是否已经非递减。

如果原数组有序，任何合法分块都可以不做移动，整个数组自然保持有序。因此，所有 n 的正因数都是答案，直接累加即可。

如果原数组无序，k = 1 时每块只有一个元素，循环移动不会改变任何位置，所以一定无效。代码在这个分支中从 2 开始枚举，并跳过不能整除 n 的候选值。

## ifsort：一块怎样才能通过旋转有序

考虑一块数组，将相邻两个元素满足“后者小于前者”的位置称为严格下降点。

没有下降点，说明当前块已经有序。如果出现一个下降点，可以尝试在这里切开，把后半段搬到前面。例如：

```text
[3, 4, 1, 2]
       ↓ 切开
[1, 2] + [3, 4]
```

但“最多一个下降点”还不够。后半段搬到前面后，它的末尾必须不大于前半段的开头。例如 [1, 3, 2, 4] 虽然只有一个下降点，旋转后得到 [2, 4, 1, 3]，衔接处仍然无序。

因此，单块的判定可以概括为：

```text
没有严格下降点：
    已经有序，可以接受。

恰有一个严格下降点：
    两段分别非递减，并且原块末元素 <= 原块首元素。

有两个或更多严格下降点：
    无法只靠一次循环重排消除全部下降。
```

这里讨论的是线性数组内部的下降点；首尾衔接条件需要另外检查。

## 原代码怎样维护这些条件

limit 统计扫描中发现的下降点，超过 1 就立即返回 false。

num_min 初始化为块的首元素，之后没有更新；它在这里保存前半段的起始值，并不是始终维护整块最小值。第一次下降之前，前缀非递减，因此前半段最小值正好就是这个首元素。

第一次下降时，代码检查下降后的值是否落在前半段首元素的下方，并设置 small 和 num_min_set。后续若再次下降，limit 会拒绝；若继续非递减，却出现大于 num_min_set 的元素，也会拒绝。这样就保证了后半段能放到前半段前面。

num_max 在非递减相邻对上更新，第一次下降前对应前缀的末端值。代码还保留了 large 和 num_max_set 分支，但按本题正整数输入、首次下降前前缀非递减的条件，它们不会被触发。理解这份实现时，抓住“下降点计数＋后半段不能越过原首元素”即可，不必把这些额外分支当成新的数学条件。

## 块间为什么要比较最大值和最小值

若两块都能旋转为有序，旋转后的首尾分别就是各自的最小值和最大值。前一块必须满足：

```text
max(前一块) <= min(当前块)
```

代码用 MaxOfVector、MinOfVector 取得范围，用 max_last 和 min_last 保存上一块的信息。

原实现同时检查了前块最大值与当前块最大值、前块最小值与当前块最小值，以及前块最大值与当前块最小值。决定衔接是否有序的是最后一项；它成立时，前两项也会成立，因此另外两项属于冗余检查，不影响判定结果。

这些辅助函数与主循环都用 -1 作为未初始化标记。本题元素为正整数，标记不会与有效元素冲突；如果以后把代码复用到允许负数的题目，需要重新处理初始化方式。

## 用例：块内有序，不代表整体有序

取 nums = [2, 1, 4, 3]，长度为 4，候选 k 为 1、2、4。

| k | 判断 | 是否计入 |
| --- | --- | --- |
| 1 | 每块一个元素，原数组无序，移动无效 | 否 |
| 2 | [2, 1] 与 [4, 3] 分别旋转为 [1, 2]、[3, 4]，且 2 <= 3 | 是 |
| 4 | 整块有两个严格下降点 | 否 |

所以答案为 2。

再看 [1, 3, 2, 4] 的 k = 2：两块 [1, 3]、[2, 4] 内部都已有序，但前块最大值 3 大于后块最小值 2。由于元素不能跨块交换，这个 k 仍然不可行。

## C++ 实现

下面保留提交代码的原有结构：

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

## 正确性说明

首先，代码只考虑 n 的因数，覆盖了所有合法块长；原数组无序时排除 k = 1，不会遗漏可行答案。

对于每一个候选 k，ifsort 检查各块能否旋转为非递减；只要有一块失败，该 k 就不可能成功。

若每块均通过，再检查相邻块的大小边界。边界全部满足时，逐块选择各自的有序旋转，拼接后整段数组都非递减。反过来，若某个边界满足前块最大值大于后块最小值，无论如何旋转，都不能让两个已排序块正确衔接。

因此，代码恰好累加所有满足条件的 k。

## 复杂度分析

设 d(n) 为 n 的正因数个数。

- 时间复杂度：枚举候选值需要 O(n)。每个合法块长下，切片复制、块内判断和若干次最值扫描合计 O(n)，总复杂度为 O(n × d(n))。重复扫描增加常数开销，不改变这一量级。
- 辅助空间复杂度：代码为当前块构造临时 vector，最坏块长为 n，因此为 O(n)。虽然判定只需要少量状态变量，但这份具体实现并非 O(1) 空间。

这道题的关键是把整体排序拆成“块内是否可旋转有序”和“块间能否衔接”。先分清操作能改变哪些位置，才能找到需要检查的边界。

题目与正整数约束：[LeetCode 3886 · 可排序整数求和](https://leetcode.cn/problems/sum-of-sortable-integers/)。

