---
name: Terraform Quality Check
description: Terraform コードの品質をチェック（構文・フォーマット・セキュリティ・コスト）
---

# Terraform Quality Check Skill

Terraform コードの品質を確保するための包括的なチェックを実行するスキルです。

## 対応するチェック項目

### 1. 構文チェック (Terraform Validate)
- HCL 構文の正確性
- 必須パラメータの確認
- リソースタイプの正確性

### 2. フォーマット確認 (Terraform Format)
- インデント・スペーシングの統一
- コード見栄えの統一

### 3. セキュリティスキャン (tfsec)
- AWS セキュリティベストプラクティス違反
- 暗号化・ネットワークセキュリティ設定

### 4. コード品質チェック (TFLint)
- 未使用変数の検出
- ネーミング規則の確認

### 5. 計画実行 (Terraform Plan)
- リソース作成計画の確認
- コスト見積もり

## 実行方法

```bash
# 単独チェック実行
terraform validate
terraform fmt -check -recursive
tfsec .
tflint
terraform plan -var-file="credentials.tfvars"

# または、スキル実行（自動チェック）
/terraform-quality-check
```

## 出力結果の確認

チェックが全て成功した場合：
```
✅ 全てのチェックが完了しました！
```

エラーがある場合は該当箇所を表示して修正指示を行います。

## トラブルシューティング

### tfsec がインストールされていない場合
```bash
# Windows (Chocolatey)
choco install tfsec

# macOS (Homebrew)
brew install tfsec
```

### TFLint がインストールされていない場合
```bash
# Windows (Chocolatey)
choco install tflint

# macOS (Homebrew)
brew install tflint
```

## 参考資料

- [TERRAFORM_QUALITY_CHECKLIST.md](../../terraform-deploy/TERRAFORM_QUALITY_CHECKLIST.md) - 詳細ガイド
- [Terraform 公式ドキュメント](https://www.terraform.io/docs)
- [tfsec 公式ドキュメント](https://aquasecurity.github.io/tfsec/)
- [TFLint 公式ドキュメント](https://github.com/terraform-linters/tflint)
