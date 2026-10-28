window.CONTENT_MANIFEST = {
    "generatedAt": "2026-10-28T02:23:32.568Z",
    "blogs": [
        {
            "slug": "LeetCode-3963-Construct-Exactly-One-Path",
            "title": "每日一题 · 3963. 构造恰好一条路径的网格",
            "date": "2026-10-27",
            "category": "每日一题",
            "period": "",
            "written": "",
            "series": "",
            "seriesOrder": 0,
            "summary": "先用障碍填满网格，再打通第一行和最后一列，构造一条先向右、再向下的唯一路径。",
            "tags": [
                "LeetCode",
                "C++",
                "构造",
                "网格"
            ],
            "coverImage": "",
            "markdown": "题目要求构造一个 m × n 的网格，其中点号表示空单元格，井号表示障碍物。从左上角出发，每次只能向右或向下移动，最终到达右下角，并且有效路径必须恰好只有一条。\n\n我的做法是先把整个网格填成障碍，再沿着第一行和最后一列打通一条折线路径。这样既能保证起点与终点连通，也能避免出现额外的路线。\n\n## 核心思路：只留一条可以走的路\n\n这是一道构造题，不需要先建立复杂的网格，再计算其中有多少条路径。题目允许返回任意满足条件的结果，因此可以直接设计一个没有分岔的网格。\n\n我选择的路线是：\n\n```text\n(0, 0)\n    → 沿第一行一直向右\n(0, n - 1)\n    → 沿最后一列一直向下\n(m - 1, n - 1)\n```\n\n除这条路线以外，其余位置全部设置为障碍。\n\n## 代码如何完成构造\n\n首先创建 m 行、每行 n 个字符的结果，将所有位置初始化为井号：\n\n```cpp\nvector<string> answer(m, string(n, '#'));\n```\n\n第一个循环遍历行下标，把每一行的最后一个字符改成点号，也就是打通最后一列：\n\n```cpp\nfor (int i = 0; i < m; i++) {\n    answer[i][n - 1] = '.';\n}\n```\n\n第二个循环遍历列下标，把第一行全部改成点号：\n\n```cpp\nfor (int i = 0; i < n; i++) {\n    answer[0][i] = '.';\n}\n```\n\n注意，构造时先修改最后一列，再修改第一行，不影响最终行走的顺序。右上角会被两个循环各赋值一次，但两次写入的都是点号，不会产生冲突。\n\n## 用一个例子走一遍\n\n假设 m = 4、n = 5，最终得到：\n\n```text\n.....\n####.\n####.\n####.\n```\n\n从左上角出发，在到达最后一列之前，下方都是障碍，所以只能向右。走到右上角后，右侧已经越界，只能沿最后一列向下，直到终点。\n\n整条有效路径经过 m + n - 1 个空单元格，需要移动 m + n - 2 步。这里右上角同时属于第一行和最后一列，统计格子时只算一次。\n\n## C++ 实现\n\n下面保留我的原代码：\n\n```cpp\nclass Solution {\npublic:\n    vector<string> createGrid(int m, int n) {\n        vector<string> answer(m, string(n, '#'));\n        for (int i = 0; i < m; i++) {\n            answer[i][n - 1] = '.';\n        }\n        for (int i = 0; i < n; i++) {\n            answer[0][i] = '.';\n        }\n        return answer;\n    }\n};\n```\n\n## 为什么恰好只有一条路径\n\n先看路径是否存在。第一行和最后一列都是空单元格，它们在右上角相交。因此，先沿第一行向右，再沿最后一列向下，就能从起点到达终点。\n\n再看是否可能出现第二条路径。对于第一行中还没有到达最后一列的位置，只要下方仍在网格内，下方就是障碍，不能提前向下。进入最后一列后，又无法继续向右，只能向下。每一步的合法前进方向都被唯一确定，所以不存在其他有效路线。\n\n结合存在性和唯一性，这个构造恰好满足题目要求。\n\n## 单行、单列也可以直接处理\n\n- 当 m = 1 时，整张网格只有第一行，唯一的路径就是一直向右。\n- 当 n = 1 时，整张网格只有最后一列，唯一的路径就是一直向下。\n- 当 m = 1 且 n = 1 时，唯一的格子为点号，起点就是终点，不需要移动，也恰好有一条路径。\n\n这些情况都由原代码自然覆盖，不需要额外分支。\n\n## 复杂度分析\n\n- 时间复杂度为 O(m × n)：初始化整个结果需要写入 m × n 个字符，后续两个循环共进行 m + n 次赋值。不能只看这两个循环，就把整体时间算成 O(m + n)。\n- 空间复杂度为 O(m × n)：返回的网格占用与格子数相同数量级的空间；除返回结果外，只使用循环变量，辅助空间为 O(1)。\n\n这道题的关键是利用“任意一个符合条件的网格”这一要求。主动把所有分岔封住，就能直接保证路径唯一，不必再用动态规划统计路径数量。"
        },
        {
            "slug": "GANSU-36-Uniform-Grid-Basis-Benchmark",
            "title": "统一网格与三种基组：六种分子的 SCAN/r²SCAN + BGM + AIXC 对照",
            "date": "2026-10-26",
            "category": "性能实验",
            "period": "2026-10",
            "written": "2026-10-27",
            "series": "GANSU",
            "seriesOrder": 36,
            "summary": "统一 Grid 3、三种基组与相同 BGM/AIXC 条件，整理六分子的完整加速比，保留收益缩小及其他体系减速结果。",
            "tags": [
                "GANSU",
                "SCAN",
                "r²SCAN",
                "基准测试"
            ],
            "coverImage": "",
            "markdown": "前面的实验说明，优化收益对分子规模、基组和计时范围都很敏感。10 月 26 日进一步统一 Grid 3，对六种分子整理 SCAN 与 r²SCAN 的 BGM+AIXC 结果。目的不是寻找一张只剩漂亮数字的表，而是看收益在不同基组下怎样变化。\n\n## 统一了哪些条件\n\n实验使用单张 RTX A6000、RKS、BGM 64、相同 AIXC 参数与 RI-J；辅助基组为 cc-pVDZ-JKFIT。轨道基组采用 STO-3G、6-31G 与 Cartesian cc-pVDZ（6D）。\n\n每个分子/基组/泛函进行三次独立完整 SCF，第二轮交换泛函执行顺序。先对每次 SCF 的全部 XC 调用取平均，再对三次均值取平均。时间包括 ρ/σ/τ、泛函、Vxc 和 AIXC 组合，覆盖 full/anchor/delta/final_full；不含 J 与调用外的初始网格/AO 准备。\n\n因此，下面比较的是平均每次 XC 构筑成本，不能标成完整 SCF 墙钟。\n\n## 六种分子的完整加速比\n\n加速比定义为 SCAN 时间除以 r²SCAN 时间，大于 1 表示这项指标下 r²SCAN 更快。\n\n| 分子 | STO-3G | 6-31G | cc-pVDZ |\n| --- | ---: | ---: | ---: |\n| Benzene（苯） | 1.158× | 1.184× | 1.143× |\n| Acetone（丙酮） | 1.288× | 1.239× | 1.044× |\n| Acetaldehyde（乙醛） | 1.345× | 1.134× | 1.066× |\n| Ethanol（乙醇） | 1.425× | 1.177× | 1.092× |\n| Methanol（甲醇） | 1.510× | 1.283× | 1.110× |\n| Acetic acid（乙酸） | 1.369× | 1.151× | 1.073× |\n\n苯和丙酮来自上一批同条件的三次复测，复用前核对了程序、输入文件哈希与共同参数；其余四种分子为新增测量。汇总数据保留 source_study 字段，区分两个批次。\n\n[下载六分子、三基组的汇总 CSV](blogs/GANSU-36-Uniform-Grid-Basis-Benchmark/data/combined_summary.csv)。CSV 保留未四舍五入的时间、统计与来源，便于进一步分析。\n\n## 用绝对时间理解 6-31G 结果\n\n同为 6-31G、Grid 3 时，平均每次 XC 时间如下，单位毫秒：\n\n| 分子 | SCAN | r²SCAN | 加速比 |\n| --- | ---: | ---: | ---: |\n| Benzene | 83.501 | 70.534 | 1.184× |\n| Acetone | 52.184 | 42.107 | 1.239× |\n| Acetaldehyde | 25.697 | 22.665 | 1.134× |\n| Ethanol | 36.818 | 31.273 | 1.177× |\n| Methanol | 15.804 | 12.320 | 1.283× |\n| Acetic acid | 37.217 | 32.329 | 1.151× |\n\n这六种分子在该条件下的平均比值都超过 1.1，但不能推广到所有分子与基组。换成 cc-pVDZ 后，多个收益缩小到约 4%–9%；AO 相关工作增多时，泛函求值优化在总成本中的占比可能下降。\n\n## 保留没有超过门槛的结果\n\n上一批统一条件测试还包含 Naphthalene 与 Pentacene。cc-pVDZ 下对应加速比为 0.978 和 1.002：前者略慢，后者几乎持平。它们没有被纳入上面六种中小分子的选题表，但仍属于判断普适性的重要结果。\n\n新增四种分子的较慢样本也没有剔除。比如乙酸在 6-31G 下三轮加速比约为 1.125–1.166，甲醇在 cc-pVDZ 下约为 1.107–1.112。展示均值时应同时保留样本波动。\n\n## 能量验证支持什么\n\n新增 72 次计时 SCF 和 24 次关闭 AIXC 的参考 SCF 全部收敛。与各自同一泛函、RI-J、基组和网格的参考相比，最大能量差为 1.085×10⁻⁹ Ha；上一批统一测试的对应最大差为 2.33×10⁻⁹ Ha。\n\nSCAN 与 r²SCAN 本来就是不同泛函，二者能量之差不当作实现误差。这些检查也没有证明网格收敛、解析核力、电子态全局最小值或相同物理精度。\n\n到这里，这条从 HF 学习到 GPU meta-GGA 优化的记录形成了一条可回看的主线。下一步应继续补上独立正确性检查与更完整的端到端测量，并让新结果与旧基线保持可比较。\n\n## 资料与记录\n\n- [Furness 等：r²SCAN 原始论文](https://arxiv.org/html/2008.03374v2)"
        },
        {
            "slug": "GANSU-35-Timing-and-Speedup",
            "title": "如何读懂加速比：固定密度、单次 XC、累计 XC 和完整 SCF",
            "date": "2026-10-26",
            "category": "性能实验",
            "period": "2026-10",
            "written": "2026-10-27",
            "series": "GANSU",
            "seriesOrder": 35,
            "summary": "用已有实验区分固定密度、平均每次 XC、累计 XC 与完整 SCF 墙钟，解释调用次数如何改变加速比。",
            "tags": [
                "GANSU",
                "计时口径",
                "SCF",
                "AIXC"
            ],
            "coverImage": "",
            "markdown": "项目里已经出现了几种“加速比”：FD→AD 的泛函求值约 3.3 倍、grouped 路径启用 AIXC 后的组装约 1.20 倍、SCAN→r²SCAN 的平均 XC 约 1.06 倍。它们都可以正确，却回答着不同问题。整理到网站时，必须把分子、输入和计时边界一起写出来，不能让一个数字替代整个实验。\n\n## 四个常见计时层级\n\n| 指标 | 主要回答的问题 | 容易漏掉的成本 |\n| --- | --- | --- |\n| 固定密度的局部阶段 | 同样输入下，这段实现是否更快 | 其余计算、状态切换、收敛过程 |\n| 平均每次 XC | 一次实际 XC 调用平均多贵 | 调用次数、J、调用外的准备 |\n| 累计 XC | 整个 SCF 花了多少 XC 时间 | J、一次性初始化及其他模块 |\n| 完整流程墙钟 | 从启动到相同停止条件要多久 | 需注明是否包含预计算和输出 |\n\n对于 AIXC，平均值必须包括 full、anchor、delta、final_full。anchor 本身会做完整与代表网格两套工作，只拿 delta 与 full 比较，会漏掉近似路径的必要成本。\n\n## 一个实际的口径差异\n\n10 月 26 日 SCAN/r²SCAN + AIXC 实验采用 RTX A6000、STO-3G、Grid 3、BGM 64/midpoint、bucket 后端与 AO pack cache，代表比例 0.5。J 为 stored-J，不在 XC 计时内。每个分子/泛函进行三次完整 SCF，以下为汇总，单位毫秒：\n\n| 分子 | SCAN 平均 XC | r²SCAN 平均 XC | 平均加速比 | 累计 XC 加速比 |\n| --- | ---: | ---: | ---: | ---: |\n| Azobenzene | 163.381 | 153.710 | 1.063× | 1.095× |\n| Indigo | 290.530 | 274.290 | 1.059× | 1.059× |\n| Pentacene | 385.245 | 344.376 | 1.119× | 1.224× |\n\n累计 XC 对应的 SCAN→r²SCAN 时间依次为 5554.942→5072.417、9878.022→9325.868、24029.777→19629.431。它包含了不同调用次数的影响。\n\nPentacene 的 SCAN 调用数在 60–66 次之间，r²SCAN 为 57 次，因此累计收益不完全来自每次调用更快。把 1.224 倍写成“XC 内核提速”就会误导。\n\n## 两张表为什么不能相乘\n\n固定密度 FD→AD 的收益，与完整 SCF 中 SCAN→r²SCAN 的收益，既可能使用不同密度，也可能重叠包含同一部分计算。它们没有可直接相乘的独立关系。\n\n同样，grouped 底层启用 AIXC 的组装实验使用 Grid 4、cc-pVDZ，而上述表使用 Grid 3、STO-3G。前者的两边都用 grouped，并没有单独比较 bucket→grouped；跨输入、跨改动相乘，没有实际对应的程序运行。\n\n## 正确性通过后仍可能更慢\n\n这一批 18 次计算收敛，与各自同一泛函、关闭 AIXC 的参考相比，最终能量最大差约 3.1×10⁻¹⁰ Ha。这里检查的是近似路径回到其自身的完整基线，不是要求两个泛函能量相同。\n\n9 月消融实验则曾出现 BGM+AIXC 完整流程更慢的结果。二者不矛盾：输入、阶段、缓存与计时范围不同。把负结果保留，才有办法判断后续优化究竟解决了什么。\n\n今后的每张性能表都应让读者知道：分母是谁、统计多少次、包含哪些阶段，以及停止在什么条件。这样数字才能支持结论，而不是只让页面看起来更漂亮。"
        },
        {
            "slug": "GANSU-34-R2SCAN-Automatic-Differentiation",
            "title": "同一种 r²SCAN 的两版导数实现：有限差分到自动微分",
            "date": "2026-10-26",
            "category": "r²SCAN",
            "period": "2026-10",
            "written": "2026-10-27",
            "series": "GANSU",
            "seriesOrder": 34,
            "summary": "比较同一种 r²SCAN 的有限差分与自动微分实现，说明约 3.3 倍泛函求值收益为何只转化为较小完整 XC 收益。",
            "tags": [
                "GANSU",
                "自动微分",
                "r²SCAN",
                "性能实验"
            ],
            "coverImage": "",
            "markdown": "r²SCAN 接入后，有限差分导数需要重复计算能量表达式。10 月 26 日的优化把这部分替换为自动微分。这里比较的是同一种泛函的两版求导实现；SCAN 与 r²SCAN 的比较另有口径，不能混在一起解释。\n\n## 从反复采样到传播导数\n\n有限差分通过扰动输入估计导数。自动微分沿着实际运算图应用链式法则，在计算值的同时传播对输入变量的导数，减少多次完整求值。\n\n自动微分仍遵循浮点运算，也仍受代码中的分支和保护逻辑影响。它不会自动修复不连续的表达式，不能代替边界分析或与独立实现的对照。验证时需要同时检查能量、局部导数与组装后的 Vxc。\n\n## 如何固定比较对象\n\n该实验使用 RTX A6000、CUDA 13.3、STO-3G、Grid 3、RKS、BGM 64/midpoint、bucket cuBLAS 和 AO pack cache，关闭 AIXC。J 不计入这里的 XC 时间。\n\n先固定密度，然后每个独立进程调用五次，前两次热身，后三次进入统计；重复三个进程，共九个有效样本，并交替 FD/AD 的执行顺序。两版尽量共享相同对象与输入，仅替换对应求导实现。\n\n记录中的构建没有显式声明 Release，因此不把数据包装成该硬件的最高性能。\n\n## 泛函更快，XC 不会同比例变快\n\n下表单位为毫秒，表示固定密度下的完整 XC 调用：\n\n| 分子 | AO 数 | r²SCAN FD | r²SCAN AD | FD / AD |\n| --- | ---: | ---: | ---: | ---: |\n| Azobenzene | 80 | 99.264 | 94.563 | 1.050× |\n| Indigo | 110 | 166.889 | 161.435 | 1.034× |\n| Pentacene | 124 | 205.803 | 199.566 | 1.031× |\n\n同一实验中，单独泛函求值阶段的加速比分别约为 3.379、3.327、3.328 倍。但密度量、矩阵组装和其他成本仍在，所以完整 XC 只改善约 3% 至 5%。\n\n这与瓶颈迁移的讨论一致：当目标阶段只占部分成本，其局部收益必然被其余工作稀释。\n\n## 数值一致性与解释范围\n\nFD 与 AD 的能量最大差约为 4.55×10⁻¹³ Ha，说明这组固定输入下没有因换求导实现改变所算能量。导数正确性还需要独立对照，而不能只由能量相近推断。\n\n实验还记录了固定同一 r²SCAN 密度时 SCAN 的 XC 成本。由于泛函不同，这只能作为计算成本参照，不能证明相同物理精度，也不能直接当作完整 SCF 的加速比。\n\nPentacene 早期 core+damping 未收敛的尝试也保留在研究记录中；后续 SAD/DIIS 收敛样本应明确其条件。固定密度的核函数实验与“从同一初猜到收敛需要多久”，是两个需要分别回答的问题。\n\n## 资料与记录\n\n- [Furness 等：r²SCAN 原始论文](https://arxiv.org/html/2008.03374v2)"
        },
        {
            "slug": "LeetCode-3619-Count-Islands-Divisible-by-K",
            "title": "每日一题 · 3619. 总价值可以被 K 整除的岛屿数目",
            "date": "2026-10-26",
            "category": "每日一题",
            "period": "",
            "written": "",
            "series": "",
            "seriesOrder": 0,
            "summary": "从未访问的陆地出发做四方向 DFS，遍历整座岛屿并累加单元格价值，再用总和对 k 取余判断是否计入答案。",
            "tags": [
                "LeetCode",
                "C++",
                "DFS",
                "网格",
                "连通分量"
            ],
            "coverImage": "",
            "markdown": "这道题在统计岛屿数量的基础上，多了一个总价值的条件：只有整座岛屿的价值之和能被 k 整除，才计入答案。我的做法是用 DFS 找到每个四方向连通的陆地区域，在遍历过程中累加价值，最后统一判断。\n\n## 先找到一整座岛屿，再判断价值\n\n网格中，0 表示水域，正整数表示陆地。只有上下左右相邻的陆地相连，对角线接触不算连通。\n\n因此，不能对每个格子的值单独取余，也不能统计陆地格子数量后判断。需要先把同一座岛屿上的所有值加起来：\n\n```text\n岛屿总价值 = 该连通区域内所有陆地格子的数值之和\n\n总价值 % k == 0\n    → 这座岛屿计入答案\n```\n\n例如两个相连的格子分别为 2、3，k = 5 时，两格单独都不能被 5 整除，但整座岛屿的总价值为 5，应该计入。\n\n## 用 map 记录访问状态\n\n代码创建了与 grid 同样大小的布尔矩阵 map。这里的 map 是变量名，实际类型为 vector<vector<bool>>，用来标记格子是否已经访问。\n\n外层双重循环检查每一个位置，只有同时满足下面两个条件时，才启动一次新的 DFS：\n\n- 当前值不为 0，是陆地。\n- 当前格子没有访问过。\n\nDFS 会一次性标记这座岛屿上的全部陆地。因此，之后外层循环再遇到同一岛屿的其他格子时，就会直接跳过，不会重复统计。\n\n本题网格值非负，所以代码中的“不等于 0”与“是正整数陆地”在这里等价。\n\n## loop 如何遍历四个方向\n\n每次进入 loop，先做两件事：\n\n```cpp\nmap[i_n][j_n] = true;\nsum += grid[i_n][j_n];\n```\n\n随后依次检查上、下、左、右四个邻居。只有没有越界、仍然是陆地、而且尚未访问时，才递归进入。\n\n访问标记必须在探索邻居之前设置。否则相邻两个格子可能互相递归回去，也可能让同一格子的价值重复加入总和。\n\n方向检查中的顺序也有意义：先确认坐标合法，再读取 grid 和 map，利用逻辑与的短路行为避免越界访问。\n\n## 为什么 sum 要通过引用传递\n\nloop 的最后一个参数是 long int& sum。所有递归调用操作的是同一个累加器，每访问一个新的陆地格子，就把它的价值加进去。\n\n外层每发现一座新岛屿，都会先创建 sum = 0，再调用 DFS。这样岛屿之间的价值不会混在一起。\n\n当该次 DFS 返回时，整座岛屿都已经访问完毕，此时再判断 sum % k 是否为 0。取余检查每座岛只做一次，而不是在递归途中看到某个中间和满足条件就增加答案。\n\n## 用一个网格走一遍\n\n令 k = 5，网格如下：\n\n```text\n2  3  0\n0  0  4\n6  0  1\n```\n\n| 岛屿 | 包含的格子值 | 总价值 | 是否计入 |\n| --- | --- | ---: | --- |\n| 第一座 | 2、3 | 5 | 是 |\n| 第二座 | 4、1 | 5 | 是 |\n| 第三座 | 6 | 6 | 否 |\n\n第一座岛屿中的 3 与第二座中的 4 只在对角线方向接近，因此不会连成一座岛。最终答案为 2。\n\n遍历第一座岛后，2、3 对应的访问标记都变为 true。外层循环继续遇到 3 时，会直接跳过；4、1 与 6 则分别触发各自岛屿的 DFS。\n\n## C++ 实现\n\n下面保留原代码：\n\n```cpp\nclass Solution {\npublic:\n    int loop(vector<vector<int>>& grid, vector<vector<bool>>& map, int i_n, int j_n, int m, int n, long int& sum) {\n        map[i_n][j_n] = true;\n        sum += grid[i_n][j_n];\n        if (i_n - 1 >= 0 && grid[i_n - 1][j_n] != 0 && !map[i_n - 1][j_n]) {\n            loop(grid, map, i_n - 1, j_n, m, n, sum);\n        }\n        if (i_n + 1 < m && grid[i_n + 1][j_n] != 0 && !map[i_n + 1][j_n]) {\n            loop(grid, map, i_n + 1, j_n, m, n, sum);\n        }\n        if (j_n - 1 >= 0 && grid[i_n][j_n - 1] != 0 && !map[i_n][j_n - 1]) {\n            loop(grid, map, i_n, j_n - 1, m, n, sum);\n        }\n        if (j_n + 1 < n && grid[i_n][j_n + 1] != 0 && !map[i_n][j_n + 1]) {\n            loop(grid, map, i_n, j_n + 1, m, n, sum);\n        }\n        return sum;\n    }\n\n    int countIslands(vector<vector<int>>& grid, int k) {\n        int m = grid.size();\n        int n = grid[0].size();\n        int answer = 0;\n        vector<vector<bool>> map(m, vector<bool>(n, false));\n        for (int i = 0; i < m; i++) {\n            for (int j = 0; j < n; j++) {\n                if (grid[i][j] != 0 && !map[i][j]) {\n                    long int sum = 0;\n                    loop(grid, map, i, j, m, n, sum);\n                    cout << sum << endl;\n                    if (sum % k == 0) {\n                        answer++;\n                    }\n                }\n            }\n        }\n        return answer;\n    }\n};\n```\n\n## 实现中值得注意的细节\n\nsum 的更新依靠引用，主函数没有使用 loop 的返回值。辅助函数可以改成 void，让接口更直接；这里仍保留原代码的 int 返回类型。\n\n总价值可能很大，累加类型需要足够宽。long int 的宽度取决于编译平台，不能仅凭类型名称就认为一定是 64 位。若整理成通用版本，建议把累加器统一改为 long long，并将辅助函数改为 void，避免返回总和时再转换成 int。当前原代码中的返回值虽然没有参与统计，返回类型仍与累加器类型不一致。\n\ncout 输出的是每座岛的总价值，用于调试观察，不参与答案计算。正式使用时可以去掉，避免额外输出和频繁刷新带来的开销。\n\n递归深度也取决于岛屿形状。陆地连成很长的路径时，调用栈可能较深；若运行环境栈空间不足，可以用显式栈实现 DFS，或改成队列 BFS，遍历与求和思路不变。\n\n## 正确性说明\n\n从一块未访问的陆地出发，DFS 只沿四个方向进入未访问陆地，因此不会越过水域或跨到不连通区域。同时，任何与起点连通的陆地，都能沿某条陆地路径被发现，所以这次 DFS 恰好覆盖一整座岛屿。\n\n每个格子进入 DFS 后立刻标记，之后不会再次加入总和。因此，遍历结束时 sum 恰好等于这座岛屿所有格子的价值之和。\n\n外层循环最终会发现所有岛屿，并且每座只触发一次新的 DFS。对每个完整总和判断能否被 k 整除，恰好得到题目要求的岛屿数量。\n\n## 复杂度分析\n\n- 时间复杂度为 O(m × n)：外层遍历全部格子，每个陆地格子最多访问一次，每次只检查四个方向。\n- 辅助空间复杂度为 O(m × n)：访问矩阵占用与网格大小成正比的空间；递归调用栈在最坏情况下也可能达到 O(m × n)。\n\n这类题可以先把“找到连通区域”与“区域满足什么条件”分开。DFS 负责枚举一整块区域，累加器记录该区域的信息，区域遍历结束后再做最终判断。\n\n题目：[LeetCode 3619 · 总价值可以被 K 整除的岛屿数目](https://leetcode.cn/problems/count-islands-with-total-value-divisible-by-k/)。"
        },
        {
            "slug": "LeetCode-3863-Minimum-Operations-to-Sort-a-String",
            "title": "每日一题 · 3863. 将一个字符串排序的最小操作次数",
            "date": "2026-10-21",
            "category": "每日一题",
            "period": "",
            "written": "",
            "series": "",
            "seriesOrder": 0,
            "summary": "不能直接排序整个字符串，就从首尾字符与前后缀极值入手，按长度及边界条件判断最少需要 0、1、2、3 次操作，或无解。",
            "tags": [
                "LeetCode",
                "C++",
                "字符串",
                "分类讨论",
                "贪心"
            ],
            "coverImage": "",
            "markdown": "这道题每次可以把一个连续子字符串排序，但不能选择整个字符串。我的代码没有真的执行排序，而是统计前后缀的最小字符、最大字符与有序状态，再根据首尾边界直接判断最少操作次数。\n\n## 先处理长度为 1 和 2 的情况\n\n长度为 1 时，字符串天然有序，答案为 0。\n\n长度为 2 时，合法的非空真子串都只有一个字符，排序不会改变字符串。因此，两个字符本来有序就返回 0，否则返回 -1。\n\n长度至少为 3 时，前 n − 1 个字符和后 n − 1 个字符都可以作为合法操作区间，后面的分类讨论就围绕它们展开。\n\n## 为什么统计 s1 和 s2\n\n代码建立了两个长度为 n − 1 的字符串：\n\n```text\ns1 = s[0 .. n-2]：去掉最后一个字符的前缀\ns2 = s[1 .. n-1]：去掉第一个字符的后缀\n```\n\n它们分别对应“固定最后一个字符，整理前面”和“固定第一个字符，整理后面”两种操作。\n\n| 变量 | 含义 |\n| --- | --- |\n| max_s1 / min_s1 | 前 n − 1 个字符中的最大值 / 最小值 |\n| max_s2 / min_s2 | 后 n − 1 个字符中的最大值 / 最小值 |\n| ifs1sort | 前缀是否已经非递减 |\n| ifs2sort | 后缀是否已经非递减 |\n\n注意，s2 的最后一个位置是 n − 2，所以代码里的 `s2[s.length() - 2]` 正好就是原字符串的最后一个字符。\n\n## 答案为 0：整个字符串已有序\n\n当 n 至少为 3 时，s1 和 s2 覆盖了原字符串中的所有相邻字符对。两者都非递减，就说明原字符串也非递减：\n\n```cpp\nif (ifs1sort && ifs2sort) {\n    return 0;\n}\n```\n\n这一步要先判断。已有序的字符串同样满足后面的部分极值条件，但它根本不需要操作，不能误算为 1。\n\n## 答案为 1：首字符最小，或尾字符最大\n\n如果首字符不大于后缀中的最小字符，首字符已经处于全局最小的位置。只需排序剩余后缀，就能让整体有序。\n\n对称地，如果尾字符不小于前缀中的最大字符，只需排序前缀即可。\n\n这正是代码中的条件：\n\n```cpp\ns1[0] <= min_s2 || s2[s.length() - 2] >= max_s1\n```\n\n例如 bac 的尾字符 c 已经最大，排序前缀 ba，就得到 abc。\n\n这个条件也解释了为什么其他情况做不到一步：一次合法操作无法同时包含首尾，至少会留下一个端点不变。若留下首字符，它必须是全局最小；若留下尾字符，它必须是全局最大，才能得到有序结果。\n\n## 答案为 3：唯一最大在头，唯一最小在尾\n\n代码接着判断：\n\n```cpp\ns1[0] > max_s2 && s2[s.length() - 2] < min_s1\n```\n\n第一个严格不等式表示首字符比其余所有字符都大，即唯一最大字符位于开头。第二个表示尾字符比其余所有字符都小，即唯一最小字符位于结尾。\n\n为什么两步不够？第一次操作不能同时包含首尾，所以至少有一个错误的端点保持不动。如果留下开头的唯一最大字符，最后一次操作就必须把它从第一位搬到最后一位，这需要覆盖整个字符串，题目不允许；留下结尾的唯一最小字符同理。\n\n三步则一定可以做到。以 cba 为例，依次排序前缀、后缀、前缀：\n\n```text\ncba\n→ bca：排序前两个字符\n→ bac：排序后两个字符\n→ abc：排序前两个字符\n```\n\n对一般长度，这三个操作都选择 n − 1 个字符。第一次将唯一最大字符送到前缀末端；第二次把最大字符送到全串末尾，并将最小字符移入前缀；第三次排序前缀后，整体有序。因此这类情况恰好需要 3 次。\n\n## 其余情况为什么恰好是 2\n\n执行到最后的 else 时，字符串既没有序，也不能一步完成，又不属于上述唯一极值卡在两端的情况。\n\n此时至少满足下面一个条件：\n\n- 前 n − 1 个字符中含有某个全局最小字符。先排序前缀，让最小字符到达首位，再排序后缀，即可完成。\n- 后 n − 1 个字符中含有某个全局最大字符。先排序后缀，让最大字符到达末位，再排序前缀，即可完成。\n\n例如 bca 可以先排序后缀 ca 得到 bac，再排序前缀 ba 得到 abc，正好两步。\n\n由于前面的判断已经排除了 0 和 1 次，两步构造又确实存在，所以这里返回 2。\n\n## 严格不等号不能随意改动\n\n三次操作的判断强调极值唯一。如果首字符只是并列最大，后缀中仍有最大字符，可以先把它送到末尾；如果尾字符是并列最小，前缀中也可能直接找到最小字符。\n\n例如 ccba 虽然首字符最大、尾字符最小，却只需要两次：\n\n```text\nccba → cabc → abcc\n```\n\n所以三次操作的条件使用严格的大于和小于，不能换成大于等于、小于等于。\n\n## 几个分支放在一起看\n\n| 字符串 | 最少次数 | 原因 |\n| --- | ---: | --- |\n| aab | 0 | 已经非递减 |\n| bac | 1 | 尾字符为全局最大，排序前缀即可 |\n| bca | 2 | 后缀排序后固定最大字符，再排序前缀 |\n| cba | 3 | 唯一最大在首位，唯一最小在末位 |\n| ccba | 2 | 最大字符不唯一，不满足三次操作条件 |\n| ba | -1 | 长度为 2，合法操作无法改变顺序 |\n\n## C++ 实现\n\n下面保留原代码：\n\n```cpp\nclass Solution {\npublic:\n    int minOperations(string s) {\n        if (s.length() == 2) {\n            if (s[0] <= s[1]) {\n                return 0;\n            }\n            else {\n                return -1;\n            }\n        }\n        else if (s.length() == 1) {\n            return 0;\n        }\n        else {\n                string s1 = s.substr(0, s.length() - 1);\n                string s2 = s.substr(1, s.length() - 1);\n                char max_s1, min_s1, max_s2, min_s2;\n                max_s1 = s1[0];\n                min_s1 = s1[0];\n                max_s2 = s2[0];\n                min_s2 = s2[0];\n                bool ifs1sort = true;\n                bool ifs2sort = true;\n                for (int i = 1; i < s.length() - 1; i++) {\n                    if (max_s1 < s1[i]) {\n                        max_s1 = s1[i];\n                    }\n                    if (min_s1 > s1[i]) {\n                        min_s1 = s1[i];\n                    }\n                    if (max_s2 < s2[i]) {\n                        max_s2 = s2[i];\n                    }\n                    if (min_s2 > s2[i]) {\n                        min_s2 = s2[i];\n                    }\n                    if (s1[i] < s1[i - 1]) {\n                        ifs1sort = false;\n                    }\n                    if (s2[i] < s2[i - 1]) {\n                        ifs2sort = false;\n                    }\n                }\n                if (ifs1sort && ifs2sort) {\n                    return 0;\n                }\n                else if (s1[0] <= min_s2 || s2[s.length() - 2] >= max_s1) {\n                    return 1;\n                }\n                else if (s1[0] > max_s2 && s2[s.length() - 2] < min_s1) {\n                    return 3;\n                }\n                else {\n                    return 2;\n                }\n        }\n        return 0;\n    }\n};\n```\n\n## 复杂度分析\n\n- 时间复杂度为 O(n)：创建两个子串和同时扫描前后缀都只需要线性时间，代码没有实际调用排序。\n- 辅助空间复杂度为 O(n)：s1 和 s2 都会复制字符。虽然极值与状态变量只占常数空间，但这份实现不能按 O(1) 空间计算。\n\n这道题的切入点是“不能一次处理整个字符串”。先看首尾有哪些字符必须保留，再看能否用前后缀操作固定一个正确的端点，就能把看似需要模拟的问题化成少量分类判断。\n\n题目：[LeetCode 3863 · 将一个字符串排序的最小操作次数](https://leetcode.cn/problems/minimum-operations-to-sort-a-string/)。"
        },
        {
            "slug": "GANSU-33-R2SCAN-Integration",
            "title": "r²SCAN 的接入与首轮验证",
            "date": "2026-10-20",
            "category": "r²SCAN",
            "period": "2026-10",
            "written": "2026-10-27",
            "series": "GANSU",
            "seriesOrder": 33,
            "summary": "记录 r²SCAN 从能量、局部导数到 Vxc 的接入与首轮参考验证，明确能量测试和解析核力的边界。",
            "tags": [
                "GANSU",
                "r²SCAN",
                "Libxc",
                "正确性验证"
            ],
            "coverImage": "",
            "markdown": "接入 SCAN 并处理低密度和 α 边界以后，下一步开始研究 r²SCAN。它由既有研究提出：在改善数值行为的正则化基础上恢复重要约束。这里的工作是将其接入 GANSU，并检查能量与电子密度相关导数，没有重新提出泛函形式。\n\n## 接入不止是返回一个能量\n\n现有 XC 路径需要的接口包含能量密度及对 ρ、σ、τ 的导数。它们经过积分与 AO 收缩形成 Vxc，再进入 Fock/Kohn–Sham 矩阵。\n\n如果能量公式正确而导数不一致，固定密度的积分可能看起来正常，SCF 却会沿着错误的方向更新。因此，接入时要同时核对输入变量定义、是否按每电子能量返回、τ 的 1/2 约定，以及交换和相关部分的组合方式。\n\n## 首轮实现为什么采用有限差分\n\n早期有限差分可以在已有能量公式上建立导数路径，帮助先打通接口。代价是多次函数求值，以及步长选择引入的截断和舍入误差。\n\n在低密度、变量边界和分支附近，中心差分还可能采样到不合法一侧。保护策略必须与物理变量范围一致，并在逐点对照中检查，不能通过任意截断把异常隐藏掉。\n\n这条路径作为初始实现和后续对照保留下来，之后才继续比较自动微分版本。\n\n## 10 月 20 日记录支持的结果\n\n当时记录中，GPU 检查为 5/5 通过，逐点 Libxc 对照通过；小体系总能量如下，单位 Ha：\n\n| 体系 | GANSU | 参考值 | 绝对差 |\n| --- | ---: | ---: | ---: |\n| H₂ | -1.157402385286 | -1.157402389707 | 约 4.4×10⁻⁹ |\n| H₂O | -75.294334684718 | -75.294334689559 | 约 4.8×10⁻⁹ |\n\n这些值来自当日保存的实现验证，本文补写时没有重新运行 GPU 计算。它们只属于相应小体系和输入，不能替代更广泛的网格、基组和收敛测试。\n\n同阶段 H₂O 的 BGM+AIXC 与完整路径最终能量也达到约 7×10⁻¹⁴ Ha 的一致性。单次约 404 与 456 毫秒的计时样本只作为接线检查，不用于宣称稳定加速。\n\n## 能量与核力是不同的验证任务\n\n这里的导数主要是对密度变量的导数，用于电子结构迭代；原子核坐标的解析力还涉及 AO、积分网格、基组响应等其他项。\n\n因此，这一阶段不能写成“解析核力已完成”。同样，小体系能量一致也不能证明网格已收敛，或 r²SCAN 与 SCAN 对目标性质有相同精度。\n\n这次接入使后续优化有了同一条可对照的 r²SCAN 路径。下一篇再讨论：保持泛函不变，仅改变求导实现，能够省下多少时间。\n\n## 资料与记录\n\n- [Furness 等：r²SCAN 原始论文](https://arxiv.org/html/2008.03374v2)\n- [Sun、Ruzsinszky、Perdew：SCAN 原始论文](https://arxiv.org/abs/1504.03028)\n- [PySCF：数值积分源码与密度量约定](https://pyscf.org/_modules/pyscf/dft/numint.html)"
        },
        {
            "slug": "LeetCode-3886-Sum-of-Sortable-Integers",
            "title": "每日一题 · 3886. 可排序整数求和",
            "date": "2026-10-20",
            "category": "每日一题",
            "period": "",
            "written": "",
            "series": "",
            "seriesOrder": 0,
            "summary": "枚举数组长度的因数，将每个候选块长拆成块内旋转有序与块间大小衔接两个判断，累加所有可行的 k。",
            "tags": [
                "LeetCode",
                "C++",
                "数组",
                "枚举",
                "循环移动"
            ],
            "coverImage": "",
            "markdown": "这道题允许把数组分成等长的连续块，再独立循环移动每一块，最后要求整个数组非递减。我的做法是枚举可能的块长，再分别检查块内和块间的条件，不实际执行旋转或排序。\n\n## 先明确 k 的含义\n\nk 表示每个子数组的长度，而不是分成多少块。若原数组长度为 n，必须满足 n 能被 k 整除，最终共有 n / k 块。\n\n块的位置固定，循环移动只能改变同一块内部的顺序，不能把一个元素送到另一块。因此，判断一个 k 是否可行，可以拆成两个问题：\n\n- 每一块是否能通过循环移动变成非递减序列？\n- 各块变成有序以后，前一块的最大值是否不超过后一块的最小值？\n\n两个条件同时成立，这个 k 才能计入答案。\n\n## 已有序时，直接累加所有因数\n\n主函数先用 issorted 检查原数组是否已经非递减。\n\n如果原数组有序，任何合法分块都可以不做移动，整个数组自然保持有序。因此，所有 n 的正因数都是答案，直接累加即可。\n\n如果原数组无序，k = 1 时每块只有一个元素，循环移动不会改变任何位置，所以一定无效。代码在这个分支中从 2 开始枚举，并跳过不能整除 n 的候选值。\n\n## ifsort：一块怎样才能通过旋转有序\n\n考虑一块数组，将相邻两个元素满足“后者小于前者”的位置称为严格下降点。\n\n没有下降点，说明当前块已经有序。如果出现一个下降点，可以尝试在这里切开，把后半段搬到前面。例如：\n\n```text\n[3, 4, 1, 2]\n       ↓ 切开\n[1, 2] + [3, 4]\n```\n\n但“最多一个下降点”还不够。后半段搬到前面后，它的末尾必须不大于前半段的开头。例如 [1, 3, 2, 4] 虽然只有一个下降点，旋转后得到 [2, 4, 1, 3]，衔接处仍然无序。\n\n因此，单块的判定可以概括为：\n\n```text\n没有严格下降点：\n    已经有序，可以接受。\n\n恰有一个严格下降点：\n    两段分别非递减，并且原块末元素 <= 原块首元素。\n\n有两个或更多严格下降点：\n    无法只靠一次循环重排消除全部下降。\n```\n\n这里讨论的是线性数组内部的下降点；首尾衔接条件需要另外检查。\n\n## 原代码怎样维护这些条件\n\nlimit 统计扫描中发现的下降点，超过 1 就立即返回 false。\n\nnum_min 初始化为块的首元素，之后没有更新；它在这里保存前半段的起始值，并不是始终维护整块最小值。第一次下降之前，前缀非递减，因此前半段最小值正好就是这个首元素。\n\n第一次下降时，代码检查下降后的值是否落在前半段首元素的下方，并设置 small 和 num_min_set。后续若再次下降，limit 会拒绝；若继续非递减，却出现大于 num_min_set 的元素，也会拒绝。这样就保证了后半段能放到前半段前面。\n\nnum_max 在非递减相邻对上更新，第一次下降前对应前缀的末端值。代码还保留了 large 和 num_max_set 分支，但按本题正整数输入、首次下降前前缀非递减的条件，它们不会被触发。理解这份实现时，抓住“下降点计数＋后半段不能越过原首元素”即可，不必把这些额外分支当成新的数学条件。\n\n## 块间为什么要比较最大值和最小值\n\n若两块都能旋转为有序，旋转后的首尾分别就是各自的最小值和最大值。前一块必须满足：\n\n```text\nmax(前一块) <= min(当前块)\n```\n\n代码用 MaxOfVector、MinOfVector 取得范围，用 max_last 和 min_last 保存上一块的信息。\n\n原实现同时检查了前块最大值与当前块最大值、前块最小值与当前块最小值，以及前块最大值与当前块最小值。决定衔接是否有序的是最后一项；它成立时，前两项也会成立，因此另外两项属于冗余检查，不影响判定结果。\n\n这些辅助函数与主循环都用 -1 作为未初始化标记。本题元素为正整数，标记不会与有效元素冲突；如果以后把代码复用到允许负数的题目，需要重新处理初始化方式。\n\n## 用例：块内有序，不代表整体有序\n\n取 nums = [2, 1, 4, 3]，长度为 4，候选 k 为 1、2、4。\n\n| k | 判断 | 是否计入 |\n| --- | --- | --- |\n| 1 | 每块一个元素，原数组无序，移动无效 | 否 |\n| 2 | [2, 1] 与 [4, 3] 分别旋转为 [1, 2]、[3, 4]，且 2 <= 3 | 是 |\n| 4 | 整块有两个严格下降点 | 否 |\n\n所以答案为 2。\n\n再看 [1, 3, 2, 4] 的 k = 2：两块 [1, 3]、[2, 4] 内部都已有序，但前块最大值 3 大于后块最小值 2。由于元素不能跨块交换，这个 k 仍然不可行。\n\n## C++ 实现\n\n下面保留提交代码的原有结构：\n\n```cpp\nclass Solution {\npublic:\n    bool ifsort (vector<int>& nums) {\n        int limit = 0;\n        int num_min = nums[0];\n        int num_min_set = -1;\n        int num_max = -1;\n        int num_max_set = -1;\n        bool small = false;\n        bool large = false;\n        for (int i = 0; i < nums.size() - 1; i++) {\n            if (nums[i + 1] >= nums[i]) {\n                num_max = nums[i + 1];\n                if (limit == 1) {\n                    if (small) {\n                        if (nums[i + 1] > num_min_set) {\n                            return false;\n                        }\n                    }\n                    if (large) {\n                        if (nums[i + 1] < num_max_set) {\n                            return false;\n                        }\n                    }\n                }\n            }\n            else if (nums[i + 1] < nums[i]) {\n                limit++;\n                if (limit > 1) {\n                    return false;\n                }\n                if (num_max != -1) {\n                    if (nums[i + 1] <= num_min && nums[i + 1] <= num_max) {\n                        small = true;\n                        num_min_set = num_min;\n                    }\n                    else if (nums[i + 1] >= num_min && nums[i + 1] >= num_max) {\n                        large = true;\n                        num_max_set = num_max;\n                    }\n                    else {\n                        return false;\n                    }\n                }\n                else {\n                    if (nums[i + 1] < num_min) {\n                        small = true;\n                        num_min_set = num_min;\n                    }\n                    else if (nums[i + 1] > num_min) {\n                        large = true;\n                        num_max_set = num_min;\n                    }\n                }\n            }\n        }\n        return true;\n    }\n\n    int MaxOfVector (vector<int>& nums) {\n        int num_max = -1;\n        for (int i = 0; i < nums.size(); i++) {\n            if (num_max < nums[i]) {\n                num_max = nums[i];\n            }\n        }\n        return num_max;\n    };\n\n    int MinOfVector (vector<int>& nums) {\n        int num_min = -1;\n        for (int i = 0; i < nums.size(); i++) {\n            if (num_min > nums[i] || num_min == -1) {\n                num_min = nums[i];\n            }\n        }\n        return num_min;\n    };\n\n    int sortableIntegers(vector<int>& nums) {\n        int answer = 0;\n        bool issorted = true;\n        for (int i = 0; i < nums.size() - 1; i++) {\n            if (nums[i + 1] < nums[i]) {\n                issorted = false;\n                break;\n            };\n        }\n        if (issorted) {\n            for (int i = 1; i <= nums.size(); i++) {\n                if (nums.size() % i == 0) {\n                    answer += i;\n                }\n            };\n        }\n        else {\n            for (int i = 2; i <= nums.size(); i++) {\n                if (nums.size() % i != 0) {\n                    continue;\n                }\n                int vector_nums = nums.size() / i;\n                int max_last = -1;\n                int min_last = -1;\n                bool ifthisloop = true;\n                for (int j = 0; j < vector_nums; j++) {\n                    vector<int> arr(nums.begin() + i * j, nums.begin() + i * (j + 1));\n                    if (ifsort(arr)) {\n                        if (max_last == -1 && min_last == -1) {\n                            max_last = MaxOfVector(arr);\n                            min_last = MinOfVector(arr);\n                        }\n                        else {\n                            if (max_last > MaxOfVector(arr) || min_last > MinOfVector(arr) || max_last > MinOfVector(arr)) {\n                                ifthisloop = false;\n                                break;\n                            }\n                            else {\n                                max_last = MaxOfVector(arr);\n                                min_last = MinOfVector(arr);\n                            }\n                        }\n                    }\n                    else {\n                        ifthisloop = false;\n                        break;\n                    }\n                };\n                if (ifthisloop) {\n                    answer += i;\n                }\n            };\n        }\n        return answer;\n    }\n};\n```\n\n## 正确性说明\n\n首先，代码只考虑 n 的因数，覆盖了所有合法块长；原数组无序时排除 k = 1，不会遗漏可行答案。\n\n对于每一个候选 k，ifsort 检查各块能否旋转为非递减；只要有一块失败，该 k 就不可能成功。\n\n若每块均通过，再检查相邻块的大小边界。边界全部满足时，逐块选择各自的有序旋转，拼接后整段数组都非递减。反过来，若某个边界满足前块最大值大于后块最小值，无论如何旋转，都不能让两个已排序块正确衔接。\n\n因此，代码恰好累加所有满足条件的 k。\n\n## 复杂度分析\n\n设 d(n) 为 n 的正因数个数。\n\n- 时间复杂度：枚举候选值需要 O(n)。每个合法块长下，切片复制、块内判断和若干次最值扫描合计 O(n)，总复杂度为 O(n × d(n))。重复扫描增加常数开销，不改变这一量级。\n- 辅助空间复杂度：代码为当前块构造临时 vector，最坏块长为 n，因此为 O(n)。虽然判定只需要少量状态变量，但这份具体实现并非 O(1) 空间。\n\n这道题的关键是把整体排序拆成“块内是否可旋转有序”和“块间能否衔接”。先分清操作能改变哪些位置，才能找到需要检查的边界。\n\n题目与正整数约束：[LeetCode 3886 · 可排序整数求和](https://leetcode.cn/problems/sum-of-sortable-integers/)。"
        },
        {
            "slug": "LeetCode-2089-Target-Indices",
            "title": "每日一题 · 2089. 找出数组排序后的目标下标",
            "date": "2026-10-19",
            "category": "每日一题",
            "period": "",
            "written": "",
            "series": "",
            "seriesOrder": 0,
            "summary": "不必真正排序：统计小于 target 的元素个数，以及等于 target 的元素个数，就能直接确定目标下标所在的连续区间。",
            "tags": [
                "LeetCode",
                "C++",
                "计数",
                "数组"
            ],
            "coverImage": "",
            "markdown": "这道题要求返回数组按非递减顺序排序后，所有等于 target 的元素下标。直观做法是先排序，再遍历寻找；我的代码利用排序后的大小关系，通过一次计数直接确定答案。\n\n## 核心观察：相同元素排序后一定连续\n\n排序后的数组可以分成三部分：小于 target、等于 target、大于 target。\n\n只要知道前两部分各有多少个元素，就能确定中间这一段的下标，不需要知道每一部分内部的具体排列。\n\n代码中使用两个计数器：\n\n- `sub_sum`：小于 target 的元素个数。\n- `sum`：等于 target 的元素个数。\n\n这里两个变量记录的都是元素数量，并不是元素值的总和。\n\n## 为什么答案从 sub_sum 开始\n\n数组下标从 0 开始。如果一共有 sub_sum 个元素小于 target，那么排序以后，它们占据最前面的 sub_sum 个位置。\n\n因此，只要 target 存在，第一个 target 的下标就是 sub_sum。再考虑一共有 sum 个 target，答案就是下面这段连续区间：\n\n```text\nsub_sum, sub_sum + 1, ..., sub_sum + sum - 1\n```\n\n所以实现可以分成两步：先遍历数组统计数量，再把这段下标依次加入结果。\n\n## 用一个例子走一遍\n\n设数组为：\n\n```text\nnums = [1, 2, 5, 2, 3]\ntarget = 2\n```\n\n小于 2 的元素只有 1，所以 sub_sum = 1；等于 2 的元素有两个，所以 sum = 2。\n\n如果真的排序，数组会变成：\n\n```text\n[1, 2, 2, 3, 5]\n    ↑  ↑\n    1  2\n```\n\n因此答案为 [1, 2]。代码直接生成这两个下标，省去了实际排序的过程，也不会修改原数组。\n\n## C++ 实现\n\n```cpp\nclass Solution {\npublic:\n    vector<int> targetIndices(vector<int>& nums, int target) {\n        vector<int> answer;\n        int sub_sum = 0;\n        int sum = 0;\n        for (int i = 0; i < nums.size(); i++) {\n            if (nums[i] < target) {\n                sub_sum++;\n            }\n            else if (nums[i] == target) {\n                sum++;\n            }\n        };\n        if (sum > 0) {\n            for (int i = 0; i < sum; i++) {\n                answer.push_back(sub_sum);\n                sub_sum++;\n            }\n        }\n        return answer;\n    }\n};\n```\n\n第一个循环只负责计数。第二个循环执行 sum 次，每次先把当前下标加入 answer，再把下标加 1，因此结果天然按递增顺序排列。\n\n如果数组中没有 target，sum 就是 0，代码不会进入生成答案的分支，最终返回空数组。如果所有元素都等于 target，sub_sum 为 0，生成的就是从 0 到 n − 1 的全部下标。\n\n## 正确性说明\n\n排序后，所有小于 target 的元素都必须排在 target 前面，它们的数量为 sub_sum，因此第一个 target 的位置被唯一确定。\n\n所有等于 target 的元素又必须连续出现，且数量为 sum，所以它们恰好占据从 sub_sum 到 sub_sum + sum − 1 的位置。代码逐个输出这些下标，既不会遗漏，也不会加入其他元素的下标。\n\n## 复杂度分析\n\n设数组长度为 n，等于 target 的元素个数为 k。\n\n- 时间复杂度：统计需要 O(n)，生成答案需要 O(k)。由于 k 不超过 n，总时间复杂度为 O(n)。\n- 辅助空间复杂度：除返回结果外，只使用两个计数器，为 O(1)；返回结果需要 O(k) 空间。\n\n这道题给我的启发是：题目描述包含排序，并不意味着实现一定要执行排序。先判断答案真正依赖哪些信息，有时只统计数量就足够了。\n\n题目：[LeetCode 2089 · 找出数组排序后的目标下标](https://leetcode.cn/problems/find-target-indices-after-sorting-array/)。"
        },
        {
            "slug": "GANSU-32-Literal-Grouped-GEMM",
            "title": "真正的 grouped GEMM：meta-GGA 的分组收缩与缓存修复",
            "date": "2026-10-13",
            "category": "GPU 计算优化",
            "period": "2026-10",
            "written": "2026-10-27",
            "series": "GANSU",
            "seriesOrder": 32,
            "summary": "记录实际 grouped GEMM 接入与缓存修复，说明 Grid 4 下约 1.20 倍是该路径上启用 AIXC 的组装收益。",
            "tags": [
                "GANSU",
                "grouped GEMM",
                "cuBLAS",
                "meta-GGA"
            ],
            "coverImage": "",
            "markdown": "早期 bucket cuBLAS 通过填充，把同一个桶内的矩阵变成相同形状。10 月的新路径进一步使用真正的 grouped GEMM，让不同组保留实际形状。这解决的是填充浪费与批量调度问题，不意味着整次 XC 都变成了一个库调用。\n\n## grouped 与 padded bucket 的区别\n\nstrided batched GEMM 适合形状和批间跨度一致的一批矩阵。bucket 先人为制造这种一致性，代价是填充。literal grouped 路径使用 cublasDgemmGroupedBatched，为不同组提供各自的矩阵形状。\n\n这条接口需要 cuBLAS 12.5 或更新版本支持。实现还设置可配置的 workspace，记录中的默认预算为 512 MiB；workspace 之外仍有 AO、密度、缓存及其他临时数据，不能把这个数当作总显存用量。\n\nmeta-GGA 的组装包含普通 AO 项及三个方向的 τ 相关收缩，形状、转置和系数必须逐项对应，不能仅替换一个函数名。\n\n## 两处与矩阵库无关的修复\n\n接线期间修复了 AO/网格裁剪后 bin ID 未同步的问题；另一个调度问题是 rho/grouped 交替请求共享 task cache，造成反复重建。前者关系数值正确性，后者带来不必要的准备开销。库调用之外的元数据与缓存同样影响最终结果。\n\n验证应先固定密度比较 Vxc，再走完整 SCF。将新库调用与缓存修复同时合并后，性能比较双方也必须使用一致的正确性修复，避免把旧错误路径当基线。\n\n## 报告中的网格标注需要校正\n\n10 月 14 日组会幻灯片把这组实验写成 Grid 3，但对应报告与 36 条实际运行命令均为 Grid 4。本文采用可核查的运行记录，统一写作 Grid 4。\n\n条件为 SCAN/RKS、Cartesian cc-pVDZ、RI-J 与 cc-pVDZ-JKFIT 辅助基组、RTX A6000、BGM 64/midpoint。两边都使用真实 grouped_v、相同的密度量矩阵化与 AO pack cache；其中一边启用 AIXC，代表比例为 0.5。\n\nAIXC 使用 warmup 3、start RMS 0.01、anchor RMS 0.05、refresh 24、max_delta 16；初猜与收敛方式为 core+damping 0.25，能量/密度阈值为 10⁻⁹/10⁻⁷。这与 9 月消融的刷新条件也不同。\n\n三个独立新进程的全部有效请求合并统计，以下为平均每次请求的组装时间，单位毫秒；anchor 的两次组装计入同一个请求。这不是 bucket 与 grouped 两种矩阵后端的直接比较。\n\n| 分子 | AO 数 | BGM + grouped | BGM + AIXC（grouped 底层） | 加速比 |\n| --- | ---: | ---: | ---: | ---: |\n| Pentacene | 400 | 843.549 | 698.471 | 1.208× |\n| Indigo | 350 | 644.716 | 533.827 | 1.208× |\n| Tetracene | 330 | 640.984 | 530.927 | 1.207× |\n| Anthracene | 260 | 444.307 | 369.567 | 1.202× |\n\n## 约 1.20 倍具体指什么\n\n表中的 assembly 由 pack_metadata、zeroV 与 grouped_v 等对应阶段组成。它不包含 ρ/σ/τ、泛函求值、J 或 AIXC 外层全部成本。\n\n因此，约 1.20 倍是在同一个 grouped 底层上启用 AIXC 后，这一受控实验里的组装收益。代表网格减少了部分请求的工作量，双方并非固定同一密度、同一工作量的微基准。它没有单独量出取消 bucket padding 的贡献。若讨论完整 XC 或墙钟时间，需要引用各自单独的计时结果。\n\n这轮工作打通了保留真实尺寸的分组收缩，并验证其与 AIXC 协同运行的路径，同时整理了映射和缓存正确性。四个体系是选定条件下的适用案例；参数在 Pentacene 试跑中选定后共用，不能把结果推广为普遍加速。它也给后面分析 r²SCAN 留下了明确的组装基线。\n\n## 资料与记录\n\n- [NVIDIA：cuBLAS 官方文档](https://docs.nvidia.com/cuda/cublas/index.html)"
        },
        {
            "slug": "GANSU-31-Anchored-Incremental-XC",
            "title": "AIXC 接入 meta-GGA：full、anchor、delta 与最终全网格确认",
            "date": "2026-09-30",
            "category": "GPU 计算优化",
            "period": "2026-09",
            "written": "2026-10-27",
            "series": "GANSU",
            "seriesOrder": 31,
            "summary": "整理 AIXC 的代表点、锚点补偿与最终全网格确认，并保留一次未获整体加速的消融实验。",
            "tags": [
                "GANSU",
                "AIXC",
                "SCF",
                "消融实验"
            ],
            "coverImage": "",
            "markdown": "AIXC 的目标是在 SCF 尚未收敛时减少部分 XC 工作，同时让最终结果回到原配置的完整积分网格。9 月的接入是对已有 anchored incremental XC 思路的移植；本项目采用 stored-AO、单 GPU、固定单位系数的版本，没有同时移植多 GPU、secant scaling 等全部功能。\n\n## 代表点不能忽略权重符号\n\n实现先完成空间分组和可选密度裁剪，再在每个 bin 内选择代表点。分段内使用实际网格点代表其邻域，并汇总该段的积分权重。\n\n正、负权重分开处理，以免相互抵消后丢失结构。没有被覆盖的点单独保留。因此，设定代表比例 0.5，并不保证最后恰好只剩一半点。实际压缩比例与点分布、权重符号和 bin 边界有关。\n\n## 锚点怎样补偿近似\n\n在同一个锚点密度 P₀ 上同时计算完整和代表网格的 XC，得到矩阵差 C。此次移植采用：\n\n```text\nC = V_full(P₀) - V_rep(P₀)\nV_AIXC(P) = V_rep(P) + C\n\nE_AIXC(P) = E_full(P₀) + E_rep(P) - E_rep(P₀)\n            + Tr[C (P - P₀)]\n```\n\n能量中的线性项使其对密度的导数与所用 Vxc 一致。这一细节与参考实现的常数能量偏移形式不同，需要明确记录。对于实对称矩阵，代码中可以用等价的逐元素收缩实现迹。\n\nJ 仍由当前密度和选定 J 后端独立计算；AIXC 没有把 J 一起近似。\n\n## full、anchor、delta 与 final_full\n\n早期迭代使用 full；满足密度变化条件后建立 anchor；随后 delta 调用在代表网格上更新并加补偿。漂移过大、达到刷新间隔或调用上限时，状态会切换。\n\n第一次满足收敛条件后，程序永久返回完整网格，清理 DIIS/damping 历史，至少再进行两次完整 XC 调用并重新满足普通收敛条件。这里的“完整”仍指用户配置的网格与筛选，不能等同于连续积分极限或电子态全局最小值。\n\n## 一次没有得到整体收益的实验\n\n9 月 29 日消融使用 SCAN/RKS、Cartesian cc-pVDZ、Grid 3、RI-J、RTX A6000，报告三次独立进程的完整流程时间中位数，单位秒：\n\n| 分子 | Morton full | BGM full | Morton AIXC | BGM AIXC |\n| --- | ---: | ---: | ---: | ---: |\n| Benzene | 10.546 | 10.445 | 12.445 | 12.646 |\n| Vitamin C | 23.871 | 24.777 | 30.599 | 29.838 |\n| Azobenzene | 30.347 | 31.556 | 37.667 | 37.465 |\n| Indigo | 50.442 | 53.645 | 63.575 | 62.435 |\n| Pentacene | 67.733 | 69.207 | 83.834 | 87.667 |\n\n这组条件下，组合方案比 Morton full 更慢。60 次计时计算收敛，30 次 AIXC 的最终全网格核对通过，最大最终能量差约 1.9×10⁻⁹ Ha，但正确性通过并没有自动带来性能收益。\n\nanchor 需要两套积分，代表数据准备和共享缓存重建也有成本。后续优化应保留这些开销，不能只挑便宜的 delta 调用来展示加速。这份负结果为后续实验提供了必要基线。\n\n## 资料与记录\n\n- [GANSU 上游项目](https://github.com/Yasuaki-Ito/GANSU)"
        },
        {
            "slug": "GANSU-30-Coulomb-J-Backends",
            "title": "stored-J、direct-J 与 RI-J：正确性、显存与公平基线",
            "date": "2026-09-16",
            "category": "GPU 计算优化",
            "period": "2026-09",
            "written": "2026-10-27",
            "series": "GANSU",
            "seriesOrder": 30,
            "summary": "比较三种 Coulomb J 构建路线，明确 RI 拟合误差、显存成本与公平性能比较的边界。",
            "tags": [
                "GANSU",
                "RI-J",
                "Coulomb",
                "基准测试"
            ],
            "coverImage": "",
            "markdown": "比较 XC 优化之前，先固定 Coulomb J 的构建方式，是 9 月实验里很重要的一步。即使研究目标只在 meta-GGA，完整 SCF 的时间和能量仍会受 J 后端影响。stored-J、direct-J 与 RI-J 不应只当成三个可互换的速度开关。\n\n## stored-J 与 direct-J 的区别\n\n精确四中心积分给出 J 的基本收缩：\n\n```text\nJ_μν = Σ_λσ (μν|λσ) P_λσ\n```\n\nstored-J 预存所需积分，在迭代时读取并收缩；direct-J 在需要时计算积分，避免保存全部四中心数据。二者目标算式相同，但计算、显存与重复工作的分配不同。\n\n若按完整双精度四维数组粗估，存储规模为 8 nAO⁴ 字节。实际实现可能利用对称性、分块和筛选，因此这只是理解增长趋势的上界式估算，不是某个后端的实际显存报告。\n\n## RI-J 还引入辅助基组\n\nRI 用辅助基组近似四中心 Coulomb 积分。按移植说明中的记号，辅助库仑度量经 Cholesky 分解为 M = UᵀU，三中心积分整理成 T 后，可构造 B = T U⁻¹。\n\n把 AO 对视为一个复合索引，有：\n\n```text\nw      = Bᵀ vec(P)\nvec(J) = B w\n```\n\n实际编码需要正确处理 AO 对排列与对称因子。上式用于说明数据流，不能替代具体存储约定。保存完整 B 的粗略双精度成本为 8 nAux nAO² 字节，仍然可能很大。\n\n## 两种能量差不要混淆\n\n同一个 RI 实现与参考 RI 结果之间的偏差，主要检查代码、阈值和约定。RI 与精确四中心 J 之间的偏差，则还包含辅助基组拟合近似。\n\n所以，当 RI-J 与 stored-J 的总能量不同，不能立即判定 XC 出错；反过来，也不能用“RI 本来有误差”掩盖实现错误。正确比较要先统一辅助基组和拟合约定，再单独考察近似本身。\n\n## 给性能实验固定基线\n\n如果一组数据用 stored-J，另一组改成 RI-J，完整 SCF 的加速比就包含 J 路线改变。它无法单独归因于 BGM、AIXC 或 r²SCAN 的求导实现。\n\n后续文章会明确标注 RI-J、所用基组与网格，并尽量在同一路线下比较 XC。移植记录支持的是已有 RI-J 路径及相关适配，不意味着 direct RI 或解析核力也已经完成。\n\n这项整理使基准测试更容易解释：先确认比较双方在解决同一个数值问题，再讨论时间差来自哪里。\n\n## 资料与记录\n\n- [PySCF：SCF 方法与收敛](https://pyscf.org/user/scf.html)\n- [GANSU 上游项目](https://github.com/Yasuaki-Ito/GANSU)"
        },
        {
            "slug": "GANSU-29-BGM-Port",
            "title": "BGM 的移植与调参：键引导的空间分组在 meta-GGA 中怎样工作",
            "date": "2026-09-16",
            "category": "GPU 计算优化",
            "period": "2026-09",
            "written": "2026-10-27",
            "series": "GANSU",
            "seriesOrder": 29,
            "summary": "记录已有 BGM 方法在 GANSU 中的适配，区分种子、Morton 排序、bin 大小以及筛选近似的影响。",
            "tags": [
                "GANSU",
                "BGM",
                "空间分组",
                "Morton"
            ],
            "coverImage": "",
            "markdown": "9 月的工作引入 BGM，尝试用分子结构帮助组织积分网格。这里记录的是已有方法在 GANSU meta-GGA 路径中的适配与实验，不把方法本身写成原创。关注点是：怎样在保留输入积分点的前提下，让同一组点使用更相近的 AO 子集。\n\n## 从分子结构得到分组线索\n\n移植实现使用共价半径与原子距离判断候选化学键，距离阈值采用半径和的 1.3 倍。围绕这些结构信息生成种子，再把积分点归入相应的空间区域。\n\n种子规则是算法输入的一部分。代码存在不同模式，默认的 hexantiprism 与后续部分实验使用的 midpoint 不能混为同一种设置。默认不额外加入原子种子，也需要在复现实验时保留。\n\n## 空间顺序怎样进入 bin\n\n实现把坐标量化为全局 16 位空间编码，以 Morton 顺序组织点，并把种子编号与空间编码组合成排序键。概念上可以写成：\n\n```text\nsort_key = (seed_id << 48) | morton_code\n```\n\n这里的全局量化与早期“每组各自包围盒”的 Morton 实验不同。相同的 Morton 名称并不意味着完全相同的点顺序。\n\n排好序后再切分成 bin。默认 bin 大小与实验使用值也不同：后面不少受控比较使用 BGM 64、midpoint，不能把这些结果归给默认配置。\n\n## 分组本身是否减少积分点\n\n这一步应保留每一个输入点，改变的是组织顺序和分组。后续依据 AO 活跃性筛选、代表点近似或阈值裁剪，才可能改变实际执行的工作与误差。\n\n把这些阶段分开很重要。如果积分点在分组时意外丢失，能量变化不能解释成正常的 AO 筛选误差；如果近似发生在后续阶段，也不该把它归咎于排序本身。\n\n## bin 越小是否越快\n\n小 bin 可能让 AO 子集更紧，但也增加元数据、打包、调用和散射次数。大 bin 减少管理成本，却可能让活跃 AO 并集膨胀。最优点与分子、基组、网格和后端有关。\n\n因此，调参应同时记录 bin 数量、AO 数分布、有效与填充工作量、阶段计时及能量偏差。9 月到 10 月的结果也表明，BGM 与 AIXC 的组合并非在所有条件下都带来整体加速。\n\n这一阶段的收获是把“分子结构能否帮助分组”变成了可运行、可比较的实现。下一步仍需用完整成本验证它，而不是只凭空间图形更紧凑就判断性能更好。\n\n## 资料与记录\n\n- [GANSU 上游项目](https://github.com/Yasuaki-Ito/GANSU)"
        },
        {
            "slug": "GANSU-28-AO-Pack-Cache",
            "title": "AO/gradient pack cache：设计、复用和失效条件",
            "date": "2026-08-20",
            "category": "GPU 计算优化",
            "period": "2026-08",
            "written": "2026-10-27",
            "series": "GANSU",
            "seriesOrder": 28,
            "summary": "区分固定的 AO/梯度与变化的密度矩阵，整理打包缓存的复用范围、失效条件和验证方法。",
            "tags": [
                "GANSU",
                "缓存",
                "AO",
                "SCF"
            ],
            "coverImage": "",
            "markdown": "矩阵化让计算核更快，也让准备数据的成本更显眼。8 月提出、9 月完成的 AO/gradient pack cache，针对的是一个很具体的重复动作：在固定分子、基组和网格的 SCF 中，把相同的 AO 与梯度反复整理成相同的批量矩阵布局。\n\n## 哪些东西在 SCF 中不变\n\n在固定核坐标、基组、网格和分组策略下，网格点上的 AO 值与空间导数不随电子密度迭代改变。它们的打包结果具有复用条件。\n\nP 则每一轮都在变化。因此缓存命中时，可以复用 AO/梯度的 pack，仍需提取或打包当前的局部密度矩阵。把 AO 缓存理解为“整次 XC 结果缓存”，会直接跳过必要计算。\n\n记录中的实现路线是首次 miss 时完成打包，后续复用固定部分；变化的 P 继续更新。这与把所有输入一并缓存有本质差别。\n\n## 缓存键不能只看指针\n\n一个地址相同，不代表数据布局没变。网格裁剪、bin 重建或元数据升级后，同一块内存可能承载新的点顺序和 AO 列表。\n\n合理的缓存身份至少需要覆盖：几何与基组身份、网格版本、有效点索引、bin 的 AO 列表、桶形状、存储精度和布局。具体代码可以用版本号或组合标识实现，不必每次昂贵地比较全部数组；关键是每个会改变打包语义的动作都能触发失效。\n\n## 裁剪后的映射尤其容易遗漏\n\n假设缓存记录的是裁剪前的 bin 编号，而后续计算使用裁剪后的点集合。矩阵尺寸可能仍可通过检查，数据却来自另一个 bin。\n\n这类问题与前文的缓冲区越界不同：访问可能完全处于合法内存内，错误隐藏在语义层。后面的 grouped 路径还遇到了裁剪后 bin ID 未同步，以及共享 task cache 反复重建的问题，分别影响正确性与准备成本，说明缓存需要与布局变换一起维护。\n\n## 命中率只是中间指标\n\n缓存是否值得保留，要看端到端成本。首次构建更慢、常驻显存增加、输入改变后重新构建，都会影响收益。只展示“第二次命中很快”不能代表完整 SCF 的平均表现。\n\n验证时可对同一个 P 比较 miss 与 hit，再改变 P 检查结果随密度更新；最后主动改变网格或 bin 布局，确认缓存重新生成。还要把首次构建和后续命中的计时分别报告。\n\n从这项工作中得到的经验是：缓存保存的不只是数值，还保存了关于输入身份和布局的承诺。这个承诺明确，复用才可信；否则缓存会让错误变得更难重现。\n\n## 资料与记录\n\n- [NVIDIA：cuBLAS 官方文档](https://docs.nvidia.com/cuda/cublas/index.html)"
        },
        {
            "slug": "GANSU-27-Matrix-Density-Ingredients",
            "title": "ρ、σ、τ 的矩阵化：局部密度矩阵与批量收缩",
            "date": "2026-08-06",
            "category": "GPU 计算优化",
            "period": "2026-08",
            "written": "2026-10-27",
            "series": "GANSU",
            "seriesOrder": 27,
            "summary": "将 ρ、密度梯度和 τ 的 AO 对收缩整理为矩阵运算，并说明局部 AO 子集与填充的正确性要求。",
            "tags": [
                "GANSU",
                "密度矩阵",
                "GEMM",
                "meta-GGA"
            ],
            "coverImage": "",
            "markdown": "Vxc 组装变快以后，ρ、σ、τ 的生成成为显著开销。8 月的工作把视线移到这一段：能不能把逐点遍历 AO 对的计算整理成更适合 GPU 的矩阵乘法？答案取决于是否先把密度矩阵、AO 和梯度的约定对齐。\n\n## 固定一个清楚的矩阵方向\n\n以下讨论实数、受限闭壳层情形，P 已包含相应占据数。把一批网格点上的 AO 写成 Φ，形状为 nA × nG；三个方向的 AO 导数写成 D_x、D_y、D_z，形状相同。P 是对称的 nA × nA 密度矩阵。\n\n先计算：\n\n```text\nQ   = P Φ\nQ_a = P D_a,  a = x, y, z\n```\n\n随后做逐列内积即可得到各网格点的密度量：\n\n```text\nρ_g       = Σ_i Φ_ig Q_ig\n∂_a ρ_g   = 2 Σ_i (D_a)_ig Q_ig\nσ_g       = (∂_x ρ_g)² + (∂_y ρ_g)² + (∂_z ρ_g)²\nτ_g       = 1/2 Σ_a Σ_i (D_a)_ig (Q_a)_ig\n```\n\n梯度表达式里的 2 使用了 P 对称的条件；τ 的 1/2 则是本系列采用的约定。复轨道、自旋分辨等情形需要重新核对，不能直接照搬这些式子。\n\n## 局部化改变了哪部分\n\n空间分组让一个 bin 只使用可能有贡献的 AO 子集。对应地，需要从全局 P 提取同一组 AO 索引下的局部矩阵，并以相同顺序打包 Φ 和梯度。\n\n正确的 GEMM 无法修复错误的索引配对。如果 P 的第 i 行对应一个 AO，而 Φ 的第 i 行对应另一个 AO，所有尺寸仍然可能合法，结果却没有物理意义。因此，对照时既要看数值，也要检查 AO 列表和局部到全局的映射。\n\n## 从算术节省到数据重用\n\n矩阵化不一定减少数学上的乘加次数。它主要把运算交给成熟的矩阵库，并改善局部密度矩阵和 AO 数据的访问方式。梯度计算还可以复用 Q，不必为每个方向重新形成所有 AO 对。\n\n但收益要扣除局部 P 提取、AO 打包、填充和结果归约的成本。对于很小的 bin，启动和打包可能比计算还贵；对于 AO 数差异很大的分组，统一填充可能浪费大量工作。因此，矩阵化与分桶、空间分组、缓存需要一起评估。\n\n## 应该怎样比较\n\n最直接的检查是固定 P、网格和 AO 输入，将新旧路径输出的 ρ、三个梯度分量、σ、τ 逐项比较，再继续比较泛函输出与 Vxc。只看最终总能量，可能让不同误差抵消。\n\n阶段记录支持的是这一轮矩阵化工作的实现路线；性能结论仍应绑定当时输入。它也自然引出下一个问题：固定几何下，每一轮 SCF 都重新打包同一份 AO 和梯度，是否还有必要？\n\n## 资料与记录\n\n- [PySCF：数值积分源码与密度量约定](https://pyscf.org/_modules/pyscf/dft/numint.html)\n- [NVIDIA：cuBLAS 官方文档](https://docs.nvidia.com/cuda/cublas/index.html)"
        },
        {
            "slug": "GANSU-26-Bottleneck-Migration",
            "title": "优化 Vxc 以后：为什么瓶颈转移到了 ρ/σ/τ",
            "date": "2026-07-24",
            "category": "GPU 计算优化",
            "period": "2026-07",
            "written": "2026-10-27",
            "series": "GANSU",
            "seriesOrder": 26,
            "summary": "以 2026 年 7 月的阶段计时解释瓶颈迁移：Vxc 变快以后，下一步为什么转向密度量计算。",
            "tags": [
                "GANSU",
                "性能分析",
                "meta-GGA",
                "Amdahl"
            ],
            "coverImage": "",
            "markdown": "优化前，最显眼的开销容易成为整个项目的注意力中心。优化后还沿用同一份直觉，就会继续打磨已经不再主导总时间的部分。7 月的 GANSU 记录里，Vxc 组装逐步加速后，ρ、σ、τ 的计算成为新的主要目标。\n\n## 先把一次 XC 拆开\n\n当时 Azobenzene 的阶段计时如下，单位为毫秒：\n\n| 阶段 | 时间 |\n| --- | ---: |\n| ρ / σ / τ 计算 | 1060.388 |\n| 泛函求值 | 38.965 |\n| Vxc 组装 | 476.127 |\n| 上述阶段合计 | 1575.480 |\n\n这是一份特定阶段、体系和实现条件下的记录，不能与后面改变基组、网格或 J 后端的结果直接拼成一条加速曲线。它的价值首先在于同一次测量内部的比例：密度量约占 67.3%，Vxc 组装约占 30.2%，泛函求值约占 2.5%。\n\n## 局部加速的上限\n\n假设其余阶段完全不变，即便把这张表里的 Vxc 组装时间压到零，合计时间仍至少约为 1099 毫秒，对应约 1.43 倍的理论上限。这还是理想情况，没有计入新布局、数据搬运和同步的附加成本。\n\n一般可以用 Amdahl 关系理解：\n\n```text\noverall_speedup = 1 / ((1 - p) + p / local_speedup)\n```\n\np 是被优化阶段原来的时间占比。这不是预测工具，而是一个合理性检查：如果优化目标只占很小比例，就不应期待整个流程出现数量级提升。\n\n## 为什么密度量变得突出\n\nmeta-GGA 不只需要 ρ，还要读取 AO 梯度，形成密度梯度、σ 与 τ。逐点、逐 AO 对的实现会反复访问密度矩阵；即便单次乘加便宜，重复读写和索引也会累积。\n\n因此，下一步不再只是减少 Vxc 的散射开销，而是考虑把局部密度矩阵与 AO、梯度的收缩整理成矩阵乘法。这样才能让已经优化过的组装阶段与前半段数据生产配合起来。\n\n## 避免制造新的“总时间”\n\n同一份组会材料还出现了 PySCF 对照计时，但若未保留完整输入、热身、线程和计时边界，仅凭一个数就宣布软件整体更快并不稳妥。这里保留阶段分解，不把它扩展成完整 SCF 的胜负结论。\n\n后续实验需要明确计时是否包含网格生成、AO 预计算、打包、泛函、组装、J、首次初始化与收敛迭代。把这些边界写清楚，比多保留几位小数更重要。\n\n这次瓶颈迁移推动了后续的密度矩阵化和 AO 打包缓存。优化路线由测量结果更新，而不是由最早发现的问题一直决定。"
        },
        {
            "slug": "GANSU-25-Padding-Buffer-Bug",
            "title": "actual_nA 与 padded_nA：一次 GPU 缓冲区尺寸错误",
            "date": "2026-07-24",
            "category": "GPU 计算优化",
            "period": "2026-07",
            "written": "2026-10-27",
            "series": "GANSU",
            "seriesOrder": 25,
            "summary": "从一次实际的缓冲区错误出发，梳理有效 AO 数、填充尺寸与批量矩阵访问之间的约束。",
            "tags": [
                "GANSU",
                "CUDA",
                "显存",
                "调试"
            ],
            "coverImage": "",
            "markdown": "Bucket 化以后，一个 bin 往往同时有两种 AO 数量：真实参与计算的 actual_nA，以及为同桶矩阵统一形状而使用的 padded_nA。2026 年 7 月的一次错误就发生在二者之间：缓冲区按真实大小分配，计算却按填充后的形状访问。小体系能跑通，没有证明这条路径安全。\n\n## 两种尺寸为什么都会存在\n\n真实 AO 数决定物理上需要哪些基函数；填充尺寸决定矩阵在内存里怎样排列。假设某 bin 有 37 个有效 AO，同一个桶用 48 行存储，那么矩阵运算看到的是 48 行。多出的 11 行应当被初始化为零，随后只将真实 AO 对应的结果散射回全局矩阵。\n\n“补零”首先要求那 11 行确实有存储空间。若只分配了 37 行，后续写零已经越界，不能通过把计算结果乘零来补救。\n\n## 错误不一定出现在报错的位置\n\nGPU 访问往往异步执行。一次越界可能污染相邻缓冲区，最后在另一个 kernel 或库函数调用处被发现。沿着最后一条错误信息去改算式，容易修错地方。\n\n回查这类问题时，需要把分配、打包、库调用和回写放在同一张尺寸表里。对每个缓冲区记录元素类型、行列数、leading dimension、batch stride 和容量。以列主序为例，leading dimension 描述物理列跨度，并不等于“当前有多少行有效数据”；它与容量、转置标志必须一致。\n\n## 不只检查一个 nA\n\n修复思路应覆盖完整的数据链，而不是只把某个 malloc 的参数替换掉。AO 值、三个方向的梯度、局部密度矩阵以及临时乘积，可能有不同的形状和生命期。\n\n可把约束写成直接可查的关系：\n\n```text\nactual_nA <= padded_nA\nallocated_elements >= physical_stride * batch_count\ninactive entries = 0\nscatter indices refer only to active AO entries\n```\n\n这里的 physical_stride 必须由真实布局推导，不能仅凭名字猜测。如果一个 batch 的末尾不需要完整 stride，也可以精确计算容量；关键是分配公式与最大访问地址一致。\n\n## 怎样避免再次出现\n\n有价值的回归样本应跨过桶边界，例如有效 AO 数刚好等于桶宽、比桶宽少一行，以及刚好多一行。还应覆盖最后一个不满批次的 bin。与逐 bin 的正确参考实现比较矩阵及能量，才能同时检查边界和数值结果。\n\n这些是从事故中提炼出的检查要求，不代表本文重新运行了一套新的 GPU 检测。阶段记录确认的是分配尺寸与访问尺寸不一致这一问题。更长期的改进，是让尺寸、索引映射和缓存元数据由同一个布局对象提供，减少不同代码段各自推算尺寸的机会。\n\n这次问题让我意识到，矩阵化不仅是把循环换成 GEMM。真正容易出错的是数学形状与物理存储之间的接口。\n\n## 资料与记录\n\n- [NVIDIA：cuBLAS 官方文档](https://docs.nvidia.com/cuda/cublas/index.html)"
        },
        {
            "slug": "GANSU-24-Bucket-cuBLAS",
            "title": "Bucket + cuBLAS：不规则 bin 如何变成批量矩阵乘法",
            "date": "2026-07-10",
            "category": "GPU 计算优化",
            "period": "2026-07",
            "written": "2026-10-27",
            "series": "GANSU",
            "seriesOrder": 24,
            "summary": "解释不规则 active AO/bin 如何通过 bucket、padding 和 pack 转成 batched GEMM，并厘清 leading dimension 与 stride。",
            "tags": [
                "GANSU",
                "cuBLAS",
                "Bucket",
                "Batched GEMM"
            ],
            "coverImage": "",
            "markdown": "7 月 10 日的组会开始展示 Bucket-cuBLAS 的部分实现。它连接了两个原本不匹配的世界：空间筛选产生大小不一的局部列表，而高效矩阵库更擅长处理规则的连续数组。\n\n## bucket 为什么需要 padding\n\n不同 bin 的 active AO 数与格点数不同。把形状相近的 bin 分到同一 bucket，再填充到相容尺寸，就能让多个局部运算使用同一组矩阵参数。\n\npadding 会增加额外运算和存储，因此 bucket 分得更细并不必然更快。还要考虑批量规模、空位比例、pack 和 scatter 成本，而不是只追求每次 GEMM 的峰值利用率。\n\n## pack 的工作内容\n\n原始 AO 数据可能通过非连续的格点 ID 和 AO ID 访问。pack 把需要的数据整理为连续小矩阵，再形成带权重和局部导数的 RHS。矩阵乘法完成后，通过全局 AO 映射写回 Vxc。\n\n若采用 `Φ` 为 nA×nG 的列主序表示，常见局部收缩可表达为 `Φ Rᵀ` 一类形式。真正的 meta-GGA 还包括梯度与 τ 项，不能把一项乘法当作全部 Vxc。\n\n## leading dimension 与 stride\n\nleading dimension 描述矩阵在内存中的主步长，不等于逻辑行数总能直接照填。strided-batched 的 stride 又描述相邻矩阵起点的间隔，通常以元素数量计，而不是字节。\n\n```text\n逻辑形状     决定有效的物理数据\npadding形状  决定规则计算与部分访问范围\nleading dim  决定矩阵内部寻址\nbatch stride 决定下一块矩阵从哪里开始\n```\n\ntranspose 参数改变运算中的解释，不会替你把内存重排。接口中的 m、n、k、lda 与实际分配必须一起推导。\n\n## 验证不能只看 GEMM 返回成功\n\n先把一个小 bin 的库结果与直接收缩比较，再覆盖多 bin、尾块、空列表和大 padding 比例。每个辅助区的无效位置必须按要求置零，否则填充区的数据也会进入结果。\n\n本阶段是部分实现记录。后面出现的缓冲区尺寸错误，恰好说明把公式写成 GEMM 只是其中一半，另一半是让布局、分配和访问范围完全相容。\n\n## 资料与记录\n\n- [NVIDIA：cuBLAS 官方文档](https://docs.nvidia.com/cuda/cublas/index.html)"
        },
        {
            "slug": "GANSU-23-Morton-Ordering",
            "title": "Morton 排序：把三维格点组织成连续的工作单元",
            "date": "2026-06-26",
            "category": "GPU 计算优化",
            "period": "2026-06",
            "written": "2026-10-27",
            "series": "GANSU",
            "seriesOrder": 23,
            "summary": "整理 Morton 编码、seed 分组与格点排序的作用，并区分 6 月历史实现和后续 BGM 的量化约定。",
            "tags": [
                "GANSU",
                "Morton",
                "空间排序",
                "局域性"
            ],
            "coverImage": "",
            "markdown": "6 月 26 日的记录转向 Morton 排序。这里的目标是把几何上相近的格点尽量组织到相近的访问位置，为后续分箱、AO 筛选和批量计算提供另一种布局。\n\n## 从三维坐标到一维整数\n\n一种典型做法是先把 x、y、z 量化为有限位整数，再交错各方向的二进制位，形成 Morton code。之后按整数键排序，就得到一条近似保持空间邻近性的访问序列。\n\n它不是距离的精确排序。空间中某些相邻点仍可能跨越编码的不连续边界；效果需要看最终 bin 的范围、active AO 和实际工作量，而不是只看排序完成得是否很快。\n\n## seed 与编码是两个层次\n\n当时的材料还包含基于原子及相近原子对构造 seed、将点分配到最近 seed 的步骤。seed 负责形成组，Morton code 负责组内或更大范围内的空间次序。\n\n这两个层次的参数不能混为一谈。改变 seed 集合与改变 bin 容量，都可能改变后续 AO 列表，导致工作量不同。\n\n## 量化范围属于算法定义\n\n6 月材料按组的包围盒说明坐标归一化；后来的 BGM 适配说明采用全局 16 位坐标量化，并把 seed ID 放入组合键。它们属于不同阶段的约定，不能把后来的实现细节倒写进早期版本。\n\n若某个方向范围为零，或点恰在边界上，量化、截断和相同键的处理应有明确规则。排序后的点 ID 也必须同步权重及 AO 数据，不能只重排坐标。\n\n## 与 Octree 的公平比较\n\n比较时要固定网格、AO 筛选阈值和 XC 后端，再记录分箱构建成本、bin 形状、AO pair 工作量及总 XC 时间。若同时把 scalar kernel 改为 cuBLAS，便无法把全部收益归因于空间排序。\n\nMorton 的价值是提供一种可组合的数据组织方法。它能否优于 Octree，取决于分子、基组和后续计算；没有必要把一次有利结果总结为所有场景都更优。\n\n从这一阶段开始，优化问题逐渐从“公式如何在 GPU 上计算”转向“让同样的公式读到更适合硬件的数据”。\n\n## 资料与记录\n\n- [GANSU 上游项目](https://github.com/Yasuaki-Ito/GANSU)"
        },
        {
            "slug": "GANSU-22-Symmetric-Vxc-Scatter",
            "title": "Vxc 对称性与 scatter：上三角优化怎样保持正确",
            "date": "2026-06-12",
            "category": "GPU 计算优化",
            "period": "2026-06",
            "written": "2026-10-27",
            "series": "GANSU",
            "seriesOrder": 22,
            "summary": "说明 Vxc 的局部矩阵、全局 AO 编号和对称累加，重点讨论对角项、重叠 bin 和原子累加误差。",
            "tags": [
                "GANSU",
                "Vxc",
                "对称性",
                "scatter"
            ],
            "coverImage": "",
            "markdown": "与 Octree 实现同时出现的一个优化，是利用 Vxc 的对称性减少 AO pair 重复计算。这个思路简单，但实际写回时有几个容易被“对称矩阵”四个字遮住的细节。\n\n## 局部下标不等于全局 AO 编号\n\n一个 bin 里可能只保留部分 AO。例如局部编号 0、1、2 可能对应全局的 3、8、11。局部矩阵先按紧凑编号形成，scatter 时再通过 AO ID 映射到全局位置。\n\n如果把局部维数当作全局 leading dimension，或在两个 bin 之间复用不相容的 AO 列表，输出仍可能落在合法内存内，却已经不是正确矩阵。因此需要带非连续 AO ID 的小模型测试。\n\n## 三角计算与对角项\n\n对实对称的结果，只计算一个三角区域后镜像写回，可以减少重复工作。但对角元素不应因为“写两边”而累加两次。遍历和写回规则需要明确到这一层。\n\n同一个全局 AO pair 可能接收多个 bin 的积分贡献。因此 scatter 常需要累加，而不是覆盖；并发写回又可能涉及原子操作或其他归约方案。\n\n## 对称化不是修复所有错误的方法\n\n把 `V` 替换为 `(V + Vᵀ)/2` 可以压低纯舍入造成的不对称，但如果某个梯度项漏掉、τ 因子错了，平均操作不会恢复正确值。\n\n应分别检查对称残差与相对参考矩阵的差。前者小，说明结构相容；后者小，才说明值也接近。二者不应该互相替代。\n\n## 怎样设计小规模回归\n\n让两个 bin 共享部分 AO pair，使用已知权重和人为设定的 AO 数据，检查贡献是否累积。再单独改变某个梯度方向或只开启 τ 项，确认写回保持每项的系数。\n\n还应测试单 AO、空 bin、非零非对角密度和负权重。对并行结果，容差需要考虑求和次序变化；同时保留最大差所在元素，便于判断是局部写错还是全局舍入。\n\n这次实现经验后来也适用于 cuBLAS 和 grouped GEMM：局部矩阵计算越快，越需要一个清楚、可靠的局部到全局写回协议，否则加速的只是错误数据的搬运。\n\n## 资料与记录\n\n- [PySCF：数值积分源码与密度量约定](https://pyscf.org/_modules/pyscf/dft/numint.html)\n- [GANSU 上游项目](https://github.com/Yasuaki-Ito/GANSU)"
        },
        {
            "slug": "GANSU-21-Octree-Binning",
            "title": "Octree 分箱落地：格点划分与 active AO 列表",
            "date": "2026-06-12",
            "category": "GPU 计算优化",
            "period": "2026-06",
            "written": "2026-10-27",
            "series": "GANSU",
            "seriesOrder": 21,
            "summary": "根据 Octree 实装记录，梳理递归划分、停止条件、空 bin 与全局格点映射，说明分箱元数据为何影响数值正确性。",
            "tags": [
                "GANSU",
                "Octree",
                "bin",
                "索引映射"
            ],
            "coverImage": "",
            "markdown": "6 月 12 日的组会记录了 Octree 部分的实现。这里值得展开的不是“树分了八叉”这一句话，而是分箱结果怎样进入后续计算，以及哪些边界会让一份正确的数学公式读到错误的数据。\n\n## 递归划分的基本过程\n\n对当前空间范围，按中心把点分给八个子区域。若点数已经足够少，或满足其他停止条件，就保留为叶 bin；否则继续处理非空子区域。\n\n容量阈值影响局部工作单元大小。过大的 bin 可能包含更多 AO，过小的 bin 又会增加元数据、启动和 pack 开销。因此树的几何性质与后续矩阵计算成本需要一起考虑。\n\n## 退化输入需要明确规则\n\n重复坐标、非常集中的点或零宽度范围，可能使重复细分无法有效减少点数。实现应有可终止的规则，测试也要覆盖这些输入，而不是只处理几何上分布漂亮的分子网格。\n\n空子节点不应产生需要后续解引用的伪 AO 数据；空 active AO 列表对应零贡献，但仍要保持上层计数与映射一致。\n\n## 每个点必须能找回自己的身份\n\nbin 可以保存重排后的点，也可以保存全局 point ID。无论选择哪一种，坐标、权重、AO、梯度以及密度量必须对应同一个映射。\n\n对单纯分箱阶段，常见的检查是格点覆盖没有遗漏和重复。若筛选阶段允许删除点或 AO，应把删除行为放在独立的统计和验证中，不能让两个阶段的影响互相掩盖。\n\n## 固定列表与更新量\n\n固定几何、基组和网格下，空间划分与不少 AO 元数据可以复用；密度矩阵在 SCF 中会变化。以后做 cache 时，需要知道哪些条件变化会使树、AO 列表或 pack 失效。\n\n例如密度 pruning 改变实际格点集合后，旧 bin point ID 不一定还能用于新的压缩 AO 数组。这个问题在更晚的 grouped_v 工作中再次出现，说明早期元数据约定会影响后续优化的安全性。\n\nOctree 完成后，程序有了一条局部化的计算路线，但分箱效率还需放到完整 XC 链条里判断。树构建本身更快，不表示最终 SCF 必然更快。\n\n## 资料与记录\n\n- [GANSU 上游项目](https://github.com/Yasuaki-Ito/GANSU)\n- [PySCF：数值积分源码与密度量约定](https://pyscf.org/_modules/pyscf/dft/numint.html)"
        },
        {
            "slug": "GANSU-20-Octree-and-Active-AO",
            "title": "用 Octree 与 active AO 缩小 meta-GGA 的计算范围",
            "date": "2026-05-26",
            "category": "GPU 计算优化",
            "period": "2026-05",
            "written": "2026-10-27",
            "series": "GANSU",
            "seriesOrder": 20,
            "summary": "解释 Octree 与 active AO 怎样减少局部收缩工作，区分空间重排、阈值筛选和真正改变积分网格。",
            "tags": [
                "GANSU",
                "Octree",
                "AO 筛选",
                "meta-GGA"
            ],
            "coverImage": "",
            "markdown": "5 月 26 日的记录开始把既有 Octree 思路适配到 meta-GGA。设计的关键，是利用基函数在空间中的局域性，让每个格点簇只处理确有贡献的 AO，而不是对所有 AO 对做同样工作。\n\n## bin 提供一种局部工作范围\n\n先把格点组织成若干空间 bin，再为每个 bin 建立 active AO 列表。局部列表同时服务于密度量计算与势矩阵组装，因此可以减少重复判断和无意义的收缩。\n\n这项工作复用了项目已有的空间划分方法。文章关注的是怎样将其接到包含 τ 的 meta-GGA 路径，而不是把 Octree 本身视作新的算法发明。\n\n## AO 筛选是数值近似\n\nGaussian 基函数的贡献随空间位置衰减，但大多数位置并非严格为零。根据阈值省略 AO 或 AO pair，需要检查对电子数、能量、导数和矩阵的影响。\n\n因此，“active”取决于筛选规则。不能把阈值筛选描述成完全无误差的删除，也不能因为最终能量接近，就忽略力或更严格性质尚未验证的事实。\n\n## meta-GGA 比 GGA 多出的条件\n\n对 GGA 适用的列表，还需要确认是否覆盖 AO 梯度及 τ 相关收缩。只凭 AO 值小就判断所有导数贡献都可忽略，可能丢掉需要的部分。\n\n此外，ρ/σ/τ 与 Vxc 应使用相容的局部索引和数据布局。前者用一套 active AO，后者读另一套缓存，即便每层单独可运行，组合起来也可能不一致。\n\n## 空间划分和网格删减分开看\n\nOctree 本身可以只改变格点的分组和访问顺序，而不减少积分点。后续的 AO 筛选改变的是局部工作量；密度 pruning 或 AIXC 代表点又属于另外的机制。\n\n把这些层次分开，才知道加速来自更好的局域性、更少 AO 对，还是更少积分点。日志也应分别记录格点数、bin 数、active AO 数和实际收缩量，避免用一个“筛选率”解释所有收益。\n\n这篇设计记录的后续，是将 bin 元数据、AO 列表和对称写回真正接到计算中，并以未筛选或已有路径作参考验证。\n\n## 资料与记录\n\n- [PySCF：数值积分源码与密度量约定](https://pyscf.org/_modules/pyscf/dft/numint.html)\n- [GANSU 上游项目](https://github.com/Yasuaki-Ito/GANSU)"
        },
        {
            "slug": "GANSU-19-First-PySCF-Benchmark",
            "title": "GANSU 与 PySCF 的首轮性能对照",
            "date": "2026-05-12",
            "category": "性能实验",
            "period": "2026-05",
            "written": "2026-10-27",
            "series": "GANSU",
            "seriesOrder": 19,
            "summary": "整理首轮 GANSU/PySCF 性能对照需要的条件与计时边界，解释正确性验证和性能比较为何应分开。",
            "tags": [
                "GANSU",
                "性能实验",
                "PySCF",
                "计时"
            ],
            "coverImage": "",
            "markdown": "5 月 12 日的组会进入与 PySCF 的性能对照，并把 Vxc 构筑列为后续优化目标。回看这一步，最值得补全的是测量的边界，而不是把一张早期表格里的加速比无限推广。\n\n## 先回答两个不同问题\n\n数值对照问的是：相同方法和输入条件下，结果是否一致。性能对照问的是：完成规定工作需要多久。前者不能用更松的阈值取得，后者也不能只挑对自己有利的计时片段。\n\n比较时要固定基组、角动量表示、网格、泛函、自旋、电荷和几何，并明确 SCF 是否收敛到可比较的状态。否则能量差和时间差都可能来自实际工作已经不同。\n\n## CPU 与 GPU 的比较应写清楚\n\nGANSU 的 GPU 路径与 CPU PySCF 的比较，可以回答特定硬件组合上的实际收益，但不等于与 GPU4PySCF 的同类加速库比较。CPU 型号、线程数、GPU 型号、软件版本及是否存在竞争负载，都属于结果的一部分。\n\n不能把两者笼统写成“GANSU 比 PySCF 快”。更准确的表述应带上方法、硬件和测试范围。某个小分子的优势，也不能直接外推到大分子或另一种基组。\n\n## 初始准备与迭代调用\n\n固定几何下，一部分 AO、积分和布局可以预计算或缓存。第一次调用可能包含分配与 pack，后面调用则复用数据。单独排除预热能够研究稳定态成本，但要在报告中说明。\n\n如果讨论完成一次单点计算需要多久，初始化、J、SCF 迭代次数和最后输出也应计入。单次 Vxc、单次完整 XC 和全进程墙钟时间的单位虽然都可以是毫秒，却代表不同工作。\n\n## 让阶段日志决定下一步\n\n把时间分到 J、ρ/σ/τ、局部 XC、Vxc 组装等部分，能判断优化哪一层更有可能产生实际收益。单次总时间只显示“慢”，阶段日志才能解释为什么慢。\n\n本篇不根据原 PPT 的截断数值重建新的精确倍率，也没有重跑历史实验。它保留的是性能工作开始时形成的做法：先建立同条件、可解释的基线，再把候选优化放进这条基线逐项比较。\n\n## 资料与记录\n\n- [PySCF：SCF 方法与收敛](https://pyscf.org/user/scf.html)\n- [PySCF：DFT 与数值积分](https://pyscf.org/user/dft.html)"
        },
        {
            "slug": "GANSU-18-Error-Isolation",
            "title": "一份误差排查清单：网格、初猜、阈值和 Vxc",
            "date": "2026-04-28",
            "category": "meta-GGA 实现",
            "period": "2026-04",
            "written": "2026-10-27",
            "series": "GANSU",
            "seriesOrder": 18,
            "summary": "以 4 月误差诊断为主线，并注明后续复盘，说明如何逐项排除网格、初猜、收敛和组装层面的差异。",
            "tags": [
                "GANSU",
                "误差分析",
                "网格",
                "复现"
            ],
            "coverImage": "",
            "markdown": "这篇以 4 月的 SCAN 诊断为起点，加入截至 10 月的排查经验。它是一次跨阶段复盘，不表示后文所有检查都已在 4 月完成。\n\n## 先定义正在解释的差\n\n总能差可能包含不同几何、基组、泛函、网格、SCF 解和数值实现的影响。在讨论“误差来源”之前，应建立一张条件表，把这些差异明确地列出来。\n\n每次实验只改变一个关键因素，并保留对应版本与命令。把不同阶段的最好结果拼到一张表里，会让本来可以解释的差异失去上下文。\n\n## 初猜与收敛阈值如何排查\n\n同一方法和输入，换 core 或 SAD 初猜可能改变求解路径，也可能落到不同解。应检查最终电子数、密度及残差，而不只比较最后一行能量。\n\n收紧阈值后，如果残差稳定在同一量级，说明“阈值太松”不足以解释全部问题；但这也不自动证明剩余差异来自某一个指定模块。排除假设是一种进展，不是另一种假设已经得到证明。\n\n## 格点数一致还不够\n\n网格比较至少包括坐标、权重、原子分区和裁剪规则。两边即便有相同格点数，也可能在位置、权重或顺序上不同。对积分而言，权重和函数值必须逐点配对。\n\n后续项目加入了内部网格导出及比较脚本，就是为了把这些实际数组摆到一起。完整网格、裁剪后网格和代表点网格也必须分开，不然一个“相同 grid level”很容易掩盖实际工作量差异。\n\n## 固定密度、固定输入逐层核对\n\n可用的检查顺序是：AO 约定与归一化，ρ/σ/τ，局部能量与偏导，Vxc，Fock，最后是 SCF。某一层通过后，应尽量固定它，避免下一轮修改又引入额外变量。\n\n历史聊天中出现过苯约 1.93×10⁻⁵ Ha 的稳定差值，那是特定版本和条件下的诊断记录。4 月材料也记录了其他差值及修复阶段；它们不能被解释成同一份程序在同一天的自相矛盾结果。\n\n## 这份清单的用途\n\n它帮助决定下一次实验该回答什么问题。若要验证原生网格，就比较实际坐标与权重；若要验证组装，就固定密度和局部导数。不要让一次实验同时承担证明所有层正确的任务，也不要把尚在排查的假设写成最终归因。\n\n## 资料与记录\n\n- [PySCF：SCF 方法与收敛](https://pyscf.org/user/scf.html)\n- [PySCF：数值积分源码与密度量约定](https://pyscf.org/_modules/pyscf/dft/numint.html)"
        },
        {
            "slug": "GANSU-17-Pointwise-Libxc-Diagnostics",
            "title": "逐点对照 PySCF/Libxc：把总能差拆到交换与相关",
            "date": "2026-04-28",
            "category": "meta-GGA 实现",
            "period": "2026-04",
            "written": "2026-10-27",
            "series": "GANSU",
            "seriesOrder": 17,
            "summary": "介绍固定相同格点密度量逐点核对 SCAN 的方法，区分每电子与每体积能量密度，并定位交换、相关与积分差异。",
            "tags": [
                "GANSU",
                "PySCF",
                "Libxc",
                "逐点诊断"
            ],
            "coverImage": "",
            "markdown": "4 月 28 日的组会开始展示逐点输入导出，以及同一输入下的 PySCF/Libxc 对照。相比只比较一个分子总能量，这一步使误差能够落到具体格点和具体组成部分。\n\n## 把自洽过程暂时拿开\n\n先固定 P、格点坐标、权重和 AO 数据，导出 ρ、σ、τ，再让两套求值器处理同一批输入。这样，初猜和不同 SCF 轨迹便不会继续混进局部泛函比较。\n\n诊断文件还应记录自旋约定、单位和输入排列。对于参考接口，密度梯度向量与 σ 并不是可随意互换的数组，是否提供 Laplacian 也会改变布局。\n\n## εxc 与 e 的区别\n\n若库返回每电子能量 εxc，则积分应使用 `e = ρ εxc`。若另一实现直接返回每体积 e，逐点比较前必须统一。\n\n同样，库提供的 vρ 通常对应其接口约定下能量密度的导数，不能把 εxc 对 ρ 的裸偏导直接当作完整 vρ。能量看起来只差一个密度因子，导数链却还包含乘积规则。\n\n## 先拆交换，再看相关\n\n当局部总 XC 不一致时，可以分别记录交换、相关及两者之和，查看最大偏差、加权偏差和误差最集中的输入区域。4 月的材料指出过交换部分的显著贡献，这支持当时优先检查该层，但不是对所有版本的永久结论。\n\n一个局部差值很大的点，可能因权重很小而几乎不影响积分；许多微小但同号的偏差，也可能累积成可见总能差。因此，应同时看逐点误差和 `Σg wg Δeg`。\n\n## 从局部求值走向矩阵验证\n\n若固定输入的能量和导数已经一致，下一步应把相同输出送到矩阵组装，比较 Vxc 的范数与元素。若此时才出现偏差，检查梯度收缩、τ 系数、权重和全局 AO 映射会比继续修改 SCAN 表达式有效。\n\n相关诊断脚本在项目中分别承担输入导出与结果比较。它们构成一种工作方法：让每次修改对应一个可复现的差异，而不是不断换参数等待最终能量偶然接近参考。\n\n## 资料与记录\n\n- [PySCF：数值积分源码与密度量约定](https://pyscf.org/_modules/pyscf/dft/numint.html)\n- [Sun、Ruzsinszky、Perdew：SCAN 原始论文](https://arxiv.org/abs/1504.03028)"
        },
        {
            "slug": "GANSU-16-Alpha-Boundary-Derivatives",
            "title": "α=0 附近的差分陷阱与 SCAN 导数修复",
            "date": "2026-04-14",
            "category": "meta-GGA 实现",
            "period": "2026-04",
            "written": "2026-10-27",
            "series": "GANSU",
            "seriesOrder": 16,
            "summary": "解释 α 的边界裁剪如何影响有限差分，区分物理输入域、非光滑实现和局部导数的验证。",
            "tags": [
                "GANSU",
                "SCAN",
                "α",
                "有限差分"
            ],
            "coverImage": "",
            "markdown": "4 月 14 日的记录把一部分误差归因到 α 附近的处理。理解这次问题，需要同时看数学定义和代码实际计算的函数。\n\n## α 连接了哪些密度量\n\n对无自旋极化、本文采用的正动能密度约定，常见定义为：\n\n```text\nτW = σ / (8ρ)\nτunif = (3/10)(3π²)^(2/3) ρ^(5/3)\nα = (τ - τW) / τunif\n```\n\n这些表达只在相应输入域及约定下讨论。接近极限时，小量之差和小分母会放大误差；实现还可能为处理舍入产生的负值，引入截断或其他保护。\n\n## 差分求的是哪一个函数\n\n假设代码先做 `α ← max(α, 0)`，再把它送入某个表达式。普通中心差分若跨过边界，两侧实际走的分支不同。得到的导数属于“带裁剪的组合函数”，并不能自动解释为光滑物理表达式在域内的导数。\n\n问题也不只发生在显式 α 导数上。计算 vρ、vσ 或 vτ 时，扰动输入会改变 α，因此有限差分可能间接跨过同一边界。\n\n## 修改差分策略不能只换一个模板\n\n当时的修复讨论涉及按区域处理及单侧差分。选择中心、前向或更高阶模板，应由可用输入域、边界连续性及误差测试决定。更高阶差分并不总比简单差分稳定，尤其在相消或输入已接近机器精度时。\n\n应针对固定的物理输入扫描差分步长，比较能量与导数的稳定区间，并检查势矩阵方向导数。只看一个分子最终能量变好了，不能证明所有边界问题都已经解决。\n\n## 与后来 r²SCAN 的联系\n\n这次经历让“数值可实现性”成为选泛函时的重要考虑。后来研究 r²SCAN，正涉及正则化与约束保持之间的关系。但它属于更晚的阶段，不应该倒写为 4 月已经采用的新方法。\n\n本次补记保留的是一个具体教训：写进代码的保护和分段，也属于被求导的计算图。检查导数时，不能只盯论文中的一行解析式而忽略实现分支。\n\n## 资料与记录\n\n- [Sun、Ruzsinszky、Perdew：SCAN 原始论文](https://arxiv.org/abs/1504.03028)\n- [Furness 等：r²SCAN 原始论文](https://arxiv.org/html/2008.03374v2)"
        },
        {
            "slug": "GANSU-15-SCAN-in-GANSU",
            "title": "SCAN 接入 GANSU：从密度量到 Fock 再到 SCF",
            "date": "2026-03-31",
            "category": "meta-GGA 实现",
            "period": "2026-03",
            "written": "2026-10-27",
            "series": "GANSU",
            "seriesOrder": 15,
            "summary": "复盘 SCAN 在 GANSU 中接通密度量、XC 导数、势矩阵与 SCF 的过程，明确功能接线与数值校准的区别。",
            "tags": [
                "GANSU",
                "SCAN",
                "RKS",
                "Fock"
            ],
            "coverImage": "",
            "markdown": "3 月 31 日的材料已经展示完整 SCAN 数据路径，但实验仍有明显误差。这是一个需要保留的中间状态：工作流接通说明功能结构成立，数值校准则是接下来必须完成的另一件事。\n\n## 接入位置不是孤立的泛函函数\n\n整体链条可以写为：\n\n```text\nAO/gradient + P\n    → ρ / σ / τ\n    → SCAN 能量与局部导数\n    → Vρ + Vσ + Vτ\n    → F = H + J + Vxc\n    → 轨道与密度更新\n```\n\n这里复用了 GANSU 以及已有 DFT/RKS 路径的基础。新增工作的重点在 meta-GGA 需要的 τ、导数与组装适配，不应把项目原有的 HF、积分和 SCF 全部列为个人从零开发。\n\n## 先让能量分项可观察\n\n半局域 RKS 的总能量可以按 H、J、XC 和核间排斥分开核对。J 的能量需要相应的双计数系数，XC 能量则由密度量积分获得。\n\n不能把 Fock 中每个势项与 P 相乘后直接相加，就当作总能量。势矩阵是能量对密度矩阵的导数，和能量本身有不同关系；对 τ 相关项尤其容易在这里重复计数。\n\n## 保持已有路径的边界\n\n移植说明强调不要破坏既有 RHF 主链路，同时为 RKS 接入参数、日志和后端选择。这样的边界使回归更可控：HF 出现变化时，可以先检查共享接口是否被意外改动。\n\n同样，某个参数能够解析不代表所有组合都受支持。直接/存储 Vxc、不同 J 后端和不同泛函，需要分别确认实际执行的数学路径，不能从名称推断行为。\n\n## 怎样理解当时尚存的误差\n\n组会表格说明能量和参考仍未充分一致。这时最有帮助的工作不是先讨论加速，而是确认输入是否匹配、分项能量哪里开始偏离、固定密度的 Vxc 是否正确。\n\n后续 α 边界、逐点交换对照和网格诊断，都是在这条已经接通的链上进行的。如果把这些阶段压成一句“SCAN 已完成”，就会失去研究过程里最有技术含量的部分：如何把一个能运行的功能变成可解释、可验证的实现。\n\n## 资料与记录\n\n- [GANSU 上游项目](https://github.com/Yasuaki-Ito/GANSU)\n- [PySCF：DFT 与数值积分](https://pyscf.org/user/dft.html)\n- [Sun、Ruzsinszky、Perdew：SCAN 原始论文](https://arxiv.org/abs/1504.03028)"
        },
        {
            "slug": "GANSU-14-Tau-Interface-Tests",
            "title": "把 ao_grad→τ 接入 GANSU：接口与小模型测试",
            "date": "2026-03-17",
            "category": "meta-GGA 实现",
            "period": "2026-03",
            "written": "2026-10-27",
            "series": "GANSU",
            "seriesOrder": 14,
            "summary": "依据 3 月 τ 接线记录，展开 kernel 与包装层分工、零输入测试及可手算模型，建立可复用的验证接口。",
            "tags": [
                "GANSU",
                "τ",
                "CUDA 测试",
                "接口设计"
            ],
            "coverImage": "",
            "markdown": "3 月 17 日的组会把进展具体到一条数据链：ao_grad→τ 已经接入，并进行了小模型及 CPU/GPU 检查。相比“支持 meta-GGA”这样宽泛的描述，这种可独立验证的接口更便于说明究竟完成了什么。\n\n## 接口应明确哪些输入\n\nτ 的计算至少依赖 AO 梯度、密度矩阵、格点数和 AO 数。还要明确梯度分量顺序、矩阵布局以及 P 是否已包含自旋占据。\n\n接口边界应检查空输入、维度不一致和必要指针；格点数为零时采取怎样的行为，也需要固定。它们看似不是物理问题，却决定调用方能否安全地复用内核。\n\n## 内核之外的职责\n\n内层函数只做收缩。外层函数负责参数检查、grid/block 配置、stream 选择和错误处理。调试中可以在这一层同步，以确定是哪一次计算失败；正式计时则要明确是否包含这些同步。\n\n如果内核里同时悄悄分配缓存、改变索引或选择另一条计算路径，CPU 参照和 GPU 实现便很难共享同一套测试条件。保持职责单一，有助于后续定位回归。\n\n## 从最小可手算模型开始\n\n令某点只有一个 AO，其梯度为向量 a，密度元素为 p，则：\n\n```text\nτ = 1/2 p (ax² + ay² + az²)\n```\n\n把 P 置零，应得到零输出；分别只打开 x、y、z 方向，可以检查分量顺序。再加入两个 AO 和非零非对角密度，验证交叉项没有丢失或重复。\n\n这些模型不依赖某个分子的参考总能量，因而能直接检验实现的数学含义。只用对角 P 测试，会漏掉不少索引与对称性错误。\n\n## CPU/GPU 一致之后还差什么\n\n一致性检验需要容差、输入范围和误差量的定义。并行求和顺序可能不同，不宜要求所有复杂输入都逐位相同；也不能因为结果“差不多”就不给阈值。\n\n更重要的是，这一阶段验证的是 τ 收缩，不是完整 SCAN、核力或结构优化。后续还需要证明 vτ 正确进入 Vxc，Vxc 正确进入 Fock，最终 SCF 与相同条件的参考相容。小接口测试正是这条验证链的第一环。\n\n## 资料与记录\n\n- [PySCF：数值积分源码与密度量约定](https://pyscf.org/_modules/pyscf/dft/numint.html)\n- [GANSU 上游项目](https://github.com/Yasuaki-Ito/GANSU)"
        },
        {
            "slug": "GANSU-13-Low-Density-Stability",
            "title": "低密度尾部的数值不稳定：NaN、Inf 与保护策略",
            "date": "2026-03-03",
            "category": "meta-GGA 实现",
            "period": "2026-03",
            "written": "2026-10-27",
            "series": "GANSU",
            "seriesOrder": 13,
            "summary": "从低密度尾部的除法与指数运算解释 SCAN 数值异常，讨论保护策略怎样避免改变方法而不自知。",
            "tags": [
                "GANSU",
                "数值稳定性",
                "低密度",
                "SCAN"
            ],
            "coverImage": "",
            "markdown": "3 月初的组会记录了此前异常的一个来源：低密度尾部的组合量和导数计算。这个问题值得单独留下，因为它说明双精度并不能自动防止数值不稳定。\n\n## 小密度不等于所有比值都小\n\n格点远离分子时，ρ 与梯度、动能密度都可能很小，但它们趋近于零的速度不同。一个分子含有较小的值，并不意味着由这些值构成的比值也小。\n\n例如 τW 含有 σ/ρ，而某些无量纲参数还含更高次的密度幂。计算这些组合时，舍入、相消和除法可能放大输入误差。随后再经过指数或分段插值，异常便可能进入局部导数和 Vxc。\n\n## “没有 NaN”只是第一步\n\n当时的处理涉及小密度判断、分段逻辑、指数输入保护，以及检查非有限数。这些措施可以让错误更早暴露，或避免在数值上没有意义的区域继续运算。\n\n但有限值也可能是错误值。若为了让程序收敛而直接截断一个巨大的导数，必须分析截断对能量及势的影响，不能把运行稳定当成理论一致性的证明。\n\n## 应怎样检查保护策略\n\n先保存发生异常的点及其 ρ、σ、τ、权重和局部输出，使用同样输入与参考求值器比较。再改变密度阈值或保护尺度，看误差是否随之有规律地变化。\n\n能量与导数也要一起检查：只给能量加分段保护、却仍按未保护的表达式求导，会使两者不相容。用于数值安全的条件还应尽量与实际物理输入域、参考实现和方法定义一致。\n\n## 从单点问题回到 SCF\n\n一个权重很小的格点，也可能因导数异常而对矩阵产生过大贡献。最终症状可能是密度振荡、收敛缓慢或总能差，而不是直接报错。因此，只在最终能量处检查 NaN 往往太晚。\n\n应把检查放到密度量、局部泛函和组装输出几个边界，保留能定位来源的信息。诊断日志不必始终开启，但在复现问题时要能确定异常由哪一步产生。\n\n这次排错建立了一条后续持续使用的规则：稳定化措施需要有明确适用范围，并通过固定输入的能量、导数和矩阵对照来验证。不能把所有低密度问题都归结为“把 cutoff 再调大一点”。\n\n## 资料与记录\n\n- [Sun、Ruzsinszky、Perdew：SCAN 原始论文](https://arxiv.org/abs/1504.03028)\n- [PySCF：数值积分源码与密度量约定](https://pyscf.org/_modules/pyscf/dft/numint.html)"
        },
        {
            "slug": "GANSU-12-Small-Molecule-Validation",
            "title": "第一轮小分子验证：能量接近之外还要检查什么",
            "date": "2026-02-24",
            "category": "meta-GGA 实现",
            "period": "2026-02",
            "written": "2026-10-27",
            "series": "GANSU",
            "seriesOrder": 12,
            "summary": "复盘首轮 CUDA 小分子对照和水分子密度振荡，建立从运行成功到可信数值结果的验证层次。",
            "tags": [
                "GANSU",
                "数值验证",
                "SCF",
                "小分子"
            ],
            "coverImage": "",
            "markdown": "2 月 24 日的材料展示了 H₂、H₂O、苯等体系的 CUDA 与参考能量，同时明确保留了水分子密度振荡这一问题。这样的记录比只留一张成功结果表更能说明当时的实际进度。\n\n## 为什么从小分子开始\n\n小体系便于检查电子数、矩阵形状和中间值，重复实验的成本也低。H₂ 与水可以覆盖非常不同的几何和 AO 组合，苯则让较大的轨道空间及更多格点参与计算。\n\n不过，有限几个小分子接近参考，并不能证明所有角动量、基组、低密度区域和收敛路径都正确。它们是回归集合的起点，不是完整精度保证。\n\n## 并排比较前先核对条件\n\n相同分子名不代表输入相同。核坐标单位、基组、Cartesian 或 spherical 表示、积分网格、泛函版本、初猜以及阈值，都可能改变结果。\n\n早期 PPT 中参考值的显示精度有限，因此本篇不根据截断的表格重新推导一个更严格的误差上限。若要发布高精度比较，需要找回完整输出，并给出相同条件的原始数值。\n\n## 密度振荡意味着什么\n\n能量有时看起来变化不大，密度却在两个或多个状态之间反复跳动。原因可能是求解路径不稳定，也可能是 Vxc 的低密度或导数处理有问题；不能只凭振荡就认定 DIIS 或 damping 参数选错。\n\n比较固定密度下的 XC 输出，可以把“算符计算错误”和“迭代过程不稳定”分开。若固定输入已经产生异常，先修数值路径；若该层一致，再研究初猜、混合和收敛控制。\n\n## 一个逐层加严的检查顺序\n\n- 运行层：是否存在越界、未初始化数据或非有限数。\n- 密度层：电子数、对称性及 ρ/σ/τ 是否一致。\n- 能量与导数层：积分、Vxc 和有限差分是否相容。\n- 自洽层：是否达到明确阈值，以及是否收敛到相同解。\n\n这几个层次可以帮助解释一个常见现象：代码已经能够给出“像样的”总能量，但还不能稳定支持后续优化。先完成正确性基线，之后减少格点工作或替换矩阵内核，才有可信的比较对象。\n\n## 资料与记录\n\n- [PySCF：SCF 方法与收敛](https://pyscf.org/user/scf.html)\n- [PySCF：DFT 与数值积分](https://pyscf.org/user/dft.html)"
        },
        {
            "slug": "GANSU-11-CUDA-XC-and-Vxc",
            "title": "CUDA 版 meta-GGA：交换相关求值与 Vxc 组装",
            "date": "2026-02-04",
            "category": "meta-GGA 实现",
            "period": "2026-02",
            "written": "2026-10-27",
            "series": "GANSU",
            "seriesOrder": 11,
            "summary": "说明 CUDA meta-GGA 的密度量、局部泛函导数与 Vxc 组装三层职责，以及怎样处理梯度和 τ 的贡献。",
            "tags": [
                "GANSU",
                "CUDA",
                "SCAN",
                "Vxc"
            ],
            "coverImage": "",
            "markdown": "2 月初的组会仍在讨论 CUDA 代码中的问题，到 2 月下旬才进入相对完整的实现与结果对照。把过程拆开看，最容易出错的并不是某一个核函数名称，而是三层接口之间的约定。\n\n## 三层计算各自输出什么\n\n第一层把密度矩阵投到实空间，形成 ρ、σ、τ。第二层以这些量求 XC 能量密度及偏导。第三层把偏导通过 AO 与 AO 梯度收缩成 Vxc。\n\n三层共享格点顺序和积分权重。任何一层压缩或重排格点，都必须同步其余层的映射；只保证每个数组长度相同，不能保证它们还对应同一批点。\n\n## 势矩阵来自能量对密度矩阵的导数\n\n在本文的实对称、自旋求和密度约定下，可以把三个贡献记为：\n\n```text\nVρ:  Σg wg vρ,g φμ,g φν,g\nVσ:  2 Σg wg vσ,g ∇ρg ·\n      (∇φμ,g φν,g + φμ,g ∇φν,g)\nVτ:  1/2 Σg wg vτ,g ∇φμ,g·∇φν,g\n```\n\n这里将 `vρ、vσ、vτ` 定义为每体积能量密度的偏导。若接口从每电子 εxc 开始，必须包含相应的 ρ 因子及乘积求导，不能直接套上变量名。\n\n## 对称性能够减少工作，也会掩盖问题\n\n对于实输入，Vxc 应具有对应的对称性。只计算 AO pair 的一半可以节省重复工作，但镜像写回、对角元素和全局累加必须遵循统一规则。\n\n不能把“最终强制对称化”当成公式正确的证明。两边同时少一项、或错误系数导致的矩阵，本来就可能对称。应同时比较 CPU 参照、能量有限差分与矩阵元素。\n\n## 让测试覆盖完整链条\n\n一种有效的拆分是：先用仅含 τ 的人工能量函数检查 Vτ，再加入 GGA 梯度项，最后测试完整 meta-GGA。这样在某一方向导数出错时，可以明确对应到 x、y、z 哪个收缩。\n\n当时的 CUDA 代码是后续集成的基础，但尚不等于完整生产路径已经通过所有检验。由“能够计算”走向“能量、导数和自洽行为相互一致”，还需要下一阶段的小分子验证。\n\n## 资料与记录\n\n- [PySCF：数值积分源码与密度量约定](https://pyscf.org/_modules/pyscf/dft/numint.html)\n- [Sun、Ruzsinszky、Perdew：SCAN 原始论文](https://arxiv.org/abs/1504.03028)"
        },
        {
            "slug": "GANSU-10-First-CUDA-Port",
            "title": "meta-GGA 的第一次 CUDA 移植尝试",
            "date": "2026-01-21",
            "category": "meta-GGA 实现",
            "period": "2026-01",
            "written": "2026-10-27",
            "series": "GANSU",
            "seriesOrder": 10,
            "summary": "记录 meta-GGA 从 CPU 原型走向 CUDA 的第一阶段，重点是数据边界、内核职责与可逐层对照的实现。",
            "tags": [
                "GANSU",
                "CUDA",
                "移植",
                "meta-GGA"
            ],
            "coverImage": "",
            "markdown": "2026 年 1 月 21 日的组会明确写到 CPU→GPU 移植仍只完成了部分函数。补记时保留这个状态很重要：它与后来整条 GANSU SCAN 路径可用，是两个不同阶段。\n\n## 先确定移植的计算边界\n\n第一步适合选择输入输出清楚的密度量计算：输入 P、AO 值和梯度，输出格点上的 ρ、σ、τ。它在固定密度下可以独立运行，不必每次调试都承担完整 SCF 的不确定性。\n\n若把积分引擎、网格、泛函公式和矩阵组装同时重写，即使最终能量出错，也很难判断问题落在哪一部分。增量移植的意义，就是一次只替换一个可验证的计算层。\n\n## 每个线程负责什么\n\n初版实现可以让线程按格点划分工作，在每个格点上完成 AO 对收缩。这种映射直观，但并不意味着最终性能最优。它可能重复读取 P，也可能在 AO 较多时让单线程工作过重。\n\n这个阶段更需要明确 AO/梯度的布局、格点与 AO 的索引次序，以及输出是否覆盖了所有有效点。尾部线程和空输入的处理，应从第一次内核开始就有规则。\n\n## 计算内核与包装层分工\n\n内核负责数值收缩，包装层负责尺寸检查、分配、启动参数、stream 和错误报告。二者分开以后，CPU 参照、GPU 调用和后续基准脚本都能复用清晰的接口。\n\nCUDA 工作异步执行。只检查 kernel launch 成功，并不能证明计算已经完成且没有非法访问；调试中的同步与错误检查，应放在能定位具体阶段的位置。性能计时又要避免把额外调试同步混入正式结果。\n\n## 为什么先不用最终 SCF 结果评判\n\n当时的目标是使部分密度量路径在 GPU 上成立。固定输入的 CPU/GPU 一致性、电子数以及简单边界条件，比一个完整分子的最终能量更能说明这一目标是否达到。\n\n后续再把这些函数接到泛函求值和 Vxc 组装，才形成能够自洽迭代的路线。因此这篇记录的重点是一次可解释的移植过程，而不是用后来的优化结果替早期代码补上并不存在的性能结论。\n\n## 资料与记录\n\n- [PySCF：数值积分源码与密度量约定](https://pyscf.org/_modules/pyscf/dft/numint.html)\n- [GANSU 上游项目](https://github.com/Yasuaki-Ito/GANSU)"
        },
        {
            "slug": "GANSU-09-Python-MGGA-Prototype",
            "title": "Python 原型里的 ρ、σ、τ 与势矩阵核对",
            "date": "2026-01-07",
            "category": "meta-GGA 实现",
            "period": "2026-01",
            "written": "2026-10-27",
            "series": "GANSU",
            "seriesOrder": 9,
            "summary": "整理 Python meta-GGA 原型的密度量、能量积分和势矩阵检查，避免把不同泛函的能量差误作程序误差。",
            "tags": [
                "GANSU",
                "Python",
                "meta-GGA",
                "数值验证"
            ],
            "coverImage": "",
            "markdown": "1 月的材料保留了 Python 原型及与参考程序的对照。相比直接读最终总能量，更有用的学习方式是固定同一组输入，把每个中间量逐层展开。\n\n## 从 AO 与梯度准备输入\n\n一个格点 g 上，需要 AO 值、三个方向的一阶导数以及密度矩阵。由它们形成 ρ、∇ρ、σ 与 τ。对实对称 P，密度梯度中的两个对称贡献可以合并为一个带系数 2 的收缩；这个合并依赖对称性，不能在一般复数或非厄米情形中照搬。\n\n原型中适合保留直接循环或明确的张量收缩，作为后续矩阵化版本的参照。最慢但容易检查的实现，往往比一开始就追求最复杂的向量化更适合作为 oracle。\n\n## 固定密度才能定位误差\n\n若两个程序各自跑完 SCF，再发现总能量不同，差异可能来自初猜、网格、阈值、密度收敛或泛函公式。把同一份 P、AO 数据和权重送给两套局部计算，就能收窄问题范围。\n\n对照的顺序可以是：电子数积分、ρ/σ/τ 的逐点差、交换与相关的局部输出、XC 积分，最后才是 Vxc 和最终 SCF。每一层都应记录最大差及所在点，尤其关注低密度和小梯度区域。\n\n## 能量与矩阵是两种检验\n\n对于同一局部泛函，能量积分可能已经接近，而导数仍有问题。能量对某个方向的变化，应与相应势矩阵的收缩一致：\n\n```text\ndE(P + ε ΔP)/dε 在 ε=0 处\n    ≈ Tr(Vxc ΔP)\n```\n\n这个有限差分关系要求矩阵对称约定、积分权重和测试扰动一致。它是验证导数链条的方法，不是把最终分子总能量微分一下就能代替所有检查。\n\n## 怎样看待当时的结果\n\n早期组会把若干分子的能量并排展示，说明计算链已经可以比较，但不能据此无限放大有效数字。特别是 GGA 与 meta-GGA 的能量本来就可能不同，不能把相互之间的差当作实现误差。\n\n这份原型后来帮助了 CPU/GPU 对照。保留它的价值在于：当 CUDA 结果异常时，可以把同一个小数组送回可读的 Python 收缩，判断错误发生在数学表达还是内存与并行路径。\n\n## 资料与记录\n\n- [PySCF：数值积分源码与密度量约定](https://pyscf.org/_modules/pyscf/dft/numint.html)\n- [PySCF：DFT 与数值积分](https://pyscf.org/user/dft.html)"
        },
        {
            "slug": "GANSU-08-Why-Tau",
            "title": "meta-GGA 为什么需要动能密度 τ",
            "date": "2026-01-07",
            "category": "meta-GGA 实现",
            "period": "2026-01",
            "written": "2026-10-27",
            "series": "GANSU",
            "seriesOrder": 8,
            "summary": "从动能密度和局部电子环境理解 meta-GGA，给出与自旋求和密度一致的 τ 定义及势矩阵含义。",
            "tags": [
                "GANSU",
                "meta-GGA",
                "τ",
                "SCAN"
            ],
            "coverImage": "",
            "markdown": "2026 年 1 月的组会开始围绕 meta-GGA 展开。对实现而言，最直接的变化是：除了 ρ 与密度梯度，还要计算一个与轨道梯度有关的量 τ，并把相应导数传入矩阵组装。\n\n## 为什么密度与梯度还不够\n\n不同局部电子环境可能具有相近的密度和密度梯度。依赖正动能密度的 meta-GGA，能够利用轨道变化的额外信息来区分这些环境。SCAN 使用的单轨道性指标，就是把动能密度与若干极限量联系起来。\n\n这种描述能力来自泛函设计，不能简化成“加入 τ 后所有结果都更准确”。输入信息增加了，方法近似和数值实现仍然需要分别检验。\n\n## τ 的定义与 1/2\n\n对于实 AO、自旋求和密度矩阵 P，本文沿用的约定是：\n\n```text\nρ(r) = Σμν Pμν φμ(r) φν(r)\nτ(r) = 1/2 Σμν Pμν ∇φμ(r)·∇φν(r)\n```\n\n闭壳层 P 已含双占据因子，不能在 τ 收缩中再重复加入一个 2。反过来，若参考接口使用其他占据或自旋约定，也不能只比较变量名就认定定义一致。\n\nPySCF 的数值积分接口给出了 τ 行的含义；是否包含 Laplacian 又会影响返回数组的行数。检查输入布局时，应直接核对文档与实现，而不是凭数组形状猜。\n\n## 从 τ 到势矩阵\n\n设局部能量密度为 `e(ρ,σ,τ)`，其对 τ 的导数记为 `vτ`。把能量对 P 求导，会得到含 AO 梯度乘积的矩阵项：\n\n```text\nVτ,μν = 1/2 Σg wg vτ,g ∇φμ,g·∇φν,g\n```\n\n这里的能量密度指每体积量，必须与泛函库返回的量相容。总能量应通过相应 XC 积分统一计算，不能把 `Tr(P Vτ)` 无条件再作为额外 XC 能加一次。\n\n## 实现中应怎样拆开验证\n\n先固定 P 和 AO 梯度，单独验证 τ；再验证泛函对各输入的导数；最后核对势矩阵和 SCF。这样可以区分“τ 少了一个系数”与“泛函求导不正确”。\n\n这一阶段的主要进展，是认识到 meta-GGA 不是在 GGA 后面随意追加一个标量。它改变了密度量准备、局部求值和势矩阵组装三处接口，必须把整条链一起考虑。\n\n## 资料与记录\n\n- [Sun、Ruzsinszky、Perdew：SCAN 原始论文](https://arxiv.org/abs/1504.03028)\n- [PySCF：数值积分源码与密度量约定](https://pyscf.org/_modules/pyscf/dft/numint.html)"
        },
        {
            "slug": "GANSU-07-MP2-Double-Hybrids",
            "title": "MP2 与双杂化泛函：B2PLYP、ωB97M(2) 的学习支线",
            "date": "2025-12-17",
            "category": "量子化学基础",
            "period": "2025-12",
            "written": "2026-10-27",
            "series": "GANSU",
            "seriesOrder": 7,
            "summary": "沿着 MP2 和双杂化的学习支线，理解 AO→MO、占据/虚轨道与能量分母，并说明它与当前 meta-GGA 主线的边界。",
            "tags": [
                "GANSU",
                "MP2",
                "双杂化",
                "AO-MO"
            ],
            "coverImage": "",
            "markdown": "12 月第二次组会把讨论推进到 MP2 与双杂化泛函；次年 1 月又涉及 ωB97M(2)。这一支线解释了当时为何开始注意轨道质量、非局域相关，以及更复杂泛函的实现代价。它是学习记录，现有材料不能用来宣称已在 GANSU 完成这些双杂化功能。\n\n## MP2 在 HF 之后补什么\n\nMP2 以给定的参考状态作微扰展开，估计 HF 单行列式未描述的部分关联。典型表达涉及占据轨道 i、j，虚轨道 a、b，以及轨道能量组合 `εi + εj - εa - εb`。\n\n这个分母不是为了避免发散而随意加的保护项。近简并和小能隙可能让普通 MP2 不可靠，不能通过任意截断分母就宣称方法仍然不变。若采用正则化或其他改造，需要说明方法定义。\n\n## AO 积分为什么要变成 MO 积分\n\n分子积分通常先在 AO 基组表示，而 MP2 的占据—虚轨道收缩在 MO 空间表达。两者通过轨道系数变换连接。实现中必须核对积分排列、交换项、自旋适配形式，以及实数或复数约定。\n\n对学习代码，直接四指标变换便于检查；面向大体系时，变换顺序、中间量、内存占用和密度拟合会成为主问题。公式中一行求和，往往对应比原始 SCF 更昂贵的数据处理。\n\n## 双杂化如何组合不同贡献\n\n双杂化通常在近似 DFT 与 HF 交换的组合之外，再混入一定形式的微扰相关。具体泛函的系数、轨道来源、范围分离或自旋分量缩放属于方法定义，不宜套用一条通用公式就认为实现完成。\n\n特别是，常规 MP2 相关能与用 KS 轨道定义的某种双杂化相关项，不应不加说明地互换。先验证一个孤立的 MP2 模块，再把它嵌入特定泛函，是两层不同的任务。\n\n## 为什么这条支线仍然值得保留\n\n它让后续 meta-GGA 学习有了背景：局部密度本身不包含全部轨道环境信息，引入 τ 是增加半局域描述能力的一种方式，但 τ 并不是 MP2 关联的替代品。\n\n实际主线后来收敛到 SCAN 的密度量、导数和 GPU 组装。把双杂化作为一篇边界清楚的学习文章，能够保留研究方向形成的过程，也避免把“读过原理”“写过原型”和“经过生产验证”混成同一种完成状态。\n\n## 资料与记录\n\n- [PySCF：MP2](https://pyscf.org/user/mp.html)\n- [PySCF：DFT 与数值积分](https://pyscf.org/user/dft.html)"
        },
        {
            "slug": "GANSU-06-LDA-GGA-Hybrids",
            "title": "LDA、GGA 与杂化泛函的学习笔记",
            "date": "2025-12-03",
            "category": "量子化学基础",
            "period": "2025-12",
            "written": "2026-10-27",
            "series": "GANSU",
            "seriesOrder": 6,
            "summary": "按输入信息和算符结构理解 LDA、GGA、meta-GGA 与杂化，避免把泛函层级当成固定的精度排行榜。",
            "tags": [
                "GANSU",
                "LDA",
                "GGA",
                "杂化泛函"
            ],
            "coverImage": "",
            "markdown": "12 月的材料把 LDA、GGA、杂化和双杂化放在一起介绍。补写时，更适合先看各类方法需要什么输入、增加了哪些运算，再讨论它们可能改善什么物理问题。\n\n## LDA 从局部密度出发\n\nLDA 在每个位置根据密度估计交换相关能密度。程序实现依赖格点上的 ρ，随后按积分权重求和。虽然名字里有“局部”，仍然需要结合全局密度矩阵和自洽求解；它不是把分子拆成互不相干的几个点。\n\n还要区分每电子能量 εxc 与每体积能量密度 e。常见接口以 εxc 返回数值，但积分时使用 `ρ εxc`。把两者混淆，会让看起来合理的局部值形成错误总能量。\n\n## GGA 增加密度变化信息\n\nGGA 进一步使用密度梯度。无自旋极化的常见实现把 `σ = ∇ρ·∇ρ` 作为输入之一，因此导数接口会给出对 ρ 和 σ 的偏导。\n\nVxc 组装时需要把 σ 对密度矩阵的变化继续通过链式法则传下去。只取得一个 `vsigma` 数值并不能完成势矩阵；AO 梯度、密度梯度和系数仍须正确收缩。\n\n## 杂化改变交换结构\n\n杂化泛函把一定比例或距离范围内的非局域精确交换与近似交换相关组合。范围分离杂化还要区分短程与长程算符，不能只用一个百分比概括所有形式。\n\n因此，半局域 RKS 中 `H + J + Vxc` 的简写，不应原封不动地用于所有杂化。接口允许填写某个名称，也不代表后端已经支持相应的交换、相关和导数路径。\n\n## 层级越高不等于所有体系都更好\n\n更多输入通常意味着更强的表达能力和更多实现成本，但精度仍取决于体系、性质和泛函设计。计算复杂度也不宜只写一个统一幂次：积分筛选、密度拟合、基组规模和实际算法都会改变主导成本。\n\n在这条项目主线中，最后主要深入的是依赖 τ 的 SCAN 类 meta-GGA。它增加了动能密度与对应势贡献，却不等于加入 HF 非局域交换。先把输入量和算符分清，比给每种方法贴一个“更高级”的标签更能指导实现。\n\n## 资料与记录\n\n- [PySCF：DFT 与数值积分](https://pyscf.org/user/dft.html)\n- [Sun、Ruzsinszky、Perdew：SCAN 原始论文](https://arxiv.org/abs/1504.03028)"
        },
        {
            "slug": "GANSU-05-HF-to-KS",
            "title": "HF 与 Kohn–Sham DFT：研究方向为何发生变化",
            "date": "2025-12-03",
            "category": "量子化学基础",
            "period": "2025-12",
            "written": "2026-10-27",
            "series": "GANSU",
            "seriesOrder": 5,
            "summary": "回顾从 HF 转向 Kohn–Sham DFT 的学习过程，解释哪些计算结构可以复用、哪些能量与势必须重新处理。",
            "tags": [
                "GANSU",
                "DFT",
                "Kohn–Sham",
                "XC"
            ],
            "coverImage": "",
            "markdown": "2025 年 12 月的学习开始转向 DFT。这个转变并不是把 HF 中的一个函数换掉，而是重新理解有效单电子问题与能量表达式之间的关系。\n\n## 密度观点并没有让轨道消失\n\nKohn–Sham 方法以一个辅助的非相互作用体系表达动能，并通过轨道构造密度。实际局域基组程序里仍然会解轨道系数、形成密度矩阵并反复更新有效势。因此，HF 阶段学到的基组、正交化和 SCF 可以继续使用。\n\n需要避免的简化是：“DFT 只需要一个三维密度，所以程序不再涉及轨道或矩阵。”理论自变量和实际算法采用的表示，并不是同一层概念。\n\n## 交换相关能承担哪些内容\n\n对给定核坐标，常见的 KS 总能表达包含非相互作用动能、核对电子的作用、经典 Hartree 能，以及交换相关能。XC 中不仅有交换，还包含实际体系与辅助非相互作用体系之间需要补偿的关联效应。\n\n所以不能把其余各项统称为“完全没有任何误差的精确量”。有限基组、数值积分和求解阈值仍会带来数值误差；未知泛函的近似又属于另一层误差。\n\n## 程序中的变化位置\n\n对于不含非局域 HF 交换的闭壳层半局域路径，可用下面的结构理解：\n\n```text\nHF:   F = H + J - 1/2 K\nRKS:  F = H + J + Vxc\n```\n\n这只是当前密度约定下的简写。杂化泛函还会引入相应的精确交换项，轨道依赖的 meta-GGA 也需要正确的广义势矩阵处理。\n\nGANSU 后续接入 RKS 时，重要任务是使能量、Vxc 和 Fock 组装保持一致。不能只在 Fock 中加一项，然后沿用 HF 的总能量计算方式而不重新推导。\n\n## 如何比较 HF 与 DFT\n\n两种方法的总能量不同，不等于其中一个程序实现错误。数值核对应该先选择同一方法、同一输入和可匹配的条件，再比较实现。跨方法比较讨论的是模型与预测差异，需要另一套参考标准。\n\n这也是之后检查 SCAN 与 r²SCAN 时反复用到的原则。它们共享许多数据处理步骤，但属于不同泛函；相互之间的能量差不能作为同泛函数值实现误差。\n\n## 当时的学习收获\n\nHF 提供了一条理解自洽轨道问题的路线，DFT 让注意力转向 XC 及数值积分。后来的工程主线，正是在保持已有 SCF 框架可读、可核对的前提下，把更复杂的密度量与 XC 贡献接入程序。\n\n## 资料与记录\n\n- [PySCF：DFT 与数值积分](https://pyscf.org/user/dft.html)\n- [PySCF：SCF 方法与收敛](https://pyscf.org/user/scf.html)"
        },
        {
            "slug": "GANSU-04-HF-SCF-Loop",
            "title": "HF 代码里的正交化、密度更新与收敛判断",
            "date": "2025-11-12",
            "category": "量子化学基础",
            "period": "2025-11",
            "written": "2026-10-27",
            "series": "GANSU",
            "seriesOrder": 4,
            "summary": "把 HF 循环拆成正交化、占据、密度更新和残差检查，说明为什么能量变化小不等于结果可靠。",
            "tags": [
                "GANSU",
                "SCF",
                "密度矩阵",
                "收敛"
            ],
            "coverImage": "",
            "markdown": "同一份 11 月 HF 原型可以从另一个角度阅读：哪些操作在每轮 SCF 中改变，哪些输入始终不变。把这件事整理清楚，对后来设计 AO 缓存和增量 XC 很有帮助。\n\n## 固定数据与迭代数据\n\n固定几何和基组下，S、H 与基函数相关的积分不随电子迭代改变。P、J、K、F、轨道系数和轨道能则随迭代更新。正交化矩阵一般也可以在循环外建立。\n\n这种区分不仅用于减少重复计算，还决定验证方式。若固定数据在迭代中意外变化，最终能量的漂移可能来自缓存或初始化，而不是 SCF 本身。\n\n## 密度更新必须与占据方式一致\n\n对闭壳层、自旋求和密度，`P = 2 Cocc Coccᵀ`。电子数检查可以写成 `Tr(P S) ≈ Ne`。这同时检验占据数、系数矩阵和非正交基组处理，通常比只看几个密度元素更有意义。\n\n还需要保证占据轨道来自正确的本征值排序。对于开壳层、近简并或不同电子态，不能把闭壳层原型的“取前一半轨道”规则直接推广。\n\n## 能量阈值、密度阈值与残差\n\n相邻两次能量接近，可能只是更新幅度变小；密度仍可能振荡，或者停留在不充分自洽的状态。除了能量变化和密度 RMS，还可以检查广义基底中的 SCF 残差：\n\n```text\nR = F P S - S P F\n```\n\n在相容的约定和数值精度下，收敛解应使这个残差变小。不同程序输出的 RMS 定义可能不一样，比较阈值时要看清是否包含归一化。\n\n## Damping 与 DIIS 的角色\n\nDamping 限制相邻状态的变化，DIIS 利用历史迭代构造外推。它们改变的是求解路径，不能替代对能量表达式和矩阵实现的核验。若公式里少了一个系数，换一种收敛策略可能让错误结果更稳定。\n\n学习阶段适合先保留简单迭代作为可读基线，再加入加速方法。面对不收敛案例，也应保留失败日志，而不是只报告后来成功的那一次。后续 Pentacene 的测试中，初猜与求解策略的影响再次体现了这条经验。\n\n## 给后续实现留下的检查点\n\n每轮数据应有清楚的所属状态，最终能量需要与最终密度对应。日志至少保留方法、输入、阈值、迭代次数及是否真正收敛。程序运行结束只是流程事件，数值求解是否完成还需要这些证据。\n\n## 资料与记录\n\n- [PySCF：SCF 方法与收敛](https://pyscf.org/user/scf.html)"
        },
        {
            "slug": "GANSU-03-Python-HF",
            "title": "用 Python 跑通第一个 HF：以 H₂ 为例",
            "date": "2025-11-12",
            "category": "量子化学基础",
            "period": "2025-11",
            "written": "2026-10-27",
            "series": "GANSU",
            "seriesOrder": 3,
            "summary": "按分子初始化、积分和 SCF 循环复盘 Python HF 原型，明确 PySCF 与自写部分的分工。",
            "tags": [
                "GANSU",
                "Python",
                "HF",
                "PySCF"
            ],
            "coverImage": "",
            "markdown": "2025 年 11 月的组会已经包含能够运行的 Python HF 学习代码。这个原型最有价值的地方，是把抽象的自洽过程拆成可以逐步查看的矩阵操作，而不是追求速度。\n\n## 先固定输入约定\n\nH₂ 是合适的入门体系，但“小分子”并不意味着可以忽略坐标单位、基组和占据数。原始材料中出现过以 bohr 表示的坐标；补写示例时必须显式给出单位，不能把同一个数字默认为 Å 再拿能量作比较。\n\n学习原型通过 PySCF 建立分子并取得积分。这样可以把精力放在 HF 循环上，同时保留可靠的积分参照。应明确：自己实现了矩阵与迭代过程，不等于从零实现了基函数解析和分子积分引擎。\n\n## 最小原型需要哪些量\n\n输入固定以后，需要 S、动能与核吸引组成的 H，以及二电子积分。随后构造正交化矩阵，并提供初始密度。闭壳层、自旋求和密度约定下，有：\n\n```text\nP = 2 Cocc Coccᵀ\nF = H + J[P] - 1/2 K[P]\nEelec = 1/2 Tr[P(H + F)]\nEtot = Eelec + Enuc\n```\n\n这些系数依赖密度约定。若 P 不包含双占据因子，Fock 和能量公式中的系数也会随之改变，不能从两个程序里各抄半套。\n\n## 把每次更新变成可观察的步骤\n\n每轮迭代都可以输出电子能量、总能量、密度变化范数和轨道正交误差。对于很小的 AO 空间，还可以打印 J、K 或 F 的部分矩阵元素，检查自己写的收缩是否与直接循环一致。\n\n伪代码的主线是：\n\n```text\n读取积分并建立正交化变换\nwhile 未收敛:\n    从 P 构造 J、K、F\n    在正交基底解本征问题\n    用占据轨道生成 P_new\n    比较能量和密度变化\n    更新 P\n```\n\n真正实现时还要明确能量对应新密度还是旧密度，收敛判定后是否做一次最终重算。混用不同迭代状态，会制造很难察觉的“最后一轮误差”。\n\n## 怎样与 PySCF 对照\n\n对照应使用相同几何、单位、基组、电荷、自旋和方法；初猜及收敛阈值也需要记录。若总能量不同，先检查核间排斥是否加入、电子数是否正确，再检查积分索引和交换项。\n\n这份原型不是 GANSU 的生产实现，也没有在本次补记中重新执行。它记录了学习阶段怎样把 HF 方程转成一条能够检查的计算链，后续的 CUDA 与 DFT 开发沿用了这套拆分思路。\n\n## 资料与记录\n\n- [PySCF：SCF 方法与收敛](https://pyscf.org/user/scf.html)"
        },
        {
            "slug": "GANSU-02-Basis-and-Roothaan",
            "title": "基组与 Roothaan 方程：让轨道问题变成矩阵问题",
            "date": "2025-10-29",
            "category": "量子化学基础",
            "period": "2025-10",
            "written": "2026-10-27",
            "series": "GANSU",
            "seriesOrder": 2,
            "summary": "解释非正交 AO 基组如何把 HF 方程变成广义本征值问题，并区分轨道数、基函数数与电子数。",
            "tags": [
                "GANSU",
                "HF",
                "基组",
                "Roothaan 方程"
            ],
            "coverImage": "",
            "markdown": "第一份组会后半部分讨论了 Roothaan 方程。它的重要性在于给出计算机可处理的表达：用有限个已知基函数展开未知轨道，把求函数的问题变成求系数矩阵的问题。\n\n## 三种“数量”不要混在一起\n\n电子数由核电荷、总电荷等决定；AO 基函数数由所选基组及角动量表示决定；占据轨道数则还与自旋及占据方式有关。闭壳层 RHF 中，每个占据空间轨道容纳两个电子，不能因此认为 AO 数也等于电子数的一半。\n\n设基函数为 `χμ`，分子轨道展开为 `ψi = Σμ Cμi χμ`。有限基组限制了可搜索的轨道空间。把 STO-3G 换成更大的基组，会改变近似空间，也改变积分、矩阵和显存需求；这不是只增加一次循环的精度开关。\n\n## 为什么有重叠矩阵 S\n\n原子中心基函数通常不彼此正交。于是轨道方程写成：\n\n```text\nF C = S C ε\nSμν = <χμ | χν>\nCᵀ S C = I\n```\n\n这里的正交性由 S 定义。若直接对 F 做普通对角化，得到的向量未必满足原 AO 空间要求的正交约束。查看轨道是否正交时，也应检查 `Cᵀ S C`，而不是只检查 `Cᵀ C`。\n\n## 把广义问题变为普通问题\n\n一种常用做法是先分解 `S = U s Uᵀ`，再构造对称正交化矩阵 `X = U s^(-1/2) Uᵀ`。随后解变换后的 `F' = Xᵀ F X`，最后把轨道系数变回 AO 表示。\n\n这套推导有一个数值前提：不能无条件地对极小的重叠本征值求逆平方根。近线性相关会放大舍入误差，需要采用与参考实现一致的处理规则。教学小基组不容易暴露的问题，在更大的弥散基组上可能直接影响稳定性。\n\n## 与程序中的数组对应\n\n在典型闭壳层实现中，S、F、P 是 AO×AO 矩阵，C 的列表示轨道。代码里的 `nao`、占据范围和矩阵 leading dimension 各有含义。先在纸面上标出形状，再写矩阵乘法，能避免把转置错误误认为积分公式错误。\n\n这也为后来的 GPU 工作留下一个习惯：公式正确还不够，数组的布局、步长和局部索引必须与公式对应。Roothaan 方程是量子化学入门内容，也是后面理解 cuBLAS 数据路径的起点。\n\n## 资料与记录\n\n- [PySCF：SCF 方法与收敛](https://pyscf.org/user/scf.html)"
        },
        {
            "slug": "GANSU-01-HF-Mean-Field",
            "title": "HF 入门：多电子问题、平均场与 Slater 行列式",
            "date": "2025-10-29",
            "category": "量子化学基础",
            "period": "2025-10",
            "written": "2026-10-27",
            "series": "GANSU",
            "seriesOrder": 1,
            "summary": "从电子哈密顿量、平均场和反对称波函数出发，重新整理最初理解 HF 时的几个关键概念。",
            "tags": [
                "GANSU",
                "HF",
                "平均场",
                "Slater 行列式"
            ],
            "coverImage": "",
            "markdown": "2025 年 10 月的第一份组会记录从 Hartree–Fock 方法开始。回看这个阶段，最需要先建立的是问题的层次：分子中有哪些相互作用，我们固定了哪些自由度，又用什么形式近似电子波函数。只有这些关系明确，后面的 Fock 矩阵与 SCF 循环才不只是几个待调用的函数。\n\n## 固定原子核以后，仍然有多电子问题\n\n在 Born–Oppenheimer 近似下，电子计算通常把核坐标视作参数。电子哈密顿量包含电子动能、核对电子的吸引，以及电子之间的排斥；核间排斥能在给定几何下是常数，最后加入总能量。\n\n固定核并没有消除电子间耦合。一个电子所在的位置，会改变其他电子感受到的相互作用。困难正来自波函数依赖所有电子坐标，不能简单地把每个电子当成完全独立的粒子求解。\n\n## 平均场与交换从哪里来\n\nHF 在单个 Slater 行列式的范围内优化波函数。各电子受到由占据轨道共同决定的有效作用，因此能够用一组耦合的单电子方程描述。这里的“平均”不是把电子排斥删掉，而是以轨道和密度决定的 Coulomb、exchange 项取代更完整的多体关联。\n\nHartree 乘积不能保证电子交换时波函数变号。Slater 行列式把反对称性写入试探波函数，由此产生交换项。交换是波函数反对称性的结果，不能用“两电子之间又加了一种经典作用力”来理解。\n\nHF 的电子关联仍受到单行列式近似限制。即使 SCF 收敛到很高精度，也不表示已经得到完整的关联能；数值收敛误差与方法近似误差必须分开。\n\n## 为什么要自洽\n\n有效算符依赖占据轨道，而占据轨道又是该算符的本征函数。实际流程只能从初猜开始，构造 Fock 算符、解轨道、更新密度，再回到构造步骤。\n\n```text\n初猜轨道或密度\n    → 构造平均场\n    → 求解轨道\n    → 更新密度\n    → 检查收敛\n```\n\n自洽表示输入密度与求解后得到的输出密度相容。它不自动保证所得解是全局最低能态，也不消除基组不完备性。后续看到“程序正常退出”时，应继续问它是否真正收敛、收敛到什么解。\n\n## 这一步对后续 GANSU 工作的作用\n\n之后虽然从 HF 转向了 Kohn–Sham DFT，分子输入、基组、矩阵本征问题和密度更新的基本结构仍然有用。变化主要发生在有效势及相应能量表达式。先把 HF 的平均场循环理解清楚，才能判断新增 XC 路径应接在哪一层。\n\n第一阶段的目标是理解和复现已有方法，不是把 GANSU 原有的 HF 能力计作自己的新增实现。\n\n## 资料与记录\n\n- [PySCF：SCF 方法与收敛](https://pyscf.org/user/scf.html)\n- [GANSU 上游项目](https://github.com/Yasuaki-Ito/GANSU)"
        }
    ],
    "album": [
        {
            "slug": "Mizuki-2026-10-02",
            "title": "みずき数量增加了！",
            "date": "2026-10-02",
            "summary": "みずき数量增加了！",
            "tags": [],
            "image": "album/Mizuki-2026-10-02/mizuki.jpg",
            "images": [
                {
                    "src": "album/Mizuki-2026-10-02/mizuki.jpg",
                    "alt": "みずき数量增加了！"
                }
            ],
            "markdown": "みずき数量增加了！"
        },
        {
            "slug": "Kaguya-2026-09-27",
            "title": "去看了超时空辉夜姬",
            "date": "2026-09-27",
            "summary": "感觉是这段时间看的最好看的电影了  彩花可爱捏(*๓´╰╯`๓)♡",
            "tags": [],
            "image": "album/Kaguya-2026-09-27/01-characters.jpg",
            "images": [
                {
                    "src": "album/Kaguya-2026-09-27/01-characters.jpg",
                    "alt": "去看了超时空辉夜姬"
                },
                {
                    "src": "album/Kaguya-2026-09-27/02-lettering.jpg",
                    "alt": "超时空辉夜姬应援扇背面"
                }
            ],
            "markdown": "感觉是这段时间看的最好看的电影了  彩花可爱捏(*๓´╰╯`๓)♡"
        }
    ],
    "games": [
        {
            "slug": "dynasty-warriors-3-remastered",
            "title": "真・三国无双2 with 猛将传Remastered",
            "review": "《真・三国无双2 with 猛将传Remastered》是一款以一骑当千战斗为核心的动作游戏，将《真・三国无双2》及《猛将传》的内容重新带回玩家面前。它对当年的作品做了相当全面的重制，而我比较欣赏的是，它也给不同习惯的玩家留下了选择：经典设置可以重温接近原作的手感，普通设置则通过闪避等新增操作改善战斗体验，让刚接触这部作品的新手也能更顺畅地投入战场。\n\n另一个很实用的改进，是关卡准备界面直接列出了隐藏宝物的出现条件。过去需要来回查攻略、确认触发要求的过程，如今可以在游戏里完成。寻找和收集的目标依然存在，却少了许多游玩之外的检索工作，让刷隐藏宝物这件事轻松了不少。这类便利性调整，也让老作品的重制更适合今天的游玩节奏。\n\n目前游玩约20小时，我还有一个比较在意的问题：取得一名武将的最强武器之后，是否仍有足够的内容，让这套毕业装备发挥作用？我希望能像游玩《无双大蛇2》时那样，继续使用培养完成的角色，享受到最强武器带来的爽快感。如果角色刚刚毕业，就已经没有值得继续挑战的目标，只能换下去培养下一个人，多少会让我觉得可惜。\n\n不过，这部分目前只是疑问。我的游玩进度还不足以判断后续内容能否承接这样的期待，也不能据此认定它缺少最强武器的使用空间。就现阶段的体验而言，保留旧作味道的选择、面向新玩家的操作调整，以及更清晰的收集指引，都让我对这次重制有不错的印象。暂给8.5/10.0，等继续深入之后，再看看这个疑问能否得到答案。",
            "summary": "经典与普通设置兼顾旧作手感和上手体验，宝物条件展示也更方便；最强武器到手后是否还有足够的施展空间，仍待继续游玩确认。",
            "images": [
                {
                    "src": "games/images/dynasty-warriors-3-remastered.png",
                    "alt": "《真・三国无双2 with 猛将传Remastered》金色游戏封面",
                    "caption": "《真・三国无双2 with 猛将传Remastered》"
                }
            ],
            "sources": [
                {
                    "title": "光荣特库摩官方介绍",
                    "url": "https://www.gamecity.com.tw/smusou2-re/sch/"
                },
                {
                    "title": "Steam 官方介绍",
                    "url": "https://store.steampowered.com/app/3841510/DYNASTY_WARRIORS_3_Complete_Edition_Remastered/?l=schinese"
                }
            ],
            "status": "游玩20小时",
            "platform": "",
            "date": "2026-10-25",
            "score": 8.5
        },
        {
            "slug": "baizi",
            "title": "稗子",
            "review": "《稗子》是 roccay 开发、PLAYISM 发行的一款超现实剧情解谜游戏。玩家通过鼠标点选、道具交互和阅读文本，探索一座正在进行神秘天体调查的孤岛。科幻背景与诡异氛围放在一起，给这个小体量故事搭起了一个很有趣的舞台。\n\n最让我喜欢的还是它的表现手法。超现实的画面与文字叙事相互配合，让这场调查带上了鲜明的荒诞感。点击探索和解谜的过程中，“这个世界究竟是怎么回事”的好奇心也一直在推动体验。它有自己的表达方式，这种新颖与独特，是我愿意给出高分的重要原因。\n\n世界观同样很有意思。孤岛、调查者和未知天体构成的框架，让我很想继续了解那些陌生设定。遗憾的是，作品的体量实在偏小，刚对这个世界产生更深入的兴趣，故事就开始收束了。结尾因此显得比较仓促，情绪和内容还没有充分沉淀，前面积累起来的期待也没有完全得到释放。如果能多一些展开和过渡，这个故事会更有余韵。\n\n综合来看，我会给它 8.0/10.0。新鲜的表现方式和有趣的设定，足以让这段体验留下印象；偏短的篇幅与匆忙的结尾，也确实让我感到可惜。它最让我意犹未尽的地方，是已经勾起了兴趣，却没有给我更多停留在这个世界里的时间。",
            "summary": "一部表现手法新颖、世界观有趣的超现实剧情解谜游戏；可惜体量偏小，结尾收束得有些仓促。",
            "images": [
                {
                    "src": "games/images/baizi-cover.png",
                    "alt": "《稗子》游戏封面",
                    "caption": "《稗子》"
                }
            ],
            "sources": [
                {
                    "title": "Steam 商店介绍",
                    "url": "https://store.steampowered.com/app/1699710/The_Dream_Of_A_Cockspur/?l=schinese"
                },
                {
                    "title": "PLAYISM 官方介绍",
                    "url": "https://playism.com/cn/game/the-dream-of-a-cockspur/"
                }
            ],
            "status": "已通关",
            "platform": "",
            "date": "2026-10-15",
            "score": 8
        },
        {
            "slug": "the-death-game-report",
            "title": "死亡游戏调查报告",
            "review": "《死亡游戏调查报告》是一款由 shu3 制作、以档案调查为核心的文字推理解谜游戏。玩家通过复古终端复原记录，将线索与学生名册、岛屿地图交叉比对，查明每起死亡的死因、凶器与加害人。无人岛上的死亡游戏很容易让我联想到《大逃杀》，但具体的人物处境和事件细节又有不少不同。\n\n最有特点的是它讲故事的方式。游戏把信息放在每个人各自的记录与视角里，让玩家一边阅读、一边核对，逐渐拼出整个事件的全貌。分散的文字会在调查中互相补充，原本看似孤立的信息也慢慢连起来。这个过程既是在解谜，也是在理解故事，这些片段最终拼成了一个完整而全面的故事。\n\n解谜的可玩性也很不错。难度循序渐进，随着掌握的信息增加，玩家会逐渐适应整理线索和建立联系的节奏。报告的核实给推断提供了明确反馈，卡住时也有适当的提示帮助找回方向，保留了自己思考、自己把线索接上的满足感。\n\n唯一比较遗憾的是结局略显平淡。前面通过多视角调查积累了很强的投入感，最后的收束却没有带来同等分量的余韵。不过，这不影响我对整体体验的认可：能把文字叙事和推理解谜结合得这样自然，已经很难得。综合评分 8.5/10.0。",
            "summary": "多视角文字记录拼出完整事件，推理解谜循序渐进、提示适当；结局略显平淡。",
            "images": [
                {
                    "src": "games/images/death-game-report.png",
                    "alt": "《死亡游戏调查报告》的记录复原与死亡报告界面",
                    "caption": "《死亡游戏调查报告》游戏画面"
                }
            ],
            "sources": [
                {
                    "title": "Steam 官方介绍",
                    "url": "https://store.steampowered.com/app/5044770/The_Death_Game_Report/?l=schinese"
                }
            ],
            "status": "已通关",
            "platform": "",
            "date": "2026-10-03",
            "score": 8.5
        }
    ]
};
