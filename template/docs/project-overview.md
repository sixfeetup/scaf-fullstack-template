# :telescope: Project Overview

This project template provides a full-stack application scaffold with integrated deployment tooling. It's designed to quickly bootstrap new projects with a standardized architecture and best practices.

## Purpose

The purpose of this template is to:

1. Provide a consistent starting point for new projects
2. Implement best practices for development, testing, and deployment
3. Reduce setup time for new projects
4. Ensure infrastructure is defined as code from the beginning
5. Enable rapid iteration and deployment to various environments

## Core Technologies

```mermaid
%%{
  init: {
    'theme': 'base',
    'themeVariables': {
      'primaryColor': '#282828',
      'primaryTextColor': '#ebdbb2',
      'primaryBorderColor': '#7c6f64',
      'lineColor': '#7c6f64',
      'secondaryColor': '#3c3836',
      'tertiaryColor': '#504945'
    }
  }
}%%
flowchart LR
    subgraph Temp["Core Technologies"]
        Frontend["Frontend
        Next.js
        TypeScript
        Apollo Client
        GraphQL
        TailwindCSS
        Vitest"]
        
        Backend["Backend
        Django
        GraphQL
        Celery
        Redis
        PostgreSQL"]
        
        Infrastructure["Infrastructure
        Kubernetes
        Docker
        ArgoCD
        Terraform"]
        
        DevOps["DevOps
        CI/CD
        GitOps
        Secrets Management"]
    end
    
    %% Style definitions - Gruvbox Dark theme
    classDef frontend fill:#d79921,stroke:#b57614,stroke-width:2px,color:#282828,font-weight:bold
    classDef backend fill:#689d6a,stroke:#427b58,stroke-width:2px,color:#282828,font-weight:bold
    classDef infra fill:#458588,stroke:#076678,stroke-width:2px,color:#282828,font-weight:bold
    classDef devops fill:#cc241d,stroke:#9d0006,stroke-width:2px,color:#282828,font-weight:bold
    
    %% Apply styles
    class Frontend frontend
    class Backend backend
    class Infrastructure infra
    class DevOps devops
    
    %% Explicit styling for subgraph titles - works in both light and dark modes
    style Temp fill:#282828,color:#fabd2f,font-weight:bold
```

## Design Principles

The template follows these design principles:

1. **Infrastructure as Code**: All infrastructure is defined in Terraform and Kubernetes manifests
2. **GitOps**: Deployment is managed through Git using ArgoCD
3. **Environment Parity**: Development, sandbox, staging, and production environments use the same configuration base
4. **Containerization**: All application components run in containers
5. **Microservices**: The application is structured as separate services (frontend, backend, workers)
6. **API-First**: Backend exposes GraphQL API consumed by the frontend
7. **Async Processing**: Long-running tasks are handled asynchronously with Celery

## How to Use This Template

1. Create a new project using Copier with this template
2. Fill in the required variables during setup
3. Initialize the Git repository
4. Start development with the included tooling

For more details on the architecture, see the [Architecture Documentation](./architecture.md).

## Key Features

- Next.js frontend with TypeScript and GraphQL integration
- Django backend with GraphQL API
- Celery for background task processing
- Kubernetes manifests for deployment
- Terraform for infrastructure provisioning
- CI/CD pipeline configuration
- Comprehensive documentation
- Development environment setup
- Testing infrastructure