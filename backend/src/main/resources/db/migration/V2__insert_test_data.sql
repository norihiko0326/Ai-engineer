INSERT INTO tasks (title, description, status, priority, created_by, created_at, updated_at) VALUES
('ユーザー認証機能の実装', 'ログインとサインアップの機能を実装する', 'IN_PROGRESS', 1, 'user1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('データベース設計', 'Kanbanボードのデータベーススキーマを設計する', 'IN_PROGRESS', 1, 'user2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('フロントエンドの開発', 'React UIコンポーネントの開発', 'TODO', 2, 'user1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ドラッグ&ドロップ機能', 'タスク移動のドラッグ&ドロップ実装', 'TODO', 1, 'user3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('テスト作成', 'ユニットテストとインテグレーションテスト', 'TODO', 2, 'user2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('デプロイメント設定', 'Docker と kubernetes の設定', 'DONE', 3, 'user1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('ドキュメント作成', 'APIドキュメントの作成', 'DONE', 3, 'user3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('パフォーマンス最適化', 'クエリのチューニング', 'IN_PROGRESS', 2, 'user2', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('キャッシング実装', 'Redisを使用したキャッシング', 'TODO', 2, 'user1', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP),
('セキュリティ対応', 'HTTPS と認証の強化', 'TODO', 1, 'user3', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);
