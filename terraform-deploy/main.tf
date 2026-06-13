terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region     = var.region
  access_key = var.access_key
  secret_key = var.secret_key
}

# ===== セキュリティグループ（EC2） =====
resource "aws_security_group" "backend" {
  name        = "kanban-backend-sg"
  description = "Security group for Kanban backend (EC2)"

  # HTTP
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # HTTPS
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # バックエンド (Spring Boot)
  ingress {
    from_port   = 8080
    to_port     = 8080
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # フロントエンド開発サーバー (Vite/React)
  ingress {
    from_port   = 3000
    to_port     = 3000
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # SSH (管理用)
  ingress {
    from_port   = 22
    to_port     = 22
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }

  # すべての送信トラフィックを許可
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "kanban-backend-sg"
  }
}

# ===== EC2 インスタンス (Free Tier: t2.micro) =====
resource "aws_instance" "backend" {
  ami                    = "ami-000ca9d0576e613fc"
  instance_type          = "t3.micro"
  key_name               = "kanban-key"
  vpc_security_group_ids = [aws_security_group.backend.id]

  root_block_device {
    volume_size           = 20
    volume_type           = "gp2"
    delete_on_termination = true
  }

  tags = {
    Name = "kanban-backend-server"
  }
}

# ===== RDS セキュリティグループ =====
resource "aws_security_group" "rds" {
  name        = "kanban-rds-sg"
  description = "Security group for Kanban RDS (PostgreSQL)"

  # PostgreSQL ポート (EC2 からのアクセスのみ)
  ingress {
    from_port       = 5432
    to_port         = 5432
    protocol        = "tcp"
    security_groups = [aws_security_group.backend.id]
  }

  # すべての送信トラフィックを許可
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }

  tags = {
    Name = "kanban-rds-sg"
  }
}

# ===== RDS DB Subnet Group =====
resource "aws_db_subnet_group" "kanban" {
  name       = "kanban-db-subnet-group"
  subnet_ids = data.aws_subnets.default.ids

  tags = {
    Name = "kanban-db-subnet-group"
  }
}

# ===== デフォルト VPC のサブネット情報 =====
data "aws_subnets" "default" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default.id]
  }
}

data "aws_vpc" "default" {
  default = true
}

# ===== RDS PostgreSQL インスタンス =====
resource "aws_db_instance" "kanban" {
  identifier             = "kanban-postgres-db"
  engine                 = "postgres"
  instance_class         = "db.t4g.micro"
  allocated_storage      = 20
  storage_type           = "gp3"
  db_name                = "kanbandb"
  username               = var.db_username
  password               = var.db_password
  db_subnet_group_name   = aws_db_subnet_group.kanban.name
  vpc_security_group_ids = [aws_security_group.rds.id]
  skip_final_snapshot    = true
  publicly_accessible    = false

  tags = {
    Name = "kanban-postgres-db"
  }
}
