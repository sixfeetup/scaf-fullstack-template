# :arrows_counterclockwise: Data Flow Diagrams

This document provides detailed data flow diagrams for the application, visualizing how data moves through different components and stages of the system.

## Comprehensive Data Flow

This diagram shows the overall data flow across all components of the system, including frontend, backend, storage systems, and external integrations.

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
    User([End User])
    Developer([Developer])
    
    %% Data sources
    subgraph DataSources["Data Sources"]
        direction TB
        FormInput[("User Form Input")]
        APIData[("External API Data")]
        FileUploads[("File Uploads")]
        StoredData[("Database Records")]
    end
    
    %% Frontend data flow
    subgraph FrontendFlow["Frontend Data Flow"]
        direction TB
        NextPages["Next.js Pages"]
        Components["React Components"]
        ClientState["Client State Management"]
        ApolloClient["Apollo Client"]
        GQLQueries["GraphQL Queries"]
        GQLMutations["GraphQL Mutations"]
        
        NextPages --> Components
        Components --> ClientState
        ClientState --> Components
        Components --> ApolloClient
        ApolloClient --> GQLQueries
        ApolloClient --> GQLMutations
    end
    
    %% Backend data flow
    subgraph BackendFlow["Backend Data Flow"]
        direction TB
        DjangoViews["Django Views/GraphQL"]
        QueryResolvers["GraphQL Query Resolvers"]
        MutationResolvers["GraphQL Mutation Resolvers"]
        DjangoModels["Django Models"]
        ModelValidation["Model Validation"]
        Serialization["Data Serialization"]
        CeleryTasks["Async Celery Tasks"]
        
        DjangoViews --> QueryResolvers
        DjangoViews --> MutationResolvers
        QueryResolvers --> DjangoModels
        MutationResolvers --> ModelValidation
        ModelValidation --> DjangoModels
        DjangoModels --> Serialization
        MutationResolvers --> CeleryTasks
        CeleryTasks --> DjangoModels
    end
    
    %% Storage systems
    subgraph StorageSystems["Storage Systems"]
        direction TB
        PostgreSQL[(PostgreSQL)]
        Redis[(Redis)]
        S3Bucket[(S3 Bucket)]
        
        PostgreSQL --> StoredData
    end
    
    %% External systems
    subgraph ExternalSystems["External Systems"]
        direction TB
        EmailService["Email Service"]
        ExternalAPIs["Third-Party APIs"]
    end
    
    %% Deployment data flow
    subgraph DeploymentFlow["Deployment Data Flow"]
        direction TB
        SourceCode[("Source Code")]
        GitRepo["Git Repository"]
        CISystem["CI/CD Pipeline"]
        DockerImages["Docker Images"]
        ECRRepository["ECR Repository"]
        K8sManifests["Kubernetes Manifests"]
        ArgoCD["ArgoCD"]
        K8sCluster["Kubernetes Cluster"]
        
        SourceCode --> GitRepo
        GitRepo --> CISystem
        CISystem --> DockerImages
        DockerImages --> ECRRepository
        K8sManifests --> ArgoCD
        ECRRepository --> ArgoCD
        ArgoCD --> K8sCluster
    end
    
    %% Primary data flow connections
    %% User/Client interactions
    User --> FormInput
    User --> FileUploads
    FormInput --> Components
    FileUploads --> Components
    
    %% Frontend to backend
    GQLQueries --> DjangoViews
    GQLMutations --> DjangoViews
    
    %% Backend to storage
    DjangoModels --> PostgreSQL
    CeleryTasks --> Redis
    CeleryTasks --> S3Bucket
    
    %% External integrations
    CeleryTasks --> EmailService
    QueryResolvers --> ExternalAPIs
    ExternalAPIs --> APIData
    APIData --> QueryResolvers
    
    %% Deployment workflow
    Developer --> SourceCode
    
    %% Response flows
    PostgreSQL --> DjangoModels
    Serialization --> QueryResolvers
    Serialization --> MutationResolvers
    QueryResolvers --> DjangoViews
    MutationResolvers --> DjangoViews
    DjangoViews --> GQLQueries
    DjangoViews --> GQLMutations
    GQLQueries --> ApolloClient
    GQLMutations --> ApolloClient
    ApolloClient --> Components
    Components --> NextPages
    NextPages --> User
    
    %% Style definitions - Gruvbox Dark theme
    classDef external fill:#3c3836,stroke:#928374,stroke-width:1px,color:#ebdbb2,font-weight:bold
    classDef frontend fill:#d79921,stroke:#b57614,stroke-width:2px,color:#282828,font-weight:bold
    classDef backend fill:#689d6a,stroke:#427b58,stroke-width:2px,color:#282828,font-weight:bold
    classDef storage fill:#458588,stroke:#076678,stroke-width:2px,color:#282828,font-weight:bold,shape:cylinder
    classDef queue fill:#cc241d,stroke:#9d0006,stroke-width:2px,color:#282828,font-weight:bold
    classDef data fill:#b16286,stroke:#8f3f71,stroke-width:2px,color:#282828,font-weight:bold
    classDef deployment fill:#98971a,stroke:#79740e,stroke-width:2px,color:#282828,font-weight:bold
    classDef external_system fill:#d65d0e,stroke:#af3a03,stroke-width:2px,color:#282828,font-weight:bold
    
    %% Apply styles
    class User,Developer external
    class NextPages,Components,ClientState,ApolloClient,GQLQueries,GQLMutations frontend
    class DjangoViews,QueryResolvers,MutationResolvers,DjangoModels,ModelValidation,Serialization,CeleryTasks backend
    class PostgreSQL,Redis,S3Bucket storage
    class FormInput,APIData,FileUploads,StoredData data
    class EmailService,ExternalAPIs external_system
    class SourceCode,GitRepo,CISystem,DockerImages,ECRRepository,K8sManifests,ArgoCD,K8sCluster deployment
    
    %% Explicit styling for subgraph titles
    style DataSources fill:#282828,color:#fabd2f,font-weight:bold
    style FrontendFlow fill:#282828,color:#fabd2f,font-weight:bold
    style BackendFlow fill:#282828,color:#fabd2f,font-weight:bold
    style StorageSystems fill:#282828,color:#fabd2f,font-weight:bold
    style ExternalSystems fill:#282828,color:#fabd2f,font-weight:bold
    style DeploymentFlow fill:#282828,color:#fabd2f,font-weight:bold
```

## CRUD Operations Flow

This sequence diagram illustrates the detailed flow of Create, Read, Update, and Delete operations from user interaction through the entire stack.

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
    participant UI as Next.js UI
    participant Client as Apollo Client
    participant API as Django GraphQL API
    participant Validation as Input Validation
    participant Model as Django Models
    participant DB as PostgreSQL
    participant Background as Celery Tasks
    
    %% CREATE flow
    User->>UI: Submit Create Form
    activate UI
    UI->>Client: Execute create mutation
    activate Client
    Client->>API: GraphQL mutation request
    activate API
    API->>Validation: Validate input data
    activate Validation
    
    alt Invalid Data
        Validation-->>API: Validation errors
        API-->>Client: Return validation errors
        Client-->>UI: Display errors
        UI-->>User: Show error feedback
    else Valid Data
        Validation-->>API: Validated data
        deactivate Validation
        API->>Model: Create new object
        activate Model
        Model->>DB: INSERT query
        activate DB
        DB-->>Model: Confirmation
        deactivate DB
        Model-->>API: New object data
        deactivate Model
        
        opt Async Processing Needed
            API->>Background: Queue background task
            activate Background
            Background->>DB: Additional processing
            Background-->>API: Processing status
            deactivate Background
        end
        
        API-->>Client: Return success response
        deactivate API
        Client-->>UI: Update local cache/state
        deactivate Client
        UI-->>User: Display success confirmation
        UI->>UI: Redirect or update view
    end
    deactivate UI
    
    %% READ flow
    User->>UI: Request Data View
    activate UI
    UI->>Client: Execute query
    activate Client
    Client->>API: GraphQL query request
    activate API
    API->>Model: Retrieve data
    activate Model
    Model->>DB: SELECT query
    activate DB
    DB-->>Model: Query results
    deactivate DB
    Model-->>API: Format data
    deactivate Model
    API-->>Client: Return data
    deactivate API
    Client-->>UI: Update local state
    deactivate Client
    UI-->>User: Display data
    deactivate UI
    
    %% UPDATE flow
    User->>UI: Submit Edit Form
    activate UI
    UI->>Client: Execute update mutation
    activate Client
    Client->>API: GraphQL mutation request
    activate API
    API->>Validation: Validate input data
    activate Validation
    
    alt Invalid Data
        Validation-->>API: Validation errors
        API-->>Client: Return validation errors
        Client-->>UI: Display errors
        UI-->>User: Show error feedback
    else Valid Data
        Validation-->>API: Validated data
        deactivate Validation
        API->>Model: Update object
        activate Model
        Model->>DB: UPDATE query
        activate DB
        DB-->>Model: Confirmation
        deactivate DB
        Model-->>API: Updated object data
        deactivate Model
        
        opt Async Processing Needed
            API->>Background: Queue background task
            activate Background
            Background->>DB: Additional processing
            Background-->>API: Processing status
            deactivate Background
        end
        
        API-->>Client: Return success response
        deactivate API
        Client-->>UI: Update local cache/state
        deactivate Client
        UI-->>User: Display success confirmation
    end
    deactivate UI
    
    %% DELETE flow
    User->>UI: Request Delete
    activate UI
    UI->>UI: Confirm deletion
    UI->>Client: Execute delete mutation
    activate Client
    Client->>API: GraphQL mutation request
    activate API
    API->>Model: Delete object
    activate Model
    Model->>DB: DELETE query
    activate DB
    DB-->>Model: Confirmation
    deactivate DB
    Model-->>API: Success status
    deactivate Model
    
    opt Background Cleanup
        API->>Background: Queue cleanup task
        activate Background
        Background->>DB: Cleanup related data
        Background-->>API: Cleanup status
        deactivate Background
    end
    
    API-->>Client: Return success response
    deactivate API
    Client-->>UI: Update local cache/state
    deactivate Client
    UI-->>User: Display success confirmation
    UI->>UI: Redirect to list view
    deactivate UI
```

## API/Backend Data Processing Flow

This diagram illustrates how data moves through the various layers of the backend, from API requests to database operations.

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
    %% Request entry points
    GraphQLReq(["GraphQL Request"])
    RestReq(["REST API Request"])
    CeleryTask(["Scheduled/Triggered Task"])
    
    %% Authentication & permission layer
    subgraph AuthLayer["Authentication & Authorization"]
        direction LR
        TokenAuth["Token Authentication"]
        SessionAuth["Session Authentication"]
        Permissions["Permission Checks"]
        
        TokenAuth --> Permissions
        SessionAuth --> Permissions
    end
    
    %% Request processing layer
    subgraph APILayer["API Processing Layer"]
        direction LR
        GQLSchema["GraphQL Schema"]
        GQLResolvers["GraphQL Resolvers"]
        RestViews["REST API Views"]
        Serializers["Django Serializers"]
        
        GQLSchema --> GQLResolvers
        RestViews --> Serializers
    end
    
    %% Business logic layer
    subgraph BusinessLayer["Business Logic Layer"]
        direction TB
        Services["Service Functions"]
        ModelMethods["Model Methods"]
        HelperFuncs["Helper Utilities"]
        Validators["Data Validators"]
        
        Services --> ModelMethods
        Services --> HelperFuncs
        Services --> Validators
    end
    
    %% Data access layer
    subgraph DataLayer["Data Access Layer"]
        direction TB
        Models["Django Models"]
        Managers["Custom Managers"]
        QuerySets["QuerySet Methods"]
        RawSQL["Raw SQL (when needed)"]
        
        Models --> Managers
        Managers --> QuerySets
        Managers --> RawSQL
    end
    
    %% Database layer
    subgraph DBLayer["Database Layer"]
        direction LR
        ReadReplica[("Read Replica")]
        MainDB[("Primary Database")]
        Migrations["Django Migrations"]
        
        ReadReplica --- MainDB
        Migrations --> MainDB
    end
    
    %% Asynchronous processing
    subgraph AsyncLayer["Asynchronous Processing"]
        direction TB
        CeleryQueue["Celery Task Queue"]
        Workers["Celery Workers"]
        Results["Task Results Storage"]
        
        CeleryQueue --> Workers
        Workers --> Results
    end
    
    %% External services integration
    subgraph ExternalLayer["External Integrations"]
        direction LR
        Email["Email Service"]
        Storage["S3 Storage"]
        ThirdParty["3rd Party APIs"]
        
        Email --- Storage
        Storage --- ThirdParty
    end
    
    %% Main request flow
    GraphQLReq --> TokenAuth
    RestReq --> SessionAuth
    Permissions --> GQLSchema
    Permissions --> RestViews
    GQLResolvers --> Services
    Serializers --> Services
    Services --> Models
    Models --> MainDB
    Models --> ReadReplica
    
    %% Async flow
    GQLResolvers --> CeleryQueue
    RestViews --> CeleryQueue
    CeleryTask --> CeleryQueue
    Workers --> Services
    Workers --> ExternalLayer
    
    %% Return flow
    MainDB --> Models
    ReadReplica --> Models
    Models --> Services
    Models --> ModelMethods
    Services --> GQLResolvers
    Services --> Serializers
    GQLResolvers --> |Response| GraphQLReq
    Serializers --> |Response| RestReq
    
    %% Style definitions - Gruvbox Dark theme
    classDef input fill:#3c3836,stroke:#928374,stroke-width:1px,color:#ebdbb2,font-weight:bold
    classDef auth fill:#d79921,stroke:#b57614,stroke-width:2px,color:#282828,font-weight:bold
    classDef api fill:#689d6a,stroke:#427b58,stroke-width:2px,color:#282828,font-weight:bold
    classDef business fill:#458588,stroke:#076678,stroke-width:2px,color:#282828,font-weight:bold
    classDef data fill:#cc241d,stroke:#9d0006,stroke-width:2px,color:#282828,font-weight:bold
    classDef db fill:#b16286,stroke:#8f3f71,stroke-width:2px,color:#282828,font-weight:bold
    classDef async fill:#98971a,stroke:#79740e,stroke-width:2px,color:#282828,font-weight:bold
    classDef ext fill:#d65d0e,stroke:#af3a03,stroke-width:2px,color:#282828,font-weight:bold
    
    %% Apply styles
    class GraphQLReq,RestReq,CeleryTask input
    class TokenAuth,SessionAuth,Permissions auth
    class GQLSchema,GQLResolvers,RestViews,Serializers api
    class Services,ModelMethods,HelperFuncs,Validators business
    class Models,Managers,QuerySets,RawSQL data
    class ReadReplica,MainDB,Migrations db
    class CeleryQueue,Workers,Results async
    class Email,Storage,ThirdParty ext
    
    %% Explicit styling for subgraph titles
    style AuthLayer fill:#282828,color:#fabd2f,font-weight:bold
    style APILayer fill:#282828,color:#fabd2f,font-weight:bold
    style BusinessLayer fill:#282828,color:#fabd2f,font-weight:bold
    style DataLayer fill:#282828,color:#fabd2f,font-weight:bold
    style DBLayer fill:#282828,color:#fabd2f,font-weight:bold
    style AsyncLayer fill:#282828,color:#fabd2f,font-weight:bold
    style ExternalLayer fill:#282828,color:#fabd2f,font-weight:bold
```

## Deployment/Infrastructure Data Flow

This diagram visualizes how code and configuration flow through the CI/CD pipeline to cloud and Kubernetes infrastructure.

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
    %% Development sources
    Developer([Developer])
    LocalCode[("Local Code")]
    
    %% Source control
    subgraph SourceControl["Source Control"]
        direction TB
        GitRepo["Git Repository"]
        PRs["Pull Requests"]
        Branches["Feature/Release Branches"]
        MainBranch["Main Branch"]
        
        Branches --> PRs
        PRs --> MainBranch
    end
    
    %% CI/CD pipeline
    subgraph CIPipeline["CI/CD Pipeline"]
        direction TB
        GHActions["GitHub Actions"]
        Lint["Linting & Type Checking"]
        UnitTests["Unit Tests"]
        IntegTests["Integration Tests"]
        Build["Build Process"]
        
        GHActions --> Lint
        GHActions --> UnitTests
        Lint --> Build
        UnitTests --> Build
        IntegTests --> Build
    end
    
    %% Artifacts
    subgraph Artifacts["Build Artifacts"]
        direction TB
        FrontendImage["Frontend Docker Image"]
        BackendImage["Backend Docker Image"]
        CeleryImage["Celery Worker Image"]
        TerraformPlans["Terraform Plans"]
        
        FrontendImage --- BackendImage
        BackendImage --- CeleryImage
    end
    
    %% Infrastructure as code
    subgraph IaC["Infrastructure as Code"]
        direction TB
        TerraformModules["Terraform Modules"]
        TerraformVars["Environment Variables"]
        K8sManifests["Kubernetes Manifests"]
        KustomizeOverlays["Kustomize Overlays"]
        
        TerraformModules --> TerraformVars
        K8sManifests --> KustomizeOverlays
    end
    
    %% Cloud resources
    subgraph CloudResources["AWS Cloud Resources"]
        direction TB
        VPC["VPC & Networking"]
        EKS["EKS Cluster"]
        ECR["Container Registry"]
        RDS["RDS Database"]
        S3["S3 Buckets"]
        CF["CloudFront"]
        R53["Route 53"]
        
        VPC --> EKS
        ECR --> EKS
        EKS --> RDS
        S3 --> CF
        CF --> R53
    end
    
    %% Kubernetes deployment
    subgraph K8sDeployment["Kubernetes Deployment"]
        direction TB
        ArgoCD["ArgoCD"]
        CertManager["Cert Manager"]
        Ingress["Ingress Controller"]
        Secrets["Sealed Secrets"]
        Monitoring["Monitoring Stack"]
        FrontendSvc["Frontend Service"]
        BackendSvc["Backend Service"]
        CelerySvc["Celery Service"]
        RedisSvc["Redis Service"]
        DBSvc["Database Service"]
        
        ArgoCD --> CertManager
        ArgoCD --> Ingress
        ArgoCD --> Secrets
        ArgoCD --> Monitoring
        ArgoCD --> FrontendSvc
        ArgoCD --> BackendSvc
        ArgoCD --> CelerySvc
        ArgoCD --> RedisSvc
        ArgoCD --> DBSvc
        Secrets --> FrontendSvc
        Secrets --> BackendSvc
        Secrets --> CelerySvc
        Secrets --> DBSvc
        Ingress --> FrontendSvc
        Ingress --> BackendSvc
    end
    
    %% End user access
    EndUser([End User])
    
    %% Main flow connections
    Developer --> LocalCode
    LocalCode --> GitRepo
    MainBranch --> GHActions
    Build --> FrontendImage
    Build --> BackendImage
    Build --> CeleryImage
    FrontendImage --> ECR
    BackendImage --> ECR
    CeleryImage --> ECR
    MainBranch --> TerraformModules
    MainBranch --> K8sManifests
    TerraformVars --> VPC
    TerraformVars --> EKS
    TerraformVars --> ECR
    TerraformVars --> RDS
    TerraformVars --> S3
    TerraformVars --> CF
    TerraformVars --> R53
    KustomizeOverlays --> ArgoCD
    ECR --> ArgoCD
    EKS --> ArgoCD
    R53 --> EndUser
    
    %% Style definitions - Gruvbox Dark theme
    classDef external fill:#3c3836,stroke:#928374,stroke-width:1px,color:#ebdbb2,font-weight:bold
    classDef source fill:#d79921,stroke:#b57614,stroke-width:2px,color:#282828,font-weight:bold
    classDef ci fill:#689d6a,stroke:#427b58,stroke-width:2px,color:#282828,font-weight:bold
    classDef artifact fill:#458588,stroke:#076678,stroke-width:2px,color:#282828,font-weight:bold
    classDef iac fill:#cc241d,stroke:#9d0006,stroke-width:2px,color:#282828,font-weight:bold
    classDef cloud fill:#b16286,stroke:#8f3f71,stroke-width:2px,color:#282828,font-weight:bold
    classDef k8s fill:#98971a,stroke:#79740e,stroke-width:2px,color:#282828,font-weight:bold
    
    %% Apply styles
    class Developer,EndUser,LocalCode external
    class GitRepo,PRs,Branches,MainBranch source
    class GHActions,Lint,UnitTests,IntegTests,Build ci
    class FrontendImage,BackendImage,CeleryImage,TerraformPlans artifact
    class TerraformModules,TerraformVars,K8sManifests,KustomizeOverlays iac
    class VPC,EKS,ECR,RDS,S3,CF,R53 cloud
    class ArgoCD,CertManager,Ingress,Secrets,Monitoring,FrontendSvc,BackendSvc,CelerySvc,RedisSvc,DBSvc k8s
    
    %% Explicit styling for subgraph titles
    style SourceControl fill:#282828,color:#fabd2f,font-weight:bold
    style CIPipeline fill:#282828,color:#fabd2f,font-weight:bold
    style Artifacts fill:#282828,color:#fabd2f,font-weight:bold
    style IaC fill:#282828,color:#fabd2f,font-weight:bold
    style CloudResources fill:#282828,color:#fabd2f,font-weight:bold
    style K8sDeployment fill:#282828,color:#fabd2f,font-weight:bold
```