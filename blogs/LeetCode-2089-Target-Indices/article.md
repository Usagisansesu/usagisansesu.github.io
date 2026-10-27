---
title: 每日一题 · 2089. 找出数组排序后的目标下标
date: 2026-10-19
category: 每日一题
summary: 不必真正排序：统计小于 target 的元素个数，以及等于 target 的元素个数，就能直接确定目标下标所在的连续区间。
tags: LeetCode, C++, 计数, 数组
---

这道题要求返回数组按非递减顺序排序后，所有等于 target 的元素下标。直观做法是先排序，再遍历寻找；我的代码利用排序后的大小关系，通过一次计数直接确定答案。

## 核心观察：相同元素排序后一定连续

排序后的数组可以分成三部分：小于 target、等于 target、大于 target。

只要知道前两部分各有多少个元素，就能确定中间这一段的下标，不需要知道每一部分内部的具体排列。

代码中使用两个计数器：

- `sub_sum`：小于 target 的元素个数。
- `sum`：等于 target 的元素个数。

这里两个变量记录的都是元素数量，并不是元素值的总和。

## 为什么答案从 sub_sum 开始

数组下标从 0 开始。如果一共有 sub_sum 个元素小于 target，那么排序以后，它们占据最前面的 sub_sum 个位置。

因此，只要 target 存在，第一个 target 的下标就是 sub_sum。再考虑一共有 sum 个 target，答案就是下面这段连续区间：

```text
sub_sum, sub_sum + 1, ..., sub_sum + sum - 1
```

所以实现可以分成两步：先遍历数组统计数量，再把这段下标依次加入结果。

## 用一个例子走一遍

设数组为：

```text
nums = [1, 2, 5, 2, 3]
target = 2
```

小于 2 的元素只有 1，所以 sub_sum = 1；等于 2 的元素有两个，所以 sum = 2。

如果真的排序，数组会变成：

```text
[1, 2, 2, 3, 5]
    ↑  ↑
    1  2
```

因此答案为 [1, 2]。代码直接生成这两个下标，省去了实际排序的过程，也不会修改原数组。

## C++ 实现

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

第一个循环只负责计数。第二个循环执行 sum 次，每次先把当前下标加入 answer，再把下标加 1，因此结果天然按递增顺序排列。

如果数组中没有 target，sum 就是 0，代码不会进入生成答案的分支，最终返回空数组。如果所有元素都等于 target，sub_sum 为 0，生成的就是从 0 到 n − 1 的全部下标。

## 正确性说明

排序后，所有小于 target 的元素都必须排在 target 前面，它们的数量为 sub_sum，因此第一个 target 的位置被唯一确定。

所有等于 target 的元素又必须连续出现，且数量为 sum，所以它们恰好占据从 sub_sum 到 sub_sum + sum − 1 的位置。代码逐个输出这些下标，既不会遗漏，也不会加入其他元素的下标。

## 复杂度分析

设数组长度为 n，等于 target 的元素个数为 k。

- 时间复杂度：统计需要 O(n)，生成答案需要 O(k)。由于 k 不超过 n，总时间复杂度为 O(n)。
- 辅助空间复杂度：除返回结果外，只使用两个计数器，为 O(1)；返回结果需要 O(k) 空间。

这道题给我的启发是：题目描述包含排序，并不意味着实现一定要执行排序。先判断答案真正依赖哪些信息，有时只统计数量就足够了。

题目：[LeetCode 2089 · 找出数组排序后的目标下标](https://leetcode.cn/problems/find-target-indices-after-sorting-array/)。

