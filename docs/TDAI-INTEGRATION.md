# API Hub 的 Git 与 TDAI 接入

- **状态：** 本地 Git 仓库已初始化（`main`，待创建首个提交）；目标公开远程为 `https://github.com/IceKouchya/api-hub.git`，但尚未建立或推送；CodeGraph 注册和 Wiki 导入待执行
- **适用范围：** `D:\Agent-Codex\projects\api-hub\`

## 目标

让 API Hub 的运行配置、可公开项目资料、设计决策和测试资产在一个项目级 Git 仓库中维护，并在需要时进入 TencentDB-Agent-Memory（TDAI）的 CodeGraph 与 Wiki 能力。

## 单一资料源

```text
D:\Agent-Codex\projects\api-hub\
├─ README.md
├─ .gitignore
└─ docs\                         # 唯一版本化项目资料
   ├─ Overview.md
   ├─ CONTEXT.md
   ├─ Plan.md
   ├─ API-CAPABILITY-MATRIX.md
   ├─ ADR-*.md
   ├─ api-hub.canvas
   └─ tickets\

D:\Agent-Codex\obsidian-vault\Projects\api-hub\
└─ <directory junction -> projects\api-hub\docs>
```

Obsidian 路径和 Git 仓库 `docs/` 指向同一份物理资料。禁止复制两份后分别编辑，否则文本、Canvas 和任务票迟早会像分裂的平行宇宙一样互相否认。

## 公开仓库允许与禁止内容

允许跟踪：

- 脱敏项目资料、Canvas、ADR、执行票、能力矩阵和测试方案。
- 不含真实凭据的 Compose 模板、脚本、部署说明和 `.env.example`。
- 可复现的测试、固定版本约束和公开运行维护规则。

禁止跟踪：

- 上游 API Key、New API Token、管理员密码、Cookie、私有 URL 参数。
- `.env`、数据库、`/data`、日志、备份、容器导出、完整渠道设置导出。
- 主机 LAN IP、设备清单、公开之前的真实渠道拓扑，以及其他不适合公开的本机运营细节。

`.gitignore` 是第一层保护，不是替代提交前审查的魔法护符。每次提交和推送前都要检查候选文件、diff、历史与远程页面。

## 公共 Git 仓库步骤

1. 在本项目目录初始化 Git，默认分支为 `main`。
2. 审查首次提交候选和 `.gitignore`，确认无敏感内容。
3. 由修确认精确托管目标：平台、账户/组织、仓库名、公开可见性和默认分支。
4. 只在本仓库设置 Git 作者身份；不改全局 Git 配置。
5. 创建或关联已确认的公开远程仓库，设置 `origin`。
6. 创建首个审查后的提交并推送。
7. 验证 `origin`、远程默认分支、远程文件清单与本地工作树干净状态。

目标远程已确定为 `https://github.com/IceKouchya/api-hub.git`。只有在本机获得 `IceKouchya` 的 GitHub 创建仓库或推送授权后，才可创建、关联与推送该公开仓库。

## TDAI 接入不是一个动作

### CodeGraph

CodeGraph 需要可访问的远程仓库 URL。公共 Git 仓库建立后，还必须显式注册该仓库并等待索引完成；“已提交”或“已推送”不等于 CodeGraph 已可用。

验收：

1. 使用批准的 `repo_url`、分支和仓库名创建 CodeGraph 记录。
2. 等待状态达到 `ready`。
3. 确认 `sync_error` 为空，并检查索引的文件、节点和边计数。
4. 在后续提交后按 TDAI 支持的同步机制重新索引或更新。

### Wiki

Wiki 适合导入稳定、脱敏且能帮助跨窗口理解项目的 Markdown，例如 `Overview.md`、ADR、能力矩阵、部署运行手册和确认后的接口约定。

Canvas、个人计划、未验证草稿、真实渠道详情、密钥、备份和本机日志不得导入 Wiki。

Wiki 导入需要单独的明确授权：索引流程会把选定的红线审查后文档发送到已配置的 TDAI 上游模型/代理进行分析和生成。创建本地文件或推送 Git 并不自动包含这项外发授权。

## 当前下一步

执行 [000-establish-public-repository.md](tickets/000-establish-public-repository.md)，在修确认远程目标后完成公开 Git 基线；随后再决定是否单独授权 CodeGraph 注册和 Wiki 导入。