# Configuración del proveedor AWS
terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
  required_version = ">= 1.0"
}

# Configuración del proveedor AWS
provider "aws" {
  region = var.aws_region
}

# Variables
variable "aws_region" {
  description = "Región de AWS donde se creará el bucket"
  type        = string
  default     = "us-east-1"
}

variable "bucket_name" {
  description = "Nombre del bucket S3"
  type        = string
  default     = "mi-bucket-publico-s3"
}

variable "environment" {
  description = "Ambiente (dev, staging, prod)"
  type        = string
  default     = "dev"
}

# Recurso del bucket S3
resource "aws_s3_bucket" "public_bucket" {
  bucket = "${var.bucket_name}-${var.environment}-${random_id.bucket_suffix.hex}"

  tags = {
    Name        = "${var.bucket_name}-${var.environment}"
    Environment = var.environment
    ManagedBy   = "Terraform"
  }
}

# ID aleatorio para hacer único el nombre del bucket
resource "random_id" "bucket_suffix" {
  byte_length = 4
}

# Configuración de acceso público del bucket
resource "aws_s3_bucket_public_access_block" "public_bucket_pab" {
  bucket = aws_s3_bucket.public_bucket.id

  block_public_acls       = false
  block_public_policy     = false
  ignore_public_acls      = false
  restrict_public_buckets = false
}

# Política del bucket para acceso público de lectura
resource "aws_s3_bucket_policy" "public_bucket_policy" {
  bucket = aws_s3_bucket.public_bucket.id

  depends_on = [aws_s3_bucket_public_access_block.public_bucket_pab]

  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Sid       = "PublicReadGetObject"
        Effect    = "Allow"
        Principal = "*"
        Action    = "s3:GetObject"
        Resource  = "${aws_s3_bucket.public_bucket.arn}/*"
      }
    ]
  })
}

# Configuración de versioning del bucket
resource "aws_s3_bucket_versioning" "public_bucket_versioning" {
  bucket = aws_s3_bucket.public_bucket.id
  versioning_configuration {
    status = "Enabled"
  }
}

# Configuración de servidor estático (opcional para hosting web)
resource "aws_s3_bucket_website_configuration" "public_bucket_website" {
  bucket = aws_s3_bucket.public_bucket.id

  index_document {
    suffix = "index.html"
  }

  error_document {
    key = "error.html"
  }
}

# Configuración de CORS (opcional)
resource "aws_s3_bucket_cors_configuration" "public_bucket_cors" {
  bucket = aws_s3_bucket.public_bucket.id

  cors_rule {
    allowed_headers = ["*"]
    allowed_methods = ["GET", "HEAD"]
    allowed_origins = ["*"]
    expose_headers  = ["ETag"]
    max_age_seconds = 3000
  }
}

# Outputs
output "bucket_name" {
  description = "Nombre del bucket S3 creado"
  value       = aws_s3_bucket.public_bucket.id
}

output "bucket_arn" {
  description = "ARN del bucket S3"
  value       = aws_s3_bucket.public_bucket.arn
}

output "bucket_domain_name" {
  description = "Nombre de dominio del bucket"
  value       = aws_s3_bucket.public_bucket.bucket_domain_name
}

output "bucket_website_endpoint" {
  description = "Endpoint del sitio web del bucket"
  value       = aws_s3_bucket_website_configuration.public_bucket_website.website_endpoint
}

output "bucket_website_domain" {
  description = "Dominio del sitio web del bucket"
  value       = aws_s3_bucket_website_configuration.public_bucket_website.website_domain
}