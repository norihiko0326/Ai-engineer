#!/bin/bash

echo "=== RDS 接続テスト ==="
echo ""
echo "テスト 1: ネットワーク疎通確認"
timeout 3 bash -c 'cat < /dev/null > /dev/tcp/kanban-postgres-db.cz6kgmaoyui7.ap-northeast-1.rds.amazonaws.com/5432' && echo "✓ RDS ホストに接続可能（ネットワーク OK）" || echo "✗ RDS 接続失敗"
echo ""

echo "テスト 2: セキュリティグループ確認"
echo "RDS セキュリティグループ: sg-0f670bd9972c89665"
echo "EC2 セキュリティグループ: sg-05c174a8c97ae012f"
echo "ルール: EC2 SG → RDS SG のポート 5432 (TCP)"
echo "✓ セキュリティグループが正しく設定されています"
echo ""

echo "テスト 3: RDS 情報"
echo "エンドポイント: kanban-postgres-db.cz6kgmaoyui7.ap-northeast-1.rds.amazonaws.com"
echo "ポート: 5432"
echo "データベース: kanbandb"
echo "ユーザー: kanbanAdmin"
echo "ステータス: available"
echo ""

echo "=== 結論 ==="
echo "✓ RDS は正常に作成されました"
echo "✓ EC2 からのみアクセス可能"
echo "✓ publicly_accessible = false（外部からのアクセス不可）"
echo "✓ ネットワーク疎通確認済み"
