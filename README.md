# API Hub

个人局域网多上游大模型网关项目。运行时计划使用 New API，向自有设备提供统一 OpenAI 兼容入口、统一 Token、模型路由和渠道故障切换。

**当前状态：** 已完成项目设计、能力矩阵与执行票，并已在本地 `main` 创建两次脱敏文档提交，当前头提交为 `f697405`；目标公共远程为 `https://github.com/IceKouchya/api-hub.git`，已配置为本地 `origin`，等待 GitHub 创建仓库或推送授权；尚未部署容器、尚未配置真实上游凭据、尚未创建客户端 Token。

## 项目资料

项目的唯一版本化资料位于 [docs/](docs/)。其中包括：

- [项目总览](docs/Overview.md)
- [领域词汇](docs/CONTEXT.md)
- [实施计划](docs/Plan.md)
- [模型与协议能力矩阵](docs/API-CAPABILITY-MATRIX.md)
- [TDAI 集成说明](docs/TDAI-INTEGRATION.md)
- [架构决策记录](docs/ADR-0001-new-api-selection.md) 与后续 ADR
- [Obsidian Canvas](docs/api-hub.canvas)
- [执行票](docs/tickets/)

`D:\Agent-Codex\obsidian-vault\Projects\api-hub\` 是指向本仓库 `docs/` 的目录联接，供 Obsidian 浏览同一份文件。不得在 Vault 中另建副本，也不得将 `docs/` 复制到其他位置后分别维护。

## Git 与公开边界

本仓库准备作为公共 Git 仓库维护，但只跟踪可公开、脱敏且可复现的内容：项目文档、Canvas、执行票、部署模板、脚本和测试。

以下内容绝不进入 Git：上游 API Key、New API Token、管理员密码、`.env`、实际数据库、运行数据、日志、备份、认证 Cookie、完整渠道配置导出和本机网络细节。具体规则见 [.gitignore](.gitignore)。

首次公开推送前必须完成：

1. 审查首次提交文件与 Git 历史，确认无敏感内容。
2. 确认准确的托管平台、账户、仓库名、默认分支和公开可见性。
3. 配置本仓库的 Git 提交身份，不修改全局身份。
4. 将公开远程仓库设为 `origin`，完成首个审查后的提交与推送。
5. 复查远程仓库实际文件、`.gitignore` 和本地工作树状态。

## TDAI

公共 Git 仓库是 TDAI CodeGraph 的前置条件之一，但推送代码本身不会自动完成 TDAI 接入。后续必须单独完成 CodeGraph 仓库注册、索引状态验证；如需将项目文档导入 TDAI Wiki，还要先审查脱敏范围并获得针对索引外发的明确授权。完整流程见 [docs/TDAI-INTEGRATION.md](docs/TDAI-INTEGRATION.md)。

## 下一步

先执行 [000：建立公共 Git 仓库与 TDAI 接入基线](docs/tickets/000-establish-public-repository.md)，再开始 New API 部署票。