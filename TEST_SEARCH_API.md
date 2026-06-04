# 検索 API テストスクリプト

## 前置条件
- Docker コンテナが全て起動している（`docker ps` で確認）
- バックエンド: http://localhost:8080
- フロント: http://localhost:5173

## API テスト

### 1. ヘルスチェック
```powershell
curl "http://localhost:8080/health"
```

**期待結果**:
```json
{"status":"UP"}
```

---

### 2. 全タスク取得
```powershell
curl "http://localhost:8080/api/tasks" | ConvertFrom-Json | Select-Object -First 3 | Format-Table
```

**期待結果**: 10個のタスク JSON 配列

---

### 3. 検索 API テスト（新機能）

#### キーワード: "認証"（日本語）
```powershell
$keyword = [System.Web.HttpUtility]::UrlEncode("認証")
curl "http://localhost:8080/api/tasks/search?keyword=$keyword"
```

**期待結果**: 
```json
[
  {
    "id": 1,
    "title": "ユーザー認証機能の実装",
    "status": "IN_PROGRESS",
    "priority": 1
  }
]
```

#### キーワード: "development"（英語）
```powershell
curl "http://localhost:8080/api/tasks/search?keyword=development"
```

**期待結果**: 
```json
[
  {
    "id": 3,
    "title": "フロントエンドの開発",
    "status": "TODO",
    "priority": 2
  }
]
```

---

### 4. ステータスフィルター
```powershell
curl "http://localhost:8080/api/tasks/status/TODO"
```

**期待結果**: TODO ステータスのタスク一覧

---

## フロント UI テスト

### 1. ブラウザアクセス
```
http://localhost:5173
```

### 2. 検索機能テスト
1. 検索バーに「認証」と入力
2. 400ms 後に検索結果が表示される
3. ブラウザ DevTools (F12) → Network タブで以下を確認:
   - `GET /api/tasks/search?keyword=認証`

### 3. ステータスフィルター + 検索
1. 検索バーに「フロント」と入力
2. ステータスセレクトを「TODO」に変更
3. 「フロントエンド開発」が TODO 列に表示される

### 4. クリア動作
1. 検索テキストを削除
2. 全タスクが表示される
3. Network タブで `GET /api/tasks` が呼ばれたことを確認

---

## トラブルシューティング

### Docker コンテナが起動していない
```powershell
docker ps -a
docker logs kanban_backend
docker logs kanban_frontend
```

### ポートが使用中の場合
```powershell
Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue
```

### API が 500 エラー
バックエンドログを確認:
```powershell
docker logs kanban_backend | Select-String -Pattern "error|ERROR|Exception"
```

---

## 成功の合図

✅ 全テストが成功したら：

1. Git で変更をコミット
   ```powershell
   cd "c:\AI Engineering Course\kanban-task-app"
   git add docker-compose.yml frontend/Dockerfile
   git commit -m "[Infra] Docker Compose にフロント サービス追加"
   ```

2. PR にテスト結果をコメント
