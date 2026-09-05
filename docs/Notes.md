# API Hub 核实笔记

## 已核实的环境事实

本笔记记录方案阶段已经观察到的事实。它不是部署时的实时状态；执行窗口必须重新验证。

- Windows 主机已检测到 Docker Desktop，Docker Server 当时报告版本 `29.7.2`。
- 当前环境可用独立命令 `docker-compose --version`，曾报告 `v5.5.0`。
- `docker compose` 子命令在当时环境中不可用。因此部署票应先检测实际可用命令，不能假定两种 Compose 调用都存在。
- 方案调研时主机端口 `3000` 未被占用；执行前仍须重新检测，端口状态会变化。
- Workbench 是本机 `file:///` 静态控制台，不应承担网关服务职责；API Hub 必须独立于 Workbench。

## 已核实的产品资料

以下链接是方案阶段使用的主要资料入口。执行窗口应在部署当天重新阅读相应版本的 release notes 与安全公告。

- New API GitHub 仓库：<https://github.com/QuantumNous/new-api>
- New API 安装文档：<https://docs.newapi.pro/zh/docs/installation>
- New API Docker 安装文档：<https://docs.newapi.pro/zh/docs/installation/deployment-methods/docker-installation>
- New API 渠道管理文档：<https://docs.newapi.pro/zh/docs/guide/feature-guide/admin/channel>
- OpenAI 兼容聊天接口文档：<https://docs.newapi.pro/en/docs/api/ai-model/chat/openai/createchatcompletion>
- Embeddings 接口文档：<https://docs.newapi.pro/en/docs/api/ai-model/embeddings/createembedding>
- New API Security Advisories：<https://github.com/QuantumNous/new-api/security/advisories>

## 版本策略

方案阶段通过 GitHub API 看到的最新 release 曾是 `v1.0.0-rc.33`，时间点为 2026-09-05；该信息只用来说明“执行时必须固定并复核版本”，不是授权执行窗口直接使用该标签。

注意事项：

- 该版本的发布说明涉及仍处测试阶段的能力，并提示不推荐直接用于生产环境。
- New API 历史安全公告涵盖配额、缓存、Webhook、权限、Token 暴露与 SSRF 等类别。
- 因而第一阶段原则是：固定明确版本或镜像摘要、仅局域网、关闭不需要的公开能力、最小化敏感信息传播、每次升级前备份并可回滚。
- 不得将 `latest` 当作长期版本策略。`latest` 适合“看看会不会着火”的临时实验，不适合保存你的上游密钥。

## 前置核实清单

部署票开始前必须核实：

1. 目标 New API 版本、镜像仓库、发布说明和安全公告。
2. Docker Desktop 是否运行，实际可用的 Compose 命令是什么。
3. 目标端口是否闲置，以及是否有其他服务依赖该端口。
4. Windows 主机局域网 IP、网络类型、子网范围和防火墙默认规则。
5. 持久化目录所在磁盘、可用空间、备份位置和访问权限。
6. 每个上游的协议、Base URL、认证方式、模型列表、流式能力和使用限制。
7. 初始需要启用的统一模型别名，以及每个别名是否具备可用备用渠道。

## 待核实问题

- 真实上游是否全部 OpenAI 兼容，或是否需要 New API 的其他内置渠道类型。
- 每个“渠道 + 模型 + 协议路径”对工具调用、流式工具调用、视觉输入、推理参数、Embedding 与流式输出的实测结果；未通过验证的能力不得对客户端宣称可用。
- 最终应固定的 New API 版本或镜像摘要。
- 局域网中哪些设备和网段属于受信任范围。
- 是否存在将来接入私有组网的需求；当前范围不包含 Tailscale 或 ZeroTier。

## 资料使用规则

- 这份笔记不保存真实 URL 中的敏感参数、任何 API Key、Token、管理员密码、配置导出或完整日志。
- 上游具体凭据只在 New API 后台或受控运行时配置中由修本人录入。
- 执行窗口的完成报告只可记录脱敏后的渠道名称、版本、验证结果和故障类别。
