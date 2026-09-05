# 001：部署 New API 基线

- **状态：** `ready-for-agent`
- **依赖：** 000 公共 Git 仓库基线完成；运行环境盘点在本票开始时执行
- **后续解锁：** 002 配置上游渠道
- **执行角色：** 独立部署窗口

## 目标

在 `D:\Agent-Codex\projects\api-hub\` 建立可审查、可持久化、可回滚的 New API SQLite 单容器部署基线。完成后仅要求本机可访问后台；不录入真实上游 API Key，不创建客户端 Token，不开放公网。

## 开始前必读

1. [Overview.md](../Overview.md)
2. [Plan.md](../Plan.md)
3. [Notes.md](../Notes.md)
4. [ADR-0001-new-api-selection.md](../ADR-0001-new-api-selection.md)
5. New API 官方安装、Docker、release notes 与 Security Advisories。

## 允许修改范围

- `D:\Agent-Codex\projects\api-hub\` 及其直接子目录。
- Windows Docker Desktop 中新建的 API Hub 专属容器、网络、卷或挂载目录。
- 仅限为 API Hub 局域网访问新增的最小 Windows 防火墙规则。
- 本项目 Vault 文档中的状态或验证记录。

## 禁止修改范围

- `D:\Agent-Codex\projects\workbench\`。
- `D:\Agent-Codex\obsidian-vault\Projects\workbench\`。
- `D:\Agent-Codex\tdai-memory\`、其他项目、系统级 Docker 设置或无关容器。
- 路由器端口转发、公网 DNS、公共隧道、Tailscale、ZeroTier。
- 真实上游 API Key、客户端 Token、管理员密码在文档、Git、脚本或命令历史中的明文保存。

## 前置核实

1. Docker Desktop 正常运行，记录 Docker Server 版本。
2. 检测可用 Compose 调用；当前历史资料提示可能是 `docker-compose` 而非 `docker compose`，必须以实时检测结果为准。
3. 检查 `3000` 是否空闲；若被占用，停止并记录占用进程或请求确认替代端口，不自行迁移其他服务。
4. 获取当前 Windows 私有局域网 IP、网络类型与子网范围。
5. 查阅目标 New API 固定版本的 release notes 与 Security Advisories；确定镜像仓库、明确标签或摘要。
6. 确认宿主机数据目录与日志目录位于 `projects/api-hub` 内，并有足够空间和受控权限。
7. 检查 Git 状态；运行项目如需初始化仓库，应只在 `projects/api-hub` 自身初始化，不在 `projects/` 父目录初始化。

## 实施步骤

1. 在 `D:\Agent-Codex\projects\api-hub\` 创建项目级 `README.md`、`.gitignore`、运行配置目录、数据目录和日志目录。README 必须链接到 Vault 项目资料。
2. 依据官方目标版本创建可审查的 Compose 或等效运行配置：
   - 显式固定 New API 镜像版本或摘要。
   - 容器只暴露所需端口。
   - 映射宿主机持久化目录到容器 `/data`。
   - 映射日志目录到容器日志路径（以目标版本官方说明为准）。
   - 设置 `TZ=Asia/Shanghai`。
   - 不写入上游 API Key、New API Token 或预设管理员密码。
3. 在 `.gitignore` 中忽略运行数据、日志、备份、环境文件及任何潜在密钥文件。不要忽略可审查的 Compose 定义和 README。
4. 先执行配置语法/Compose 校验，再拉取固定镜像并启动容器。
5. 记录容器名称、镜像版本/摘要、端口映射、挂载路径和启动时间，但不得记录敏感环境变量。
6. 在本机浏览器访问后台。首次管理员初始化若需要由用户输入密码，执行窗口应停在安全输入步骤并让修本人完成，或采用不写入日志的受控交互方式。
7. 重启容器并再次确认后台可访问，验证 `/data` 中的持久化数据未丢失。

## 验收标准

1. API Hub 的全部运行文件都位于 `D:\Agent-Codex\projects\api-hub\`。
2. 目标镜像是明确固定版本或摘要，未将 `latest` 作为长期运行标识。
3. 本机能访问 New API 管理后台。
4. 容器重启后，初始化状态或基本设置仍存在。
5. 数据与日志不依赖容器临时层，且不被 Git 跟踪。
6. 未修改 Workbench、TDAI 或无关 Docker 项目。
7. 文档、命令输出和 Git diff 中没有真实 API Key、Token 或管理员密码。

## 验证建议

- Docker/Compose 配置校验。
- 容器状态、镜像 ID、端口映射和挂载检查。
- 本机后台访问检查。
- 重启容器后的后台访问与持久化检查。
- `git status` 与敏感字符串扫描。

## 失败处理与回滚

- 配置校验失败：不启动容器，修正仅限 `projects/api-hub` 的配置。
- 端口冲突：停止，不关闭或迁移其他服务；记录情况并请求确认。
- 容器无法启动：保留日志和配置，不清理数据目录；先按固定版本官方文档诊断。
- 初始化或持久化失败：停止容器，保留数据目录副本，回到未初始化基线；不得通过删除无关 Docker 资源“重来”。
- 任意步骤出现敏感信息泄露：立即停止传播，撤销暴露的凭据，并在不记录凭据内容的前提下报告。

## 完成报告

报告应包含：固定版本/摘要、使用的 Compose 命令、端口与挂载路径、容器状态、持久化重启结果、未决问题和下一张可执行票。不得包含任何密钥或完整配置导出。
