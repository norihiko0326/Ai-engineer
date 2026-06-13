output "backend_public_ip" {
  value       = aws_instance.backend.public_ip
  description = "Public IP address of backend EC2 instance"
}

output "backend_instance_id" {
  value       = aws_instance.backend.id
  description = "EC2 instance ID"
}

output "application_url" {
  value       = "http://${aws_instance.backend.public_ip}:8080"
  description = "Kanban application access URL"
}

output "rds_endpoint" {
  value       = aws_db_instance.kanban.endpoint
  description = "RDS database endpoint"
}

output "rds_database_name" {
  value       = aws_db_instance.kanban.db_name
  description = "RDS database name"
}

output "rds_username" {
  value       = aws_db_instance.kanban.username
  description = "RDS database username"
  sensitive   = true
}
