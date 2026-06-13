# 🔍 Terraform 品質チェック・ガイド

本ドキュメントでは、Terraform コードの品質を確保するための チェック項目とツール、実行手順を記載しています。

---

## 📋 目次

1. [品質チェック項目](#品質チェック項目)
2. [チェックツール](#チェックツール)
3. [実行手順](#実行手順)
4. [ベストプラクティス](#ベストプラクティス)
5. [チェックリスト](#チェックリスト)

---

## 品質チェック項目

### 1️⃣ 構文チェック（Terraform Validate）

```bash
terraform validate
```

**チェック内容：**
- HCL 構文の正確性
- 必須パラメータの存在確認
- リソースタイプの正確性
- 変数参照の正確性

**期待される出力：**
```
Success! The configuration is valid.
```

### 2️⃣ フォーマッティングチェック（Terraform Format）

```bash
terraform fmt -check -recursive
```

**チェック内容：**
- インデント・スペーシングの統一
- ブレース・括弧の配置
- コード見栄えの統一

**期待される出力：**
```
All files formatted successfully.
```

### 3️⃣ セキュリティスキャン（tfsec）

```bash
tfsec .
```

**チェック内容：**
- AWS セキュリティベストプラクティス違反
- 暗号化設定の確認
- ネットワークセキュリティ設定
- IAM パーミッション設定

**期待される出力：**
```
passed checks: X
failed checks: 0
warnings: Y
```

### 4️⃣ コスト推定（Terraform Plan + Cost Analysis）

```bash
terraform plan -out=tfplan
```

**チェック内容：**
- 無料枠での料金推定
- リソース数確認
- 予期しないリソース作成の検出

**期待される出力：**
```
Plan: X to add, 0 to change, 0 to destroy
```

### 5️⃣ コード品質チェック（TFLint）

```bash
tflint
```

**チェック内容：**
- 未使用の変数検出
- 推奨されない リソース属性
- AWS リージョン指定の確認
- ネーミング規則の統一

**期待される出力：**
```
X rule(s) found
```

### 6️⃣ ドキュメント整合性チェック

**チェック内容：**
- 変数説明の完全性
- 出力値説明の完全性
- リソース説明コメントの有無
- terraform.tfvars.example と実装の一致

---

## チェックツール

### Terraform CLI（組み込み）

```bash
# インストール不要（Terraform 付属）

# 1. 構文チェック
terraform validate

# 2. フォーマット確認
terraform fmt -check -recursive

# 3. フォーマット自動修正
terraform fmt -recursive
```

### tfsec（セキュリティスキャン）

```bash
# インストール
# Windows (Chocolatey)
choco install tfsec

# macOS (Homebrew)
brew install tfsec

# Linux
wget https://github.com/aquasecurity/tfsec/releases/download/v1.28.0/tfsec-linux-amd64
chmod +x tfsec-linux-amd64
sudo mv tfsec-linux-amd64 /usr/local/bin/tfsec

# 実行
tfsec . --minimum-severity HIGH
```

### TFLint（コード品質チェック）

```bash
# インストール
# Windows (Chocolatey)
choco install tflint

# macOS (Homebrew)
brew install tflint

# Linux
curl -s https://raw.githubusercontent.com/terraform-linters/tflint/master/install_linux.sh | bash

# 実行
tflint
tflint --init  # ルール初期化
```

### Terraform Cost Estimation

```bash
# terraform plan で見積もり
terraform plan -out=tfplan

# 外部ツール: Infracost（オプション）
# インストール
choco install infracost

# 実行
infracost breakdown --path tfplan
```

---

## 実行手順

### 初回セットアップ

```bash
cd terraform-deploy

# 1. Terraform 初期化
terraform init

# 2. tfsec インストール確認
tfsec --version

# 3. TFLint インストール確認
tflint --version

# 4. TFLint ルール初期化
tflint --init
```

### 定期チェック実行（推奨: 開発・デプロイ前）

```bash
cd terraform-deploy

# チェック実行スクリプト（以下を実行）
bash quality-check.sh
```

### 個別チェック実行

```bash
# 1. 構文チェック
terraform validate

# 2. フォーマット確認
terraform fmt -check -recursive

# 3. フォーマット修正
terraform fmt -recursive

# 4. セキュリティスキャン（HIGH 以上のみ）
tfsec . --minimum-severity HIGH

# 5. コード品質チェック
tflint

# 6. 計画実行（ドライラン）
terraform plan -var-file="credentials.tfvars"
```

---

## ベストプラクティス

### 命名規則

```hcl
# リソース命名
resource "aws_instance" "kanban_app_server" {
  # ✅ 小文字とアンダースコア使用
}

# 変数命名
variable "instance_type" {
  # ✅ 小文字とアンダースコア使用
}

# ローカル変数命名
locals {
  common_tags = {
    # ✅ キャメルケース使用
  }
}
```

### コメント

```hcl
# ブロックコメント（セクション区切り）
# ============================================================================
# EC2 インスタンス
# ============================================================================

# インラインコメント（1 行説明）
instance_type = "t3.micro"  # インスタンスタイプ（無料枠対象）
```

### セキュリティベストプラクティス

```hcl
# ✅ センシティブ情報は変数で外部化
variable "db_password" {
  description = "RDS マスターパスワード"
  type        = string
  sensitive   = true  # 出力を隠す
}

# ✅ credentials.tfvars は .gitignore に登録
# .gitignore に含める: credentials.tfvars, terraform.tfstate

# ✅ セキュリティグループで最小限のアクセス
security_group_ingress {
  from_port   = 22
  to_port     = 22
  protocol    = "tcp"
  cidr_blocks = ["203.0.113.0/32"]  # 特定 IP のみ
}

# ✅ RDS はパブリックアクセス無効
publicly_accessible = false

# ✅ 暗号化を有効化
storage_encrypted = true
```

### ドキュメント

```hcl
# 変数の説明を必ず記載
variable "instance_type" {
  description = "EC2 インスタンスタイプ（無料枠：t3.micro）"
  type        = string
  default     = "t3.micro"
}

# 出力値の説明
output "ec2_public_ip" {
  description = "EC2 インスタンスのパブリック IP アドレス"
  value       = aws_instance.kanban_app.public_ip
}
```

### モジュール化

```hcl
# ❌ 避けるべき: 大きな main.tf に全て書く
# ✅ 推奨: モジュール分割

terraform/
├── main.tf              # メイン
├── variables.tf         # 変数定義
├── outputs.tf          # 出力定義
└── modules/
    ├── ec2/            # EC2 モジュール
    │   ├── main.tf
    │   ├── variables.tf
    │   └── outputs.tf
    └── rds/            # RDS モジュール
        ├── main.tf
        ├── variables.tf
        └── outputs.tf
```

---

## チェックリスト

### デプロイ前チェック

```yaml
構文・フォーマット：
  - [ ] terraform validate でエラーなし
  - [ ] terraform fmt -check でフォーマット OK
  - [ ] コメントが適切に記載されている
  - [ ] 変数説明が記載されている

セキュリティ：
  - [ ] tfsec でセキュリティエラーなし
  - [ ] credentials.tfvars が .gitignore に登録
  - [ ] terraform.tfstate が .gitignore に登録
  - [ ] パスワード・キーが センシティブ変数
  - [ ] セキュリティグループが最小権限設定
  - [ ] RDS パブリックアクセス = false
  - [ ] ストレージ暗号化 = true

コード品質：
  - [ ] TFLint でエラーなし
  - [ ] リソース名が命名規則に従っている
  - [ ] 変数名が命名規則に従っている
  - [ ] 未使用の変数がない
  - [ ] タグが適切に設定されている

計画・見積もり：
  - [ ] terraform plan で期待通りのリソース作成
  - [ ] 無料枠内での リソース数確認
  - [ ] 予期しないリソース作成がない
  - [ ] コスト推定が妥当

ドキュメント：
  - [ ] terraform.tfvars.example が最新
  - [ ] INFRASTRUCTURE.md が実装と一致
  - [ ] README.md にデプロイ手順が記載
  - [ ] コメント説明が十分
```

### 本番デプロイ前最終チェック

```yaml
全般：
  - [ ] 全てのコードレビューが完了
  - [ ] テスト環境での動作確認完了
  - [ ] 本番設定値で terraform plan 実行
  - [ ] 変更影響範囲の確認

バックアップ・ロールバック：
  - [ ] 既存 terraform.tfstate がバックアップされている
  - [ ] ロールバック手順が文書化されている
  - [ ] AWS RDS スナップショット取得完了

通知・報告：
  - [ ] チームに デプロイ予定を通知
  - [ ] デプロイ中断・トラブル時の連絡先確認
  - [ ] デプロイ完了後の動作確認手順を確認
```

---

## 自動チェックスクリプト

### quality-check.sh（Linux/macOS）

```bash
#!/bin/bash

set -e

echo "🔍 Terraform 品質チェック開始..."
echo "=================================="

# 1. 構文チェック
echo "✓ 構文チェック中..."
terraform validate

# 2. フォーマット確認
echo "✓ フォーマットチェック中..."
terraform fmt -check -recursive || {
  echo "❌ フォーマットエラー"
  echo "修正: terraform fmt -recursive"
  exit 1
}

# 3. セキュリティスキャン
echo "✓ セキュリティスキャン中..."
if command -v tfsec &> /dev/null; then
  tfsec . --minimum-severity HIGH || {
    echo "❌ セキュリティエラーあり"
    exit 1
  }
else
  echo "⚠️  tfsec がインストールされていません"
fi

# 4. コード品質チェック
echo "✓ コード品質チェック中..."
if command -v tflint &> /dev/null; then
  tflint || {
    echo "❌ Linting エラーあり"
    exit 1
  }
else
  echo "⚠️  tflint がインストールされていません"
fi

# 5. Plan 実行
echo "✓ 計画実行中..."
terraform plan -out=tfplan || {
  echo "❌ Plan エラー"
  exit 1
}

echo ""
echo "=================================="
echo "✅ 全てのチェックが完了しました！"
echo "=================================="
```

### quality-check.ps1（Windows PowerShell）

```powershell
# Terraform 品質チェック（PowerShell）

Write-Host "🔍 Terraform 品質チェック開始..." -ForegroundColor Cyan
Write-Host "==================================" -ForegroundColor Cyan

# 1. 構文チェック
Write-Host "✓ 構文チェック中..." -ForegroundColor Yellow
terraform validate
if ($LASTEXITCODE -ne 0) {
  Write-Host "❌ 構文エラー" -ForegroundColor Red
  exit 1
}

# 2. フォーマット確認
Write-Host "✓ フォーマットチェック中..." -ForegroundColor Yellow
terraform fmt -check -recursive
if ($LASTEXITCODE -ne 0) {
  Write-Host "❌ フォーマットエラー" -ForegroundColor Red
  Write-Host "修正: terraform fmt -recursive" -ForegroundColor Yellow
  exit 1
}

# 3. セキュリティスキャン
Write-Host "✓ セキュリティスキャン中..." -ForegroundColor Yellow
if (Get-Command tfsec -ErrorAction SilentlyContinue) {
  tfsec . --minimum-severity HIGH
  if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ セキュリティエラーあり" -ForegroundColor Red
    exit 1
  }
} else {
  Write-Host "⚠️  tfsec がインストールされていません" -ForegroundColor Yellow
}

# 4. コード品質チェック
Write-Host "✓ コード品質チェック中..." -ForegroundColor Yellow
if (Get-Command tflint -ErrorAction SilentlyContinue) {
  tflint
  if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Linting エラーあり" -ForegroundColor Red
    exit 1
  }
} else {
  Write-Host "⚠️  tflint がインストールされていません" -ForegroundColor Yellow
}

# 5. Plan 実行
Write-Host "✓ 計画実行中..." -ForegroundColor Yellow
terraform plan -out=tfplan
if ($LASTEXITCODE -ne 0) {
  Write-Host "❌ Plan エラー" -ForegroundColor Red
  exit 1
}

Write-Host ""
Write-Host "==================================" -ForegroundColor Cyan
Write-Host "✅ 全てのチェックが完了しました！" -ForegroundColor Green
Write-Host "==================================" -ForegroundColor Cyan
```

---

## 参考資料

- [Terraform 公式ドキュメント](https://www.terraform.io/docs)
- [tfsec - Terraform セキュリティスキャナ](https://aquasecurity.github.io/tfsec/)
- [TFLint - Terraform Linter](https://github.com/terraform-linters/tflint)
- [AWS ベストプラクティス](https://docs.aws.amazon.com/ja_jp/aws-technical-content/)
