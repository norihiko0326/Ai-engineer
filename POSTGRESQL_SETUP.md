# PostgreSQL Docker セットアップガイド

## 概要
Kanban タスク管理アプリを PostgreSQL データベースを使用する Docker 環境で動作させるようにセットアップしました。

## 実装内容

### 1. Docker Compose 設定（docker-compose.yml）
- **PostgreSQL サービス**を追加
  - イメージ: `postgres:16-alpine`
  - ポート: 5432
  - ユーザー: `kanban_user`
  - パスワード: `kanban_password`
  - データベース: `kanban_db`
  - ヘルスチェック: 10 秒間隔で確認

- **バックエンド サービス**
  - PostgreSQL 接続設定
  - 依存性管理: PostgreSQL のヘルスチェック完了まで待機
  - Flyway マイグレーション有効化

### 2. Spring Boot 設定（application.yml）
```yaml
datasource:
  url: jdbc:postgresql://localhost:5432/kanban_db
  driverClassName: org.postgresql.Driver
  username: kanban_user
  password: kanban_password
  
jpa:
  hibernate:
    ddl-auto: update
  database-platform: org.hibernate.dialect.PostgreSQL10Dialect

flyway:
  enabled: true
  locations: classpath:db/migration
```

### 3. Dockerfile の更新
- Gradle から Maven への変更
- Maven を使用したビルドプロセス
- Java 21 対応

### 4. データベース マイグレーション
- Flyway マイグレーションスクリプトを作成
- 初期スキーマ（`V1__initial_schema.sql`）:
  - `tasks` テーブル
  - 複合インデックス（status, priority, created_at）

## 起動方法

```bash
cd c:\AI Engineering Course\kanban-task-app
docker-compose up --build
```

## 動作確認

### PostgreSQL への接続
```bash
docker exec -it kanban_postgres psql -U kanban_user -d kanban_db
```

### バックエンド API
```
http://localhost:8080
```

### ヘルスチェック
```bash
curl http://localhost:8080/health
```

## ボリューム設定
- `postgres_data`: PostgreSQL データの永続化

## 環境変数
Docker Compose で自動的に設定されます：
- `SPRING_DATASOURCE_URL`
- `SPRING_DATASOURCE_USERNAME`
- `SPRING_DATASOURCE_PASSWORD`
- `SPRING_JPA_HIBERNATE_DDL_AUTO`
- `SPRING_FLYWAY_ENABLED`

## トラブルシューティング

### PostgreSQL に接続できない場合
1. ヘルスチェックの完了を待機（5 回まで再試行）
2. PostgreSQL ログを確認：`docker logs kanban_postgres`

### マイグレーション失敗
1. マイグレーションファイルの構文確認
2. ファイル名のバージョン番号確認（`V1__`, `V2__` など）

### ポート競合
- PostgreSQL: 5432
- バックエンド: 8080

## 次のステップ
1. Task エンティティの定義
2. Repository インターフェースの実装
3. REST エンドポイントの作成
4. API テストの実行
