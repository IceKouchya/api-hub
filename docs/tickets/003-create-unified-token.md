# 003：创建统一 New API Token 与最小客户端接入

- **状态：** `ready-for-agent`
- **依赖：** 002 至少一个渠道和 `chat-general` 已验证
- **后续解锁：** 004 验证局域网客户端
- **执行角色：** 独立配置窗口；Token 值由修本人保管

## 目标

在 New API 中创建供修本人自有设备使用的统一访问 Token，定义最小客户端接入方式，并确保任何客户端都不再直接保存上游 API Key 或供应商特定 Base URL。

## 开始前必读

1. [Overview.md](../Overview.md)
2. [CONTEXT.md](../CONTEXT.md)
3. 002 渠道配置完成报告。
4. New API 当前版本的 Token、权限与模型访问文档。

## 允许修改范围

- New API 后台内与个人客户端 Token、模型权限相关的配置。
- 修本人控制的一个最小测试客户端或本机受控请求配置。
- `D:\Agent-Codex\projects\api-hub\` 的 `.gitignore` 和脱敏示例文件。
- 本项目 Vault 中不含 Token 值的接入说明和验证记录。

## 禁止修改范围

- 不将 Token 明文写入 Markdown、Canvas、Git、截图、命令历史、共享剪贴板或普通环境文件。
- 不把上游 API Key 复制给客户端。
- 不创建公开匿名 Token、长期无限权限 Token 或给未知设备分发的 Token。
- 不修改 Workbench、其他项目、上游渠道真实凭据或无关网络规则。

## 实施步骤

1. 明确首批使用设备。默认先创建一个个人主 Token；若后续需要区分撤销与审计，再按设备创建独立 Token。不要为了“可能有一天需要”先生成一把 Token 钥匙串。
2. 在 New API 后台创建 Token，并以不包含值的名称标注用途，例如 `personal-lan-primary`。
3. 若当前版本支持模型、额度、有效期或权限限制，按已验证需求授予最小必要范围；不猜测不熟悉的权限项。
4. Token 值只在修本人可控密码管理器、受控客户端配置或当前安全输入界面中保存。执行窗口不得请求或回显该值。
5. 创建脱敏客户端示例：

```text
Base URL: http://<Windows-LAN-IP>:3000/v1
Authorization: Bearer <NEW_API_TOKEN>
Model: chat-general
```

6. 从本机进行一次最小非流式对话调用，确认请求通过 New API Token 鉴权且实际落到已验证渠道。
7. 确认客户端配置中不存在上游域名和上游 API Key；必要时搜索项目目录与示例文本，确认无敏感值被误写。
8. 为 Token 撤销/轮换写下最短操作路径：在 New API 后台撤销旧 Token，创建新 Token，更新受控客户端配置并重新验证。

## 验收标准

1. 至少一个 New API Token 可经统一 `/v1` 入口成功调用 `chat-general`。
2. Token 值不出现在任何项目文本、版本控制、Canvas、聊天消息或执行报告中。
3. 客户端仅配置统一 Base URL、New API Token 和统一模型名。
4. 客户端没有保存上游 Base URL、上游 API Key 或真实模型 ID。
5. Token 可在后台单独撤销，不影响上游渠道配置。
6. 已记录不包含敏感值的轮换步骤。

## 失败处理与回滚

- 鉴权失败：核对 Token 状态、权限、Base URL 与模型访问范围；不把 Token 粘贴进日志排查。
- Token 意外泄露：立刻撤销该 Token，创建替代 Token，并只记录“泄露后已撤销和轮换”。
- 客户端仍依赖上游配置：停止接入，将其改回统一入口模型；不得把两套凭据同时长期保留。
- 权限范围不明确：采用最小可用权限或暂停，先查当前版本官方文档。

## 完成报告

报告只记录 Token 代号、授予的脱敏权限范围、验证设备类别、调用结果、是否完成客户端上游凭据清理和轮换路径。不得写入 Token 内容。
