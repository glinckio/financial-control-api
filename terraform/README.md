# AWS Infrastructure for Financial Control API

This directory contains Terraform configurations to set up the AWS infrastructure for the project.

## Prerequisites

1. Install [Terraform](https://www.terraform.io/downloads.html) (version >= 1.0.0)
2. Install [AWS CLI](https://aws.amazon.com/cli/)
3. Configure AWS credentials:
   ```bash
   aws configure
   ```

## Infrastructure Components

The configuration sets up the following AWS resources:

- VPC with public and private subnets
- ECS Cluster for container orchestration
- ECR Repository for Docker images
- RDS PostgreSQL instance
- Application Load Balancer
- Security Groups for RDS, ECS, and ALB

## Usage

1. Initialize Terraform:

   ```bash
   terraform init
   ```

2. Review the planned changes:

   ```bash
   terraform plan
   ```

3. Apply the configuration:

   ```bash
   terraform apply
   ```

4. To destroy the infrastructure:
   ```bash
   terraform destroy
   ```

## Variables

You can customize the infrastructure by modifying the variables in `variables.tf` or by creating a `terraform.tfvars` file. Key variables include:

- `aws_region`: AWS region to deploy resources
- `project_name`: Name of the project
- `vpc_cidr`: CIDR block for VPC
- `db_instance_class`: RDS instance class
- `db_name`: Name of the database
- `db_username`: Database username

## Outputs

After applying the configuration, Terraform will output:

- VPC ID
- Subnet IDs
- ECR Repository URL
- RDS Endpoint
- ALB DNS Name

## Security Notes

- The RDS instance is placed in private subnets
- Security groups are configured to allow only necessary traffic
- Database credentials should be managed securely (consider using AWS Secrets Manager)
- Consider enabling encryption at rest for RDS
- Review and adjust security group rules based on your requirements
