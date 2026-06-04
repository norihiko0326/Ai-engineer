# Docker 開発環境 スタートアップガイド

## 📋 前置条件

- ✅ Docker Desktop がインストール済み
- ✅ Docker Hub アカウント作成済み（無料）
- ✅ `docker login` でログイン完了

---

## 🚀 クイックスタート

### Step 1: Docker Hub にログイン（初回のみ）

```powershell
docker login
# ユーザー名とパスワードを入力
```

### Step 2: プロジェクトディレクトリに移動

```powershell
cd "c:\AI Engineering Course\kanban-task-app"
```

### Step 3: Docker Compose で起動

```powershell
docker-compose up --build
```

**初回**: ビルド＋起動（3～5分）
**2回目以降**: キャッシュを使用して高速起動（30秒～1分）

### Step 4: ブラウザでアクセス

```
http://localhost:5173
```

---

## 🛑 停止方法

```powershell
# ターミナルで Ctrl+C を押す
# または別ターミナルから

docker-compose down
```

---

## 🐳 Docker コンテナ構成

| サービス | ポート | 用途 |
|---|---|---|
| `postgres` | 5432 | PostgreSQL データベース |
| `backend` | 8080 | Spring Boot API サーバー |
| `frontend` | 5173 | React 開発サーバー |

---

## 📊 動作確認

### 1. バックエンド API テスト

```powershell
# ヘルスチェック
curl "http://localhost:8080/health"

# 全タスク取得
curl "http://localhost:8080/api/tasks" | ConvertFrom-Json | Format-Table
```

### 2. 新機能（検索 API）テスト

```powershell
# キーワード検索
curl "http://localhost:8080/api/tasks/search?keyword=authentication"
```

### 3. フロント UI テスト

1. `http://localhost:5173` にアクセス
2. 検索バーに「認証」と入力
3. 検索結果がボード画面に表示される ✅

---

## 🔍 ログ確認

```powershell
# バックエンドログ
docker logs kanban_backend -f

# フロントエンドログ
docker logs kanban_frontend -f

# PostgreSQL ログ
docker logs kanban_postgres -f

# 全サービスログ
docker-compose logs -f
```

---

## 🐛 トラブルシューティング

### コンテナが起動しない

```powershell
# コンテナの状態確認
docker ps -a

# ビルドエラー確認
docker-compose build --no-cache

# 完全リセット
docker-compose down -v
docker system prune -a
docker-compose up --build
```

### ポートが使用中

```powershell
# ポート使用状況確認
Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue
Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue

# プロセス停止
Stop-Process -Name "docker" -Force
docker-compose up --build
```

### API が 404 エラー

バックエンドが起動していることを確認:
```powershell
curl "http://localhost:8080/health"
```

ヘルスチェックが失敗したらログを確認:
```powershell
docker logs kanban_backend
```

---

## 📈 今後の開発

### コード変更後の再起動

フロントエンド（React）の変更は自動リロード対応です：
```powershell
# ファイル変更 → ブラウザ自動更新
```

バックエンド（Java）の変更は再ビルド必要：
```powershell
docker-compose down
docker-compose up --build
```

### 環境変数の管理

`.env` ファイルで環境変数を管理（今後追加可能）:
```env
VITE_API_BASE_URL=http://localhost:8080
SPRING_DATASOURCE_URL=jdbc:postgresql://postgres:5432/kanban_db
```

---

## ✅ チェックリスト

- [ ] Docker Desktop インストール済み
- [ ] Docker Hub でアカウント作成済み
- [ ] `docker login` でログイン済み
- [ ] `docker-compose up --build` で起動確認
- [ ] `http://localhost:5173` でフロント表示確認
- [ ] 検索機能が動作することを確認
- [ ] `docker-compose.yml` を git commit
- [ ] README.md に Docker 起動手順を記載

---

## 📚 参考資料

- [Docker 公式ドキュメント](https://docs.docker.com/)
- [Docker Compose 公式ドキュメント](https://docs.docker.com/compose/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
