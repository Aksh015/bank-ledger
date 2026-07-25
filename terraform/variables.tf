variable "aws_region" {
  description = "AWS region for the deployment"
  type        = string
  default     = "ap-south-1"
}

variable "project_name" {
  description = "Project name used for resource naming"
  type        = string
  default     = "backend-ledger"
}

variable "container_image" {
  description = "Container image URI for the API"
  type        = string
  default     = "replace-me"
}

variable "mongo_url" {
  description = "MongoDB Atlas connection string"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret for the application"
  type        = string
  sensitive   = true
}

variable "client_id" {
  description = "Google OAuth client ID"
  type        = string
  sensitive   = true
}

variable "client_secret" {
  description = "Google OAuth client secret"
  type        = string
  sensitive   = true
}

variable "refresh_token" {
  description = "Google OAuth refresh token"
  type        = string
  sensitive   = true
}

variable "email_user" {
  description = "Email user for notifications"
  type        = string
  sensitive   = true
}
