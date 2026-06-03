# Kanban Task App セットアップガイド

## 概要
このドキュメントでは、Kanban タスク管理アプリを PostgreSQL データベースと共に Docker で起動する手順を説明します。

## 前提条件
- Docker デスクトップ（またはDocker Engine）
- Docker Compose
- git
- Windows 10/11 または macOS / Linux

## ディレクトリ構成
```
kanban-task-app/
├── backend/                              # Spring Boot バックエンド
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/taskapp/
│   │   │   │   ├── controller/           # REST コントローラー
│   │   │   │   ├── service/              # ビジネスロジック
│   │   │   │   ├── repository/           # データアクセス
│   │   │   │   ├── entity/               # JPA エンティティ
│   │   │   │   ├── dto/                  # DTO
│   │   │   │   ├── exception/            # カスタム例外
│   │   │   │   ├── config/               # 設定クラス
│   │   │   │   └── util/                 # ユーティリティ
│   │   │   └── resources/
│   │   │       ├── application.yml       # Spring Boot 設定
│   │   │       └── db/migration/         # Flyway マイグレーション
│   │   └── test/                         # ユニットテスト
│   ├── pom.xml                           # Maven 設定
│   ├── Dockerfile                        # Docker イメージビルド定義
│   └── API_DOCUMENTATION.md              # API ドキュメント
├── docker-compose.yml                    # Docker Compose 定義
└── SETUP_GUIDE.md                        # このファイル
```

## クイックスタート

### 1. リポジトリをクローン
```bash
git clone https://github.com/norihiko0326/Ai-engineer.git
cd "Ai-engineer/kanban-task-app"
```

### 2. Docker Compose で起動
```bash
docker-compose up --build
```

### 3. アプリケーションにアクセス
- **バックエンド API**: http://localhost:8080
- **ヘルスチェック**: http://localhost:8080/health

## Docker Compose 構成

### PostgreSQL サービス
```yaml
- イメージ: postgres:16-alpine
- ポート: 5432
- ユーザー: kanban_user
- パスワード: kanban_password
- データベース: kanban_db
- ボリューム: postgres_data
```

### バックエンド サービス
```yaml
- ポート: 8080
- 環境変数: Spring Boot 設定
- 依存関係: PostgreSQL のヘルスチェック完了まで待機
```

## 設定ファイル

### application.yml
`backend/src/main/resources/application.yml` で、Spring Boot の設定を行います：

```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/kanban_db
    username: kanban_user
    password: kanban_password
    
  jpa:
    hibernate:
      ddl-auto: update
    database-platform: org.hibernate.dialect.PostgreSQLDialect
    
  flyway:
    enabled: true
    locations: classpath:db/migration
```

### docker-compose.yml
`docker-compose.yml` で、Docker イメージとサービスを定義します。

## データベース マイグレーション

Flyway を使用してデータベーススキーマを管理します。

### マイグレーションファイルの場所
```
backend/src/main/resources/db/migration/
```

### マイグレーションファイルの命名規則
```
V1__initial_schema.sql
V2__add_new_column.sql
```

## よくある操作

### コンテナの起動
```bash
docker-compose up -d
```

### コンテナの停止
```bash
docker-compose down
```

### ログの確認
```bash
# 全サービスのログ
docker-compose logs -f

# バックエンドのログのみ
docker-compose logs -f kanban_backend

# PostgreSQL のログのみ
docker-compose logs -f kanban_postgres
```

### データベースへの直接接続
```bash
docker exec -it kanban_postgres psql -U kanban_user -d kanban_db
```

### イメージの再ビルド
```bash
docker-compose up --build
```

### 全データを削除（リセット）
```bash
docker-compose down -v
```

## トラブルシューティング

### ポート競合エラー
**エラーメッセージ:**
```
bind: Only one usage of each socket address is normally permitted
```

**解決策:**
```bash
# 既存のプロセスを確認
netstat -ano | findstr :8080

# プロセスを終了
taskkill /PID <PID> /F
```

### PostgreSQL 接続エラー
**ログに表示:**
```
Unable to resolve name as strategy [org.hibernate.dialect.PostgreSQL10Dialect]
```

**解決策:**
- Hibernate 6+ を使用する場合は、`PostgreSQLDialect` を使用してください
- `PostgreSQL10Dialect` は廃止されています

### ビルドエラー
**解決策:**
1. Docker イメージキャッシュをクリア：
```bash
docker system prune -a
```

2. 再度ビルド：
```bash
docker-compose up --build
```

## API テスト

### cURL でのテスト例

```bash
# タスク一覧を取得
curl http://localhost:8080/api/tasks

# 新しいタスクを作成
curl -X POST http://localhost:8080/api/tasks \
  -H "Content-Type: application/json" \
  -d '{
    "title": "テストタスク",
    "description": "テストの説明",
    "priority": 1,
    "createdBy": "user1"
  }'
```

詳細は [API_DOCUMENTATION.md](backend/API_DOCUMENTATION.md) を参照してください。

## パフォーマンスチューニング

### PostgreSQL メモリ設定
`docker-compose.yml` で以下を追加：
```yaml
services:
  postgres:
    environment:
      POSTGRES_INITDB_ARGS: "-c shared_buffers=256MB -c max_connections=100"
```

### JVM ヒープサイズ設定
環境変数で設定：
```bash
export JAVA_OPTS="-Xms512m -Xmx1024m"
```

## セキュリティ設定

### 本番環境の推奨事項
1. 強力なパスワードを設定
2. SSL/TLS を有効化
3. ファイアウォールで必要なポートのみを開放
4. 定期的なバックアップを実施
5. ログ監視を設定

## バックアップとリカバリ

### PostgreSQL のバックアップ
```bash
docker exec kanban_postgres pg_dump -U kanban_user kanban_db > backup.sql
```

### バックアップからのリストア
```bash
docker exec -i kanban_postgres psql -U kanban_user kanban_db < backup.sql
```

## 次のステップ

1. フロントエンド（React など）の構築
2. 認証・認可機能の追加
3. ロギング・監視の実装
4. CI/CD パイプラインの構築
5. 本番環境へのデプロイ

## サポート

問題が発生した場合は、以下を確認してください：

1. Docker と Docker Compose がインストール済みか
2. ポート 5432 と 8080 が使用可能か
3. ログに詳細なエラーメッセージがないか
4. Docker ディスク容量が十分か

## ライセンス
このプロジェクトは MIT ライセンスの下で公開されています。
