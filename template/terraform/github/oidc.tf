terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = ">= 5.51.1"
    }
  }
  backend "s3" {
    region         = "{{ copier__aws_region }}"
    bucket         = "{{ copier__project_dash }}-terraform-state"
    key            = "{{ copier__project_dash }}.github.json"
    encrypt        = true
    dynamodb_table = "{{ copier__project_dash }}-terraform-state"
  }
}

provider "aws" {
  region = "us-east-1"
}

data "external" "oidc_provider_exists" {
  program = ["bash", "${path.module}/check_oidc_provider.sh"]
}

locals {
  oidc_provider_exists = data.external.oidc_provider_exists.result.exists == "true"
}

resource "aws_iam_openid_connect_provider" "github" {
  count = local.oidc_provider_exists ? 0 : 1

  url = "https://token.actions.githubusercontent.com"

  client_id_list = [
    "sts.amazonaws.com"
  ]

  # https://stackoverflow.com/questions/69247498/how-can-i-calculate-the-thumbprint-of-an-openid-connect-server
  # Thumbprints for GitHub
  thumbprint_list = [
    "6938fd4d98bab03faadb97b34396831e3780aea1",
    "1c58a3a8518e8759bf075b76b750d4f2df264fcd"
  ]
}

data "aws_iam_openid_connect_provider" "github_data" {
  url = "https://token.actions.githubusercontent.com"
}

locals {
  github_oidc_provider_arn = local.oidc_provider_exists ? data.aws_iam_openid_connect_provider.github_data.arn : aws_iam_openid_connect_provider.github[0].arn
}

# Define the IAM role
resource "aws_iam_role" "github_oidc_role" {
  name = "{{ copier__project_slug }}-github-oidc-role"

  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Federated": "${local.github_oidc_provider_arn}"
      },
      "Action": "sts:AssumeRoleWithWebIdentity",
      "Condition": {
        "StringLike": {
          "token.actions.githubusercontent.com:sub": "repo:{{ copier__source_control_organization_slug }}/{{ copier__repo_name }}:*"
        },
        "StringEquals": {
          "token.actions.githubusercontent.com:aud": "sts.amazonaws.com"
        }
      }
    }
  ]
}
EOF
}


