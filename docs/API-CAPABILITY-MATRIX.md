# 第一阶段模型与协议能力矩阵

- **状态：** 已确认，待渠道级验证
- **适用范围：** New API 个人局域网 API Hub 第一阶段
- **权威范围：** [Overview.md](Overview.md)、[CONTEXT.md](CONTEXT.md)、[Plan.md](Plan.md)

## 决策

工具调用、视觉输入、推理控制、流式输出与 Embedding 都属于第一阶段实施和验收范围。项目不在网关层人为关闭模型和渠道已经支持的能力；只要具体模型、具体渠道和所选协议链路都支持，就应对客户端开放。

“待验证”仅表示尚未以真实渠道跑出证据，不表示项目策略禁止使用。反过来，“模型支持”也不是跨渠道自动成立的万能咒语：实际可用性取决于以下三项同时成立：

```text
New API 请求接口和版本
× 渠道类型或协议转换路径
× 上游模型、账户权限与实际实现
```

## 官方资料边界

- New API 的 Chat Completions 文档列出 `stream`、`tools`、`tool_choice`、`reasoning_effort` 等字段，响应模型包含 `tool_calls` 与 `reasoning_content`：<https://docs.newapi.pro/en/docs/api/ai-model/chat/openai/createchatcompletion>
- New API 将 Embeddings 定义为独立的 AI 模型接口；它使用独立模型和 `input`，不是聊天模型的附属参数：<https://docs.newapi.pro/en/docs/api/ai-model/embeddings/createembedding>
- New API 渠道可配置模型列表、Base URL、优先级、权重、模型映射和参数覆盖，并可单独测试：<https://docs.newapi.pro/en/docs/guide/feature-guide/admin/channel>
- 官方 README 明确列出 OpenAI Compatible 与 Claude Messages 的双向转换；同时标注 Google Gemini 转 OpenAI Compatible 为“仅文本，暂不支持 function calling”。因此协议转换路径不能一概视为完整透传：<https://github.com/QuantumNous/new-api>

## 渠道能力记录格式

每个公开模型路由都维护一份能力档案。真实上游 Key、完整敏感 URL 和账户信息不进入仓库；渠道代号与测试结果可脱敏记录在公开文档，完整本机记录放入被忽略的 `ops/channel-capabilities.local.md`。

| 维度 | 必填记录 | 通过条件 |
| --- | --- | --- |
| 路由 | 公开模型名、真实模型 ID、渠道代号、协议类型 | 映射与实际调用一致 |
| 文本对话 | 非流式 Chat Completions | 成功返回有效响应 |
| 流式 | 文本流式响应 | 片段顺序正确、正常结束 |
| 工具调用 | `tools`、`tool_choice`、返回 `tool_calls` | 非流式工具请求和工具选择正常 |
| 工具流式 | 流式 `tool_calls` 增量 | 参数片段可完整组装；无截断或字段丢失 |
| 视觉输入 | 图片内容块或模型要求的等效格式 | 模型实际理解测试图片并返回可验证结果 |
| 推理控制 | `reasoning_effort` 或该协议的等效参数 | 支持值被接受且行为/响应符合上游文档 |
| Embedding | `/v1/embeddings`、模型、维度、编码格式 | 返回非空向量；维度和向量空间符合预期 |
| 原生协议 | OpenAI、Claude、Gemini 或其他实际入口 | 对应协议的请求/响应与流式行为通过专门测试 |
| 备用渠道 | 与主渠道的能力与语义兼容性 | 仅在相同能力契约下允许接管 |

## 第一阶段验证矩阵

| 能力 | 默认策略 | 渠道级验证 | 主备要求 |
| --- | --- | --- | --- |
| 文本对话 | 开放 | 最小非流式请求 | 同一公开模型路由可接管 |
| 流式对话 | 开放 | `stream: true` 完整结束 | 两端流式语义一致；已输出内容不重放 |
| 工具调用 | 开放 | `tools`、`tool_choice`、`tool_calls` | 工具 schema、调用语义和流式增量均兼容 |
| 视觉输入 | 开放 | 真实图片内容块与已知答案测试 | 两端都接受相同图像格式与限制 |
| 推理控制 | 开放 | 模型支持的 `reasoning_effort` 或原生等效参数 | 两端支持相同或明确等价的控制语义 |
| Embedding | 开放，但走独立端点 | `/v1/embeddings`、维度、批量和编码格式 | 必须同一向量空间；不同 embedding 模型不能互为备用 |
| Claude / Gemini 等协议 | 按实际入口开放 | 每条转换/原生路径单独测试 | 不将文本兼容误当作工具或视觉兼容 |

## 已知例外与不该硬猜的地方

1. **Embedding 不等于聊天模型能力。** 即使一个聊天模型支持工具、视觉和推理，也不意味着同一渠道存在 Embedding 模型或 `/v1/embeddings` 支持。
2. **协议转换不是全功能等价。** 官方 README 已明确 Google Gemini 转 OpenAI Compatible 当前为文本模式，function calling 尚不支持。此类路径不应被放进工具调用备用链。
3. **纯 OpenAI 兼容中转通常可直接透传，但不是协议承诺。** 有些自定义渠道只实现聊天端点、过滤未知字段、缺少 Embeddings、改变图像载荷或遗漏流式工具调用增量。它们不是“不能用”，而是必须在实际路由上验证。
4. **推理参数与模型家族有关。** New API 能接受公开格式的 `reasoning_effort`，但具体上游是否接受、如何映射或是否采用原生 thinking 参数，取决于模型和渠道。
5. **工具调用可能有副作用。** 即使模型调用成功，在工具执行已经发生或流式输出已开始后，也不能为了容灾自动重放完整请求。
6. **备用不是模型名相同就成立。** 视觉格式、工具 schema、推理行为、上下文限制和向量空间都是能力契约的一部分。

## 验收规则

- 每个真实渠道先按本矩阵完成支持项测试；未支持或未验证项如实标记，绝不伪装为已通过。
- 对模型和渠道实际支持的能力，不加项目层禁用开关或人为降级。
- 向客户端公布的公开模型路由必须附带能力档案；客户端可据此选择工具、视觉、推理或 Embedding 调用方式。
- 只有通过同一能力契约验证的渠道才能互为备用。
- 版本升级、模型映射变更、渠道类型变更后，重新执行受影响能力的验证。

## 执行入口

- 渠道配置与能力矩阵录入：[002-configure-upstream-channels.md](tickets/002-configure-upstream-channels.md)
- 局域网真实客户端与主备验证：[004-verify-lan-client.md](tickets/004-verify-lan-client.md)
- 恢复后的能力回归：[005-backup-and-rollback.md](tickets/005-backup-and-rollback.md)
