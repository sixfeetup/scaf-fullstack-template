# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is the SCAF (Six Feet Up Application Framework) Copier template - a comprehensive project scaffold for generating production-ready full-stack web applications with complete DevOps pipelines.

**Key Technology Stack:**
- Backend: Django (Python) with GraphQL API via Strawberry
- Frontend: Next.js (TypeScript) with Apollo Client (optional)
- Infrastructure: Kubernetes (k3s/Talos), Docker, Terraform (AWS)
- Deployment: GitOps with ArgoCD
- Development: Tilt for hot-reloading Kubernetes development

## Template Structure

This is a Copier template, not a regular project. The actual project code is in `{{copier__project_slug}}/`. Variables like `{{ copier__project_name }}` are template placeholders that get replaced during project generation.

## Essential Commands

### Local Development
```bash
make setup              # Initialize/switch to local Kubernetes cluster
tilt up                 # Start development environment
tilt down               # Stop development environment
make shell-backend      # SSH into Django container
make shell-frontend     # SSH into Next.js container (if enabled)
```

### Testing
```bash
make test               # Run all tests
make backend-test       # Run Django tests only
make frontend-test      # Run Next.js tests only (if enabled)
make check-lint-and-formatting  # Check code formatting
```

### Dependencies
```bash
make compile            # Update Python dependencies (*.in -> *.txt)
make compile-frontend   # Update Node.js dependencies
```

### Deployment & Secrets
```bash
make sandbox-secrets    # Create sealed secrets for sandbox
make prod-secrets       # Create sealed secrets for production
```

## Architecture

### Backend (Django)
- Main app: `backend/{{copier__project_slug}}/`
- Settings: `backend/config/settings/` (base, local, production, test)
- GraphQL schema: `backend/config/schema.py`
- User management: `backend/{{copier__project_slug}}/users/`
- Tests use pytest with Django plugin

### Frontend (Next.js) - Optional
- Pages: `frontend/pages/`
- Components: `frontend/components/`
- GraphQL client: `frontend/lib/apolloClient.ts`
- Generated types: `frontend/__generated__/`
- Tests use Vitest with React Testing Library

### Infrastructure
- Kubernetes manifests: `k8s/` (using Kustomize)
- Terraform modules: `terraform/modules/base/`
- ArgoCD apps: `argocd/`
- Local dev uses Kind cluster named after project

### Key Patterns
- GraphQL API with Strawberry Django
- Kubernetes-first development with Tilt
- GitOps deployment via ArgoCD
- Multi-environment support (local, sandbox, staging, prod)
- Sealed secrets for sensitive data
- Optional features configured during generation (Celery, Sentry, mail service)

## Testing Approach
- Backend: Run tests inside Kubernetes pod using pytest
- Frontend: Run tests with Vitest
- CI runs tests in isolated environments
- Use `make test` to run all tests locally

## CI/CD & Release Process

### GitHub Actions Workflows
The template includes two main workflows in `.github/workflows/`:

1. **Main Workflow** (`main.yaml`): Runs on every push/PR
   - Linting and formatting checks
   - Backend tests with PostgreSQL and Redis
   - Frontend tests (if enabled)
   - Parallel image building (on main/develop branches):
     - `build-backend-image`: Builds and pushes backend Docker image
     - `build-frontend-image`: Builds and pushes frontend Docker image (if enabled)
   - `update-manifests`: Updates Kubernetes manifests after all images are built
   - Uses AWS OIDC for secure authentication

2. **Semantic Release** (`semantic-release.yaml`): Runs on main branch only
   - Analyzes commits using conventional commit format
   - Automatically determines version bump (major/minor/patch)
   - Updates version in `frontend/package.json`
   - Generates CHANGELOG.md
   - Creates GitHub releases
   - Commits changes with `[skip ci]` tag

### Conventional Commits
Use conventional commit format for automatic versioning:
- `feat:` New features (minor version bump)
- `fix:` Bug fixes (patch version bump)
- `feat!:` or `BREAKING CHANGE:` Breaking changes (major version bump)
- `docs:`, `chore:`, `style:`, `test:` Don't trigger releases

### Deployment Flow
1. Merge to `main` → Production deployment
2. Merge to other branches → Sandbox deployment
3. ArgoCD watches for manifest changes and auto-deploys

## Important Files
- `Makefile`: Central command runner
- `Tiltfile`: Local Kubernetes development configuration
- `copier.yml`: Template configuration with project questions
- `tasks.py`: Post-generation setup script
- `.github/workflows/`: CI/CD pipelines
- `.releaserc.json`: Semantic release configuration