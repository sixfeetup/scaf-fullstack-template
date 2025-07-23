# :house: Architecture

This document outlines the architecture of the application, with diagrams to visualize the different components and their relationships.

## System Overview

The template provides a full-stack application with the following components:

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
flowchart TD
    %% External entities
    User([User])
    
    %% Top-level system components
    subgraph SystemOverview["SCAF System Overview"]
        %% Infrastructure layer
        subgraph InfraLayer["Infrastructure Layer"]
            TF[Terraform] --> AWS[AWS Resources]
            K8S[Kubernetes] --> CLUSTER[K8s Cluster]
        end
        
        %% Application layer
        subgraph AppLayer["Application Layer"]
            FE[Next.js Frontend] --> |GraphQL| BE[Django Backend]
            BE --> |Queries/Mutations| DB[(PostgreSQL)]
            BE --> |Async Tasks| CELERY[Celery Workers]
            CELERY --> REDIS[Redis]
            CELERY --> |Email| MAIL[Email Service]
        end
        
        %% Connections between layers
        CLUSTER --> APP[Application Stack]
        AWS --> APP
    end
    
    %% External connections
    User -->|interacts with| FE

    %% Style definitions - Gruvbox Dark theme
    classDef external fill:#3c3836,stroke:#928374,stroke-width:1px,color:#ebdbb2,font-weight:bold
    classDef infrastructure fill:#d79921,stroke:#b57614,stroke-width:2px,color:#282828,font-weight:bold
    classDef application fill:#689d6a,stroke:#427b58,stroke-width:2px,color:#282828,font-weight:bold
    classDef database fill:#458588,stroke:#076678,stroke-width:2px,color:#282828,font-weight:bold,shape:cylinder
    classDef queue fill:#cc241d,stroke:#9d0006,stroke-width:2px,color:#282828,font-weight:bold

    %% Apply styles
    class User external
    class TF,K8S,AWS,CLUSTER,APP infrastructure
    class FE,BE,CELERY,MAIL application
    class DB database
    class REDIS queue
    
    %% Explicit styling for subgraph titles - works in both light and dark modes
    style SystemOverview fill:#282828,color:#fabd2f,font-weight:bold
    style InfraLayer fill:#282828,color:#fabd2f,font-weight:bold
    style AppLayer fill:#282828,color:#fabd2f,font-weight:bold
```

## Application Architecture

### Frontend (Next.js)

The frontend is built with Next.js and TypeScript, using Apollo Client for GraphQL communication with the backend.

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
    %% Node styling
    
    subgraph FrontendArch["Frontend Architecture"]
        subgraph NextComponents["Next.js Components"]
            PAGES[Pages] --> COMPS[Components]
            PAGES --> HOOKS[Hooks/Utils]
            APOLLO[Apollo Client] --> GQL[GraphQL Queries/Mutations] 
            PAGES --> APOLLO
        end
    end
    
    APOLLO --> |HTTP/GraphQL| API[Backend API]
    
    %% Style definitions - Gruvbox Dark theme
    classDef frontend fill:#d79921,stroke:#b57614,stroke-width:2px,color:#282828,font-weight:bold
    classDef api fill:#689d6a,stroke:#427b58,stroke-width:2px,color:#282828,font-weight:bold
    
    %% Apply styles
    class PAGES,COMPS,HOOKS,APOLLO,GQL frontend
    class API api
    
    %% Explicit styling for subgraph titles - works in both light and dark modes
    style FrontendArch fill:#282828,color:#fabd2f,font-weight:bold
    style NextComponents fill:#282828,color:#fabd2f,font-weight:bold
```

### Backend (Django)

The backend is built with Django, using Django GraphQL and Celery for async task processing.

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
flowchart TB
    %% External entities
    User([User])
    
    subgraph BackendArch["Backend Architecture"]
        subgraph DjangoComponents["Django Components"]
            URLS[URL Configuration] --> VIEWS[Views/GraphQL]
            VIEWS --> MODELS[Models]
            MODELS --> DB[(PostgreSQL)]
            VIEWS --> |Async Tasks| TASKS[Celery Tasks]
            TASKS --> REDIS[Redis]
        end
    end
    
    User --> |HTTP Request| VIEWS
    
    %% Style definitions - Gruvbox Dark theme
    classDef external fill:#3c3836,stroke:#928374,stroke-width:1px,color:#ebdbb2,font-weight:bold
    classDef backend fill:#689d6a,stroke:#427b58,stroke-width:2px,color:#282828,font-weight:bold
    classDef database fill:#458588,stroke:#076678,stroke-width:2px,color:#282828,font-weight:bold,shape:cylinder
    classDef queue fill:#cc241d,stroke:#9d0006,stroke-width:2px,color:#282828,font-weight:bold
    
    %% Apply styles
    class User external
    class URLS,VIEWS,MODELS,TASKS backend
    class DB database
    class REDIS queue
    
    %% Explicit styling for subgraph titles - works in both light and dark modes
    style BackendArch fill:#282828,color:#fabd2f,font-weight:bold
    style DjangoComponents fill:#282828,color:#fabd2f,font-weight:bold
```

## Infrastructure Architecture

### Kubernetes Deployment

The application is deployed on Kubernetes, with separate environments for development, staging, and production.

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
flowchart TB
    %% External entities
    User([User])
    
    subgraph K8sArch["Kubernetes Architecture"]
        INGRESS[Ingress Controller] --> FE_SVC[Frontend Service]
        INGRESS --> BE_SVC[Backend Service]
        
        FE_SVC --> FE_POD[Frontend Pods]
        BE_SVC --> BE_POD[Backend Pods]
        
        CELERY_SVC[Celery Service] --> CELERY_POD[Celery Pods]
        
        DB_SVC[Database Service] --> DB_POD[Database Pods]
        REDIS_SVC[Redis Service] --> REDIS_POD[Redis Pods]
    end
    
    User --> |HTTPS| INGRESS
    
    %% Style definitions - Gruvbox Dark theme
    classDef external fill:#3c3836,stroke:#928374,stroke-width:1px,color:#ebdbb2,font-weight:bold
    classDef ingress fill:#d79921,stroke:#b57614,stroke-width:2px,color:#282828,font-weight:bold
    classDef service fill:#689d6a,stroke:#427b58,stroke-width:2px,color:#282828,font-weight:bold
    classDef pod fill:#458588,stroke:#076678,stroke-width:2px,color:#282828,font-weight:bold
    
    %% Apply styles
    class User external
    class INGRESS ingress
    class FE_SVC,BE_SVC,CELERY_SVC,DB_SVC,REDIS_SVC service
    class FE_POD,BE_POD,CELERY_POD,DB_POD,REDIS_POD pod
    
    %% Explicit styling for subgraph titles - works in both light and dark modes
    style K8sArch fill:#282828,color:#fabd2f,font-weight:bold
```

### AWS Infrastructure (Terraform)

The cloud infrastructure is managed with Terraform, provisioning AWS resources.

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
flowchart TB
    %% External entities
    INTERNET([Internet])
    
    subgraph AWSArch["AWS Infrastructure"]
        R53[Route53] --> CF[CloudFront]
        CF --> ALB[Application Load Balancer]
        
        ALB --> EKS[EKS Cluster]
        
        EKS --> EC2[EC2 Instances]
        
        ECR[ECR Repositories] --> EKS
        
        RDS[RDS PostgreSQL] --- EKS
        
        S3[S3 Buckets] --- CF
    end
    
    INTERNET --> R53
    
    %% Style definitions - Gruvbox Dark theme
    classDef external fill:#3c3836,stroke:#928374,stroke-width:1px,color:#ebdbb2,font-weight:bold
    classDef network fill:#d79921,stroke:#b57614,stroke-width:2px,color:#282828,font-weight:bold
    classDef compute fill:#689d6a,stroke:#427b58,stroke-width:2px,color:#282828,font-weight:bold
    classDef storage fill:#458588,stroke:#076678,stroke-width:2px,color:#282828,font-weight:bold
    classDef database fill:#cc241d,stroke:#9d0006,stroke-width:2px,color:#282828,font-weight:bold,shape:cylinder
    
    %% Apply styles
    class INTERNET external
    class R53,CF,ALB network
    class EKS,EC2 compute
    class ECR,S3 storage
    class RDS database
    
    %% Explicit styling for subgraph titles - works in both light and dark modes
    style AWSArch fill:#282828,color:#fabd2f,font-weight:bold
```

## Data Flow

This diagram illustrates how data flows through the system:

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
      'tertiaryColor': '#504945',
      'actorBkg': '#3c3836',
      'actorTextColor': '#ebdbb2',
      'actorBorder': '#928374'
    }
  }
}%%
sequenceDiagram
    actor User as User
    participant FE as Frontend (Next.js)
    participant BE as Backend (Django)
    participant DB as PostgreSQL
    participant Worker as Celery Worker
    
    User->>FE: Access Application
    activate FE
    FE->>BE: GraphQL Query/Mutation
    activate BE
    BE->>DB: Database Query
    activate DB
    DB-->>BE: Query Results
    deactivate DB
    BE-->>FE: GraphQL Response
    deactivate BE
    FE-->>User: Display Data
    deactivate FE
    
    alt Async Process
        BE->>Worker: Queue Task
        activate Worker
        Worker->>DB: Process Data
        activate DB
        deactivate DB
        Worker->>BE: Task Result
        deactivate Worker
    end
```

## Development Workflow

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
    subgraph DevWorkflow["Development Workflow"]
        CODE[Local Development] --> |Git Push| REPO[Repository]
        REPO --> |CI/CD Pipeline| CI[CI/CD Tests]
        CI --> |Deployment| K8S[Kubernetes]
        K8S --> |ArgoCD| ENV[Environment]
    end
    
    %% Style definitions - Gruvbox Dark theme
    classDef dev fill:#d79921,stroke:#b57614,stroke-width:2px,color:#282828,font-weight:bold
    classDef repo fill:#689d6a,stroke:#427b58,stroke-width:2px,color:#282828,font-weight:bold
    classDef ci fill:#458588,stroke:#076678,stroke-width:2px,color:#282828,font-weight:bold
    classDef deploy fill:#cc241d,stroke:#9d0006,stroke-width:2px,color:#282828,font-weight:bold
    
    %% Apply styles
    class CODE dev
    class REPO repo
    class CI ci
    class K8S,ENV deploy
    
    %% Link styling
    linkStyle default stroke:#7c6f64,stroke-width:2px,stroke-dasharray: 5 5
    
    %% Explicit styling for subgraph titles - works in both light and dark modes
    style DevWorkflow fill:#282828,color:#fabd2f,font-weight:bold
```

## Environment Architecture

The project supports multiple environments with different configurations:

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
flowchart TB
    subgraph EnvArch["Environment Architecture"]
        BASE[Base Configuration] --> DEV[Development]
        BASE --> SANDBOX[Sandbox]
        BASE --> STAGING[Staging]
        BASE --> PROD[Production]
        
        DEV --> |Local Testing| DEV_ENV[Local Environment]
        SANDBOX --> |Testing| SANDBOX_ENV[Sandbox Environment]
        STAGING --> |Pre-Production| STAGING_ENV[Staging Environment]
        PROD --> |Production| PROD_ENV[Production Environment]
    end
    
    %% Style definitions - Gruvbox Dark theme
    classDef base fill:#458588,stroke:#076678,stroke-width:2px,color:#282828,font-weight:bold
    classDef dev fill:#689d6a,stroke:#427b58,stroke-width:2px,color:#282828,font-weight:bold
    classDef staging fill:#d79921,stroke:#b57614,stroke-width:2px,color:#282828,font-weight:bold
    classDef prod fill:#cc241d,stroke:#9d0006,stroke-width:2px,color:#282828,font-weight:bold
    classDef sandbox fill:#b16286,stroke:#8f3f71,stroke-width:2px,color:#282828,font-weight:bold
    classDef env fill:#3c3836,stroke:#928374,stroke-width:1px,color:#ebdbb2,font-weight:bold
    
    %% Apply styles
    class BASE base
    class DEV dev
    class SANDBOX sandbox
    class STAGING staging
    class PROD prod
    class DEV_ENV,SANDBOX_ENV,STAGING_ENV,PROD_ENV env
    
    %% Explicit styling for subgraph titles - works in both light and dark modes
    style EnvArch fill:#282828,color:#fabd2f,font-weight:bold
```