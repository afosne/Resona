# Resona API 文档

## 🚀 快速开始

### Swagger UI 访问

启动开发服务器后，您可以通过以下地址访问 Swagger UI：

- **本地开发**: http://localhost:8787/docs
- **生产环境**: https://your-worker.your-subdomain.workers.dev/docs

### 直接访问 API

- **健康检查**: `GET /api/v1/health`
- **配置详情**: `GET /api/v1/config`
- **Swagger JSON**: `GET /api/v1/swagger.json`

## 📋 API 接口列表

### 1. 共鸣相关

#### 提交句子获取共鸣
- **接口**: `POST /api/v1/submit`
- **描述**: 用户提交一句话，系统分析情绪并返回共鸣回应
- **请求体**:
  ```json
  {
    "text": "我今天很难过"
  }
  ```
- **响应**:
  ```json
  {
    "success": true,
    "data": {
      "reflection": {
        "id": 123,
        "text": "我理解你的难过，一切都会好起来的",
        "emotion": "sad",
        "is_generated": false
      },
      "submission": {
        "id": 456,
        "emotion": "sad"
      }
    }
  }
  ```

### 2. 收藏相关

#### 收藏共鸣
- **接口**: `POST /api/v1/collect`
- **描述**: 收藏一条共鸣回应
- **请求体**:
  ```json
  {
    "reflection_id": 123
  }
  ```

#### 获取收藏列表
- **接口**: `GET /api/v1/collections`
- **描述**: 分页获取用户的收藏列表
- **参数**:
  - `page`: 页码（默认1）
  - `limit`: 每页数量（默认10，最大50）

#### 删除收藏
- **接口**: `DELETE /api/v1/collect`
- **描述**: 删除一条收藏记录
- **请求体**:
  ```json
  {
    "collection_id": 789
  }
  ```

### 3. 系统相关

#### 健康检查
- **接口**: `GET /api/v1/health`
- **描述**: 检查服务状态和AI配置
- **响应**:
  ```json
  {
    "status": "ok",
    "timestamp": "2024-01-01T12:00:00Z",
    "ai_config": {
      "services": [
        {
          "name": "OpenAI",
          "url": "https://new-api-latest-m4mh.onrender.com/v1",
          "model": "gpt-3.5-turbo",
          "configured": true
        }
      ],
      "total_services": 1,
      "primary_service": "OpenAI",
      "primary_model": "gpt-3.5-turbo"
    }
  }
  ```

#### 获取配置详情
- **接口**: `GET /api/v1/config`
- **描述**: 获取详细的系统配置信息

## 🔧 测试工具

### 使用 Swagger UI

1. 访问 http://localhost:8787/docs
2. 查看所有可用接口
3. 点击 "Try it out" 按钮
4. 填写请求参数
5. 点击 "Execute" 执行请求

### 使用 curl 测试

```bash
# 健康检查
curl http://localhost:8787/api/v1/health

# 提交句子
curl -X POST http://localhost:8787/api/v1/submit \
  -H "Content-Type: application/json" \
  -d '{"text": "我今天很开心"}'

# 获取收藏列表
curl http://localhost:8787/api/v1/collections?page=1&limit=10

# 获取配置详情
curl http://localhost:8787/api/v1/config
```

## 📊 错误码说明

| 状态码 | 说明 |
|--------|------|
| 200 | 成功 |
| 400 | 请求参数错误 |
| 404 | 资源不存在 |
| 409 | 冲突（如重复收藏） |
| 429 | 请求过于频繁 |
| 500 | 服务器内部错误 |

## 🔒 认证说明

所有 API 使用设备 ID Cookie 进行匿名认证：

```
Cookie: device_id=uuid-string
```

Swagger UI 会自动生成测试用的设备 ID。

## 🎯 使用示例

### 完整流程示例

1. **提交句子获取共鸣**
   ```bash
   curl -X POST http://localhost:8787/api/v1/submit \
     -H "Content-Type: application/json" \
     -d '{"text": "我感觉很孤独"}'
   ```

2. **收藏共鸣**
   ```bash
   curl -X POST http://localhost:8787/api/v1/collect \
     -H "Content-Type: application/json" \
     -d '{"reflection_id": 123}'
   ```

3. **查看收藏列表**
   ```bash
   curl http://localhost:8787/api/v1/collections
   ```

4. **删除收藏**
   ```bash
   curl -X DELETE http://localhost:8787/api/v1/collect \
     -H "Content-Type: application/json" \
     -d '{"collection_id": 789}'
   ```

## 🌟 特性

- **交互式文档**: Swagger UI 提供完整的交互式 API 文档
- **自动测试**: 可以直接在浏览器中测试 API
- **实时验证**: 自动验证请求参数和响应格式
- **设备 ID 管理**: 自动处理匿名用户标识
- **错误处理**: 详细的错误信息和状态码

## 📝 注意事项

1. 每个设备每分钟最多提交 3 次
2. 每个设备最多收藏 20 条共鸣
3. 文本长度限制 200 字
4. 分页查询每页最多 50 条
5. 所有时间戳使用 ISO 8601 格式 