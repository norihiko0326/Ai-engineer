---
name: Docker サーバー起動
description: Docker Compose で Kanban アプリケーションの全サービス（PostgreSQL、Spring Boot、React）を起動します
---

# Docker サーバー起動 skill

Docker Compose を使用して Kanban Task Board アプリケーションの全サービスを起動します。

## 対応するサービス

| サービス | ポート | 役割 |
|---|---|---|
| PostgreSQL | 5432 | データベース |
| Spring Boot | 8080 | バックエンド API |
| React (Vite) | 5173 | フロントエンド開発サーバー |

## 起動方法

プロジェクトディレクトリで以下を実行：

```bash
cd kanban-task-app
docker-compose up --build
```

### オプション

- `docker-compose up` - イメージが既に存在する場合（ビルドなし）
- `docker-compose up -d` - バックグラウンド起動
- `docker-compose down` - 全サービス停止・削除

## ブラウザアクセス

起動後、ブラウザで以下にアクセス：

```
http://localhost:5173
```

## トラブルシューティング

### ポート競合が発生した場合

既存プロセスを強制終了（PowerShell）：

```powershell
# ポート 8080
Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue | 
  ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }

# ポート 5173
Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | 
  ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

### コンテナ状態確認

```bash
docker ps          # 起動中のコンテナ
docker-compose logs # サービスログ
```

## 検索機能テスト

ボード起動後、SearchBar に「認証」と入力して検索機能が動作することを確認できます。
