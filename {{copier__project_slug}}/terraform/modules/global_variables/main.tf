output "app_name" {
  description = "App Name"
  value       = "{{ copier__project_dash }}"
}

output "application" {
  value = "{{ copier__project_dash }}"
}

output "aws_region" {
  description = "AWS Region"
  value       = "{{ copier__aws_region }}"
}

output "aws_profile" {
  description = "AWS Profile for CLI"
  value       = "{{ copier__project_dash }}"
}

output "account_id" {
  value = "{{ copier__aws_account_id }}"
}

output "domain_name" {
  value = "{{ copier__domain_name }}"
}

output "existing_hosted_zone" {
  description = "Existing hosted zone name"
  value       = "{{ copier__existing_hosted_zone }}"
}
