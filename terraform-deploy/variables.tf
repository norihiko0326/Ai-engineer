variable "region" {
  type        = string
  default     = "ap-northeast-1"
  description = "AWS region (Tokyo)"
}

variable "access_key" {
  type        = string
  description = "AWS Access Key ID"
  sensitive   = true
}

variable "secret_key" {
  type        = string
  description = "AWS Secret Access Key"
  sensitive   = true
}

variable "db_username" {
  type        = string
  description = "RDS database username"
  sensitive   = true
  default     = "kanbanAdmin"
}

variable "db_password" {
  type        = string
  description = "RDS database password"
  sensitive   = true
}
