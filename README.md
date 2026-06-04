# Kanban Task Board

シンプルで使いやすいタスク管理 Kanban ボードアプリケーションです。Trello 風のインターフェースで、タスクを 3 つのステータス（TODO → IN_PROGRESS → DONE）で効率的に管理できます。

## 機能

### ✅ タスク管理

- **タスク作成**: タイトル、説明、優先度（高・中・低）を指定してタスクを作成
- **ステータス管理**: TODO、IN_PROGRESS、DONE の 3 つのステータスでタスク状態を管理
- **タスク削除**: 不要なタスクを削除（確認ダイアログ付き）物理削除対応

### 🔍 検索機能

- タスクタイトルをキーワード検索
- リアルタイムフィルタリング（デバウンス処理実装）

### 🎯 フィルタリング

- ステータス別フィルター（TODO、IN_PROGRESS、DONE）
- ステータスと検索を組み合わせた絞り込み

### 🎨 ドラッグ&ドロップ

- タスクカードをドラッグしてステータス間で移動
- タスク順序の自動管理

## 技術スタック

### フロントエンド

- **フレームワーク**: React 18 + TypeScript
- **UI ライブラリ**: Material-UI (MUI)
- **ビルドツール**: Vite
- **状態管理**: React Context API
- **HTTP クライアント**: Axios

### バックエンド

- **言語**: Java
- **フレームワーク**: Spring Boot
- **データベース**: PostgreSQL
- **ORM**: JPA/Hibernate

### インフラ

- **コンテナ化**: Docker
- **オーケストレーション**: Docker Compose

## セットアップ

### 必要な環境

- Docker
- Docker Compose

### クイックスタート

```bash
cd kanban-task-app
docker-compose up --build
```

起動後、ブラウザで以下にアクセス：

```
http://localhost:5173
```

## API エンドポイント

### タスク操作

| メソッド | エンドポイント | 説明 |
| --- | --- | --- |
| GET | `/api/tasks` | 全タスク取得 |
| GET | `/api/tasks/{id}` | 特定タスク取得 |
| GET | `/api/tasks/status/{status}` | ステータス別タスク取得 |
| GET | `/api/tasks/search?keyword=...` | タスク検索 |
| POST | `/api/tasks` | タスク作成 |
| PUT | `/api/tasks/{id}` | タスク更新 |
| DELETE | `/api/tasks/{id}` | タスク削除 |
| PUT | `/api/tasks/bulk/update-status-and-order` | 複数タスク一括更新 |

## 使用方法

### タスク作成

1. 「タスク追加」ボタンをクリック
2. タイトル、説明、優先度を入力
3. 「作成」ボタンで保存

### タスク削除

1. 削除したいタスクカードの右上の削除ボタン（🗑️）をクリック
2. 確認ダイアログで「削除」を選択
3. タスクが削除されます

### タスク移動（ドラッグ&ドロップ）

1. タスクカードをドラッグ
2. 別のステータスレーンにドロップ
3. タスクがステータスと順序で更新されます

### タスク検索

1. 検索バーにキーワードを入力
2. リアルタイムで該当タスクがフィルタリングされます

## ポート設定

| サービス | ポート | 説明 |
| --- | --- | --- |
| React 開発サーバー | 5173 | フロントエンド |
| Spring Boot API | 8080 | バックエンド |
| PostgreSQL | 5432 | データベース |

## 開発

### フロントエンド開発

```bash
cd kanban-task-app/frontend
npm install
npm run dev
```

### バックエンド開発

```bash
cd kanban-task-app/backend
# Gradle でビルド
./gradlew build

# Spring Boot で実行
./gradlew bootRun
```

## トラブルシューティング

### ポート競合エラー

ポート 5173 または 8080 が既に使用されている場合：

```powershell
# Windows (PowerShell)
Get-NetTCPConnection -LocalPort 8080 -ErrorAction SilentlyContinue | 
  ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }

Get-NetTCPConnection -LocalPort 5173 -ErrorAction SilentlyContinue | 
  ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }
```

### コンテナログ確認

```bash
docker-compose logs -f frontend   # フロントエンドログ
docker-compose logs -f backend    # バックエンドログ
docker-compose logs -f postgres   # データベースログ
```

## ライセンス

MIT License

## 更新履歴

### v1.0.0 (2026-06-04)

- ✅ タスク作成機能
- ✅ タスク検索機能
- ✅ ドラッグ&ドロップでステータス・順序更新
- ✅ **タスク削除機能（新規追加）**
