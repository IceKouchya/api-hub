# 000：建立公共 Git 仓库与 TDAI 接入基线

- **状态：** `local-git-initialized; ready-for-initial-commit; blocked-by-github-auth`
- **目标远程：** `https://github.com/IceKouchya/api-hub.git`，公开，默认分支 `main`
- **依赖：** GitHub 账户对 `IceKouchya` 的有效创建仓库或推送授权
- **后续解锁：** 001 部署 New API 基线；后续 CodeGraph 注册
- **执行角色：** 独立仓库维护窗口

## 目标

将 `D:\Agent-Codex\projects\api-hub\` 建立为独立、可公开维护的 Git 仓库，使 TDAI 后续可以以明确远程 URL 注册 CodeGraph。仓库包含 API Hub 的运行模板、项目资料、能力矩阵、Canvas 和执行票，但绝不包含运行数据、日志、备份或任何凭据。

## 已确认目录模型

- Git 仓库根：`D:\Agent-Codex\projects\api-hub\`
- 版本化资料：`docs/`
- Obsidian 项目入口：`D:\Agent-Codex\obsidian-vault\Projects\api-hub\`，它是指向 `docs/` 的目录联接，不是第二份资料。
- 未来运行模板、Compose 文件、脚本和测试：仓库根的受控目录。
- 本机数据、日志、备份、`.env` 和秘密：被 `.gitignore` 排除，且不通过 `git add -f` 绕过。

## 开始前必读

1. [README.md](../../README.md)
2. [TDAI-INTEGRATION.md](../TDAI-INTEGRATION.md)
3. [Overview.md](../Overview.md)
4. [Plan.md](../Plan.md)
5. [API-CAPABILITY-MATRIX.md](../API-CAPABILITY-MATRIX.md)
6. 工作空间 `D:\Agent-Codex\projects\README.md`。

## 必须由修确认的参数

- 托管平台：GitHub、CNB 或其他明确平台。
- 账户或组织名。
- 仓库名。
- 是否公开可见。
- 默认分支名，建议 `main`。
- 首次提交包含哪些不敏感文件。
- CodeGraph 是否在推送后立即注册。
- 是否单独授权把哪些脱敏文档外发给 TDAI Wiki 进行索引。

不要用“公共仓库”这四个字替代这些参数；公共到哪里、谁能看、推什么内容，都是不同的外部披露决定。

## 允许修改范围

- `D:\Agent-Codex\projects\api-hub\` 中的 Git 元数据、README、`.gitignore`、可公开文档、模板、脚本和测试。
- 该仓库的项目级 Git 作者身份、分支、远程和提交历史。
- TDAI CodeGraph 的明确仓库注册记录，前提是修已确认相应远程 URL 与注册授权。
- 本项目文档内与仓库状态有关的脱敏记录。

## 禁止修改范围

- `D:\Agent-Codex\projects\` 父目录的 Git 状态和目录结构。
- Workbench、TDAI 运行时、其他项目和全局 Git 作者身份。
- 真实上游 API Key、New API Token、管理员密码、`.env`、数据库、日志、备份或完整渠道导出。
- 未经确认的远程仓库、可见性、组织或账户。
- TDAI Wiki 的导入。该操作需要针对已审查脱敏文本和索引外发的单独确认。

## 实施步骤

1. 获取修确认的精确远程目标与公开边界。
2. 在 `projects/api-hub` 内检查项目资料、`.gitignore`、候选文件和任何历史遗留；确认 Vault 入口仍指向 `docs/`。
3. 运行敏感信息扫描，覆盖常见 API Key、Token、密码、私钥、数据库和运行目录模式；人工阅读每个首次提交文件。
4. 在项目目录初始化 Git 并设置默认分支 `main`。若已初始化，读取当前状态，不重建仓库。
5. 仅在项目本地配置 Git `user.name` 与 `user.email`，不写全局配置。
6. 暂存经审查的文件，复查 `git diff --cached` 和 `git status`。
7. 创建首个提交；提交信息应说明 API Hub 项目基线，不包含敏感运行细节。
8. 创建或关联修已确认的远程仓库，设置 `origin`，推送 `main`。
9. 重新读取远程文件清单、仓库可见性、默认分支和本地 `origin`；确认工作树干净。
10. 如修已单独授权 CodeGraph 注册，使用批准的远程 URL 注册并等待状态为 `ready`，记录脱敏索引结果和 `sync_error`。
11. 如修已单独授权 Wiki 外发，先列出要导入的脱敏 Markdown，逐项确认后才创建、写入和触发索引。

## 验收标准

1. `projects/api-hub` 是独立 Git 仓库，默认分支和项目本地作者身份符合确认值。
2. 仓库根 README 明确链接 `docs/`，Obsidian 路径没有第二份竞争性资料。
3. `.gitignore` 已排除密钥、`.env`、数据库、数据、日志、备份和本机运营记录。
4. 首次提交与远程仓库均经人工复核，不含真实凭据、设备信息、私有网络细节或运行数据。
5. `origin` 精确指向修确认的仓库 URL，远程可见性与确认值一致。
6. 如执行 CodeGraph：最终状态为 `ready`，`sync_error` 为空；仅创建记录不算完成。
7. 如执行 Wiki：仅导入修明确批准的脱敏文件，且先获得索引外发授权。

## 失败处理与回滚

- 敏感扫描命中：停止暂存和推送，移除或脱敏后重新审查；若已泄露，立即撤销/轮换凭据并按照平台历史重写或删除流程处理。
- Git 初始化/提交失败：保留工作文件，诊断本项目目录；不得重写 `projects/` 父目录或改动全局 Git 设置。
- 远程创建/推送失败：不切换到其他账户或临时仓库；保留本地提交，报告精确失败原因。
- CodeGraph 未 ready 或 `sync_error` 非空：记录为未完成，不把“已提交”冒充“已索引”。
- Wiki 索引未获授权：保留本地 Git 文档，不尝试绕过授权外发内容。

## 完成报告

报告必须包含：确认的远程 URL、可见性、默认分支、首次提交哈希、已推送文件类别、敏感扫描结论、`origin`、CodeGraph/Wiki 的实际状态和任何未完成项。不得包含任何凭据、数据库、完整网络细节或被忽略文件内容。
