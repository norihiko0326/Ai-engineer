# Kanban Task App - API ドキュメント

## ベース URL
```
http://localhost:8080
```

## タスク管理エンドポイント

### 1. すべてのタスクを取得
**リクエスト:**
```
GET /api/tasks
```

**レスポンス例:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "title": "タスク1",
      "description": "説明",
      "status": "TODO",
      "priority": 1,
      "dueDate": "2026-06-30T00:00:00",
      "createdAt": "2026-05-30T09:30:00",
      "updatedAt": "2026-05-30T09:30:00",
      "createdBy": "user1",
      "updatedBy": "user1"
    }
  ],
  "message": "タスク一覧の取得に成功しました"
}
```

### 2. タスク詳細を取得
**リクエスト:**
```
GET /api/tasks/{id}
```

**パラメータ:**
- `id` (path): タスク ID

**レスポンス例:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "title": "タスク1",
    "description": "説明",
    "status": "TODO",
    "priority": 1,
    "dueDate": "2026-06-30T00:00:00",
    "createdAt": "2026-05-30T09:30:00",
    "updatedAt": "2026-05-30T09:30:00",
    "createdBy": "user1",
    "updatedBy": "user1"
  },
  "message": "タスクの取得に成功しました"
}
```

### 3. タスクを作成
**リクエスト:**
```
POST /api/tasks
Content-Type: application/json

{
  "title": "新しいタスク",
  "description": "タスクの説明",
  "status": "TODO",
  "priority": 2,
  "dueDate": "2026-06-30T00:00:00",
  "createdBy": "user1"
}
```

**パラメータ:**
- `title` (required): タスクのタイトル
- `description` (optional): タスクの説明
- `status` (optional): ステータス（TODO, IN_PROGRESS, DONE）
- `priority` (optional): 優先度（1-5、デフォルト: 3）
- `dueDate` (optional): 期限日時
- `createdBy` (optional): 作成者

**レスポンス例:**
```json
{
  "status": "success",
  "data": {
    "id": 2,
    "title": "新しいタスク",
    "description": "タスクの説明",
    "status": "TODO",
    "priority": 2,
    "dueDate": "2026-06-30T00:00:00",
    "createdAt": "2026-05-30T09:35:00",
    "updatedAt": "2026-05-30T09:35:00",
    "createdBy": "user1",
    "updatedBy": null
  },
  "message": "タスクの作成に成功しました"
}
```

### 4. タスクを更新
**リクエスト:**
```
PUT /api/tasks/{id}
Content-Type: application/json

{
  "title": "更新されたタスク",
  "description": "更新された説明",
  "status": "IN_PROGRESS",
  "priority": 1,
  "dueDate": "2026-07-01T00:00:00",
  "updatedBy": "user2"
}
```

**パラメータ:**
- `id` (path): タスク ID
- その他は作成時と同じ

**レスポンス例:**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "title": "更新されたタスク",
    "description": "更新された説明",
    "status": "IN_PROGRESS",
    "priority": 1,
    "dueDate": "2026-07-01T00:00:00",
    "createdAt": "2026-05-30T09:30:00",
    "updatedAt": "2026-05-30T09:40:00",
    "createdBy": "user1",
    "updatedBy": "user2"
  },
  "message": "タスクの更新に成功しました"
}
```

### 5. タスクを削除
**リクエスト:**
```
DELETE /api/tasks/{id}
```

**パラメータ:**
- `id` (path): タスク ID

**レスポンス例:**
```json
{
  "status": "success",
  "data": null,
  "message": "タスクの削除に成功しました"
}
```

### 6. ステータス別にタスクを取得
**リクエスト:**
```
GET /api/tasks/status/{status}
```

**パラメータ:**
- `status` (path): ステータス（TODO, IN_PROGRESS, DONE）

**レスポンス例:**
```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "title": "進行中のタスク",
      "status": "IN_PROGRESS",
      ...
    }
  ],
  "message": "ステータス別タスク取得に成功しました"
}
```

## エラーレスポンス

### タスクが見つからない場合
**ステータスコード:** 404
```json
{
  "status": "error",
  "data": null,
  "message": "タスクが見つかりません"
}
```

### バリデーションエラー
**ステータスコード:** 400
```json
{
  "status": "error",
  "data": null,
  "message": "タイトルは必須です"
}
```

### その他のエラー
**ステータスコード:** 500
```json
{
  "status": "error",
  "data": null,
  "message": "サーバーエラーが発生しました"
}
```

## タスクステータス
- **TODO**: 未開始
- **IN_PROGRESS**: 進行中
- **DONE**: 完了

## 優先度
- **1**: 最高
- **2**: 高
- **3**: 中（デフォルト）
- **4**: 低
- **5**: 最低

## テスト例（curl）

```bash
# タスク一覧を取得
curl http://localhost:8080/api/tasks

# 新しいタスクを作成
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "テストタスク",
    "description": "これはテストです",
    "priority": 1,
    "createdBy": "user1"
  }'

# タスクを更新
curl -X PUT http://localhost:8080/api/tasks/1 \
  -H "Content-Type: application/json" \
  -d '{
    "title": "更新されたテストタスク",
    "status": "IN_PROGRESS",
    "updatedBy": "user1"
  }'

# タスクを削除
curl -X DELETE http://localhost:8080/api/tasks/1
```
