# 🚀 Terraform セットアップガイド（初心者向け・実践版）

**このガイドの目的：** AWS CLI インストール失敗時の代替手順を記録しています。  
**対象者：** Terraform を初めて使う初心者  
**必要な時間：** 約1～2時間

---

## 📖 目次

1. [概要](#概要)
2. [ステップ1：アクセスキーの取得](#ステップ1アクセスキーの取得)
3. [ステップ2：環境変数の設定](#ステップ2環境変数の設定)
4. [ステップ3：Terraform の初期化](#ステップ3terraform-の初期化)
5. [ステップ4：Terraform ファイルの作成](#ステップ4terraform-ファイルの作成)
6. [ステップ5：デプロイ実行](#ステップ5デプロイ実行)

---

## 概要

### 従来の方法 vs このガイドの方法

| 項目 | 従来 | このガイド |
|------|------|----------|
| AWS CLI インストール | 必須 | 不要 |
| 認証方法 | `aws configure` | 環境変数 `$env:AWS_*` |
| Terraform | 同じ | 同じ |
| メリット | AWS CLI も使える | シンプル、AWS CLI 不要 |

**このガイドを使うべき場合：**
- AWS CLI のインストールに失敗した
- とにかく早くデプロイしたい
- Terraform だけで十分

---

## ステップ1：アクセスキーの取得

### 1-1. ROOT ユーザーでログイン

1. **AWSコンソール** → https://console.aws.amazon.com/
2. **「Sign in using root user email」** をクリック
3. ROOT メールアドレス + パスワードでログイン

### 1-2. IAM ユーザーのアクセスキーを作成

1. **IAM コンソール** を開く（検索欄で「IAM」と入力）
2. 左メニュー → **「ユーザー」**
3. 対象のユーザー（例：`norihiko-admin`）をクリック
4. **「セキュリティ認証情報」** タブをクリック
5. **「アクセスキー」** セクション → **「新しいアクセスキーを作成」**
6. ユースケースで **「コマンドラインインターフェース (CLI)」** を選択
7. **「次へ」** をクリック
8. **アクセスキー ID** と **シークレットアクセスキー** が表示される
   - ⚠️ **この画面を離れると二度と見られません！**
   - 両方とも **メモに保存** してください

### 1-3. ROOT からログアウト

---

## ステップ2：環境変数の設定

### 2-1. PowerShell を開く

新しい PowerShell ウィンドウを開いてください。

### 2-2. 環境変数を設定

以下の3行を PowerShell に入力して実行：

```powershell
$env:AWS_ACCESS_KEY_ID = "メモしたアクセスキーID"
$env:AWS_SECRET_ACCESS_KEY = "メモしたシークレットアクセスキー"
$env:AWS_DEFAULT_REGION = "ap-northeast-1"
```

**例（実際の値に置き換えてください）：**
```powershell
$env:AWS_ACCESS_KEY_ID = "AKIAIOSFODNN7EXAMPLE"
$env:AWS_SECRET_ACCESS_KEY = "wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY"
$env:AWS_DEFAULT_REGION = "ap-northeast-1"
```

### 2-3. 確認

```powershell
echo $env:AWS_ACCESS_KEY_ID
```

アクセスキー ID が表示されたら成功 ✓

### ⚠️ 重要な注意

- これらの環境変数は **PowerShell ウィンドウを閉じると消えます**
- 再度起動した場合は、もう一度設定する必要があります
- 永続化する場合は [付録：環境変数を永続化](#付録環境変数を永続化) を参照

---

## ステップ3：Terraform の初期化

### 3-1. プロジェクトフォルダに移動

```powershell
cd "c:\AI Engineering Course"
```

### 3-2. terraform-deploy フォルダを作成

```powershell
mkdir terraform-deploy
cd terraform-deploy
```

### 3-3. Terraform を初期化

```powershell
terraform init
```

**出力例：**
```
Terraform initialized in an empty directory!
```

成功 ✓

---

## ステップ4：Terraform ファイルの作成

### 4-1. main.tf を作成

以下の内容で `main.tf` ファイルを作成してください：

```hcl
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.region
}

# セキュリティグループ（バックエンド）
resource "aws_security_group" "backend" {
  name        = "kanban-backend-sg"
  description = "Security group for Kanban backend"

  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# セキュリティグループ（データベース）
resource "aws_security_group" "database" {
  name        = "kanban-database-sg"
  description = "Security group for Kanban database"

  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.backend.id]
  }

  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# EC2 インスタンス
resource "aws_instance" "backend" {
  ami                    = "ami-0bba69335379e17f8"  # Ubuntu 22.04 LTS
  instance_type          = "t2.micro"
  vpc_security_group_ids = [aws_security_group.backend.id]

  tags = {
    Name = "kanban-backend"
  }
}

# RDS インスタンス
resource "aws_db_instance" "postgres" {
  identifier       = "kanban-db"
  engine           = "postgres"
  engine_version   = "15.3"
  instance_class   = "db.t3.micro"
  allocated_storage = 20

  db_name  = var.db_name
  username = var.db_username
  password = var.db_password

  skip_final_snapshot = true

  vpc_security_group_ids = [aws_security_group.database.id]

  tags = {
    Name = "kanban-database"
  }
}
```

### 4-2. variables.tf を作成

```hcl
variable "region" {
  type    = string
  default = "ap-northeast-1"
}

variable "db_name" {
  type    = string
  default = "kanban_db"
}

variable "db_username" {
  type    = string
  default = "kanban_user"
}

variable "db_password" {
  type    = string
  default = "changeme123!"
}
```

### 4-3. outputs.tf を作成

```hcl
output "backend_public_ip" {
  value       = aws_instance.backend.public_ip
  description = "Public IP of backend EC2 instance"
}

output "database_endpoint" {
  value       = aws_db_instance.postgres.endpoint
  description = "RDS endpoint"
}
```

---

## ステップ5：デプロイ実行

### 5-1. 設定を確認

```powershell
terraform plan
```

以下が含まれているか確認：
- ✓ `aws_instance.backend`
- ✓ `aws_db_instance.postgres`
- ✓ `aws_security_group.backend`
- ✓ `aws_security_group.database`

### 5-2. デプロイ実行

```powershell
terraform apply
```

確認を求められます：
```
Do you want to perform these actions?
Terraform will perform the actions described above.
Only 'yes' will be accepted to approve.

Enter a value:
```

`yes` と入力して Enter キー。

### 5-3. 完成

数分で完成します！出力例：
```
Apply complete! Resources: 5 added, 0 changed, 0 destroyed.

Outputs:

backend_public_ip = "54.123.45.67"
database_endpoint = "kanban-xxx.abc123def456.ap-northeast-1.rds.amazonaws.com:5432"
```

**🎉 成功です！**

---

## 付録：環境変数を永続化

毎回設定するのが面倒な場合、Windows システム環境変数に登録できます：

### Windows 設定で永続化

1. **Windows キー** を押す
2. 「環境変数」と検索
3. **「環境変数を編集」** をクリック
4. **「新規」** → ユーザー環境変数を作成：
   - 変数名：`AWS_ACCESS_KEY_ID`
   - 変数値：アクセスキー ID

5. 同様に以下も追加：
   - `AWS_SECRET_ACCESS_KEY`
   - `AWS_DEFAULT_REGION` = `ap-northeast-1`

6. PowerShell を再起動

その後は、新しい PowerShell ウィンドウを開いただけで環境変数が有効になります。

---

## トラブルシューティング

### Q: `terraform init` でエラーが出た

**A:** 以下を確認：
```powershell
terraform --version
echo $env:AWS_ACCESS_KEY_ID
```

両方が表示されれば、もう一度 `terraform init` を実行。

### Q: `terraform apply` で認証エラーが出た

**A:** アクセスキーが正しいか確認：
```powershell
echo $env:AWS_ACCESS_KEY_ID
echo $env:AWS_SECRET_ACCESS_KEY
```

間違っていれば、もう一度ステップ2を実行。

### Q: 環境変数が消えた

**A:** PowerShell ウィンドウを閉じたからです。新しく開いて、ステップ2を再実行してください。

---

## 参考資料

- [Terraform Documentation](https://www.terraform.io/docs)
- [AWS Provider for Terraform](https://registry.terraform.io/providers/hashicorp/aws/latest/docs)
- [AWS Free Tier](https://aws.amazon.com/jp/free/)

---

**作成日：** 2026年6月11日  
**対象：** Windows 11 + Terraform 1.15.6 + AWS IAM ユーザー
