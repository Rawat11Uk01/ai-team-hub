# PRD-06: Cloud Deployment Two Ways — Container + Serverless

## Goal

Deploy the API as a container and as a serverless function. Add IaC, CI/CD, load balancer, secrets.

## Problem

Code that only runs on localhost is not backend engineering.

## Scope

**In:** Dockerfile, container deploy, serverless deploy, Terraform, GitHub Actions, secrets, load balancer.
**Out:** Kubernetes self-managed, multi-cloud.

## Functional Requirements

- Dockerfile for API.
- Deploy container to ECS/Fargate or Cloud Run.
- Deploy serverless to Lambda or Cloud Functions.
- Terraform for both.
- CI/CD: test → build → deploy.
- Secrets via cloud secret manager.
- Load balancer in front.
- Compare cold start and cost.

## Non-Functional

- CI runs tests before deploy.
- Terraform apply/destroy works.
- Secrets never in code/images.

## Architecture

Two environments: `container` and `serverless`. Shared API code.

## Tech Stack

AWS/GCP, Docker, Terraform, GitHub Actions.

## Milestones

1. Dockerize.
2. Terraform for container.
3. Terraform for serverless.
4. CI/CD.
5. Load balancer + secrets.
6. Benchmark.

## Acceptance Criteria

- Both URLs respond to API calls.
- CI pipeline blocks on test failure.
- Cost estimate for 1M requests.

## Testing

Smoke tests post-deploy; cold start measurement.

## Deliverables

Terraform repo, CI config, benchmark report, design doc on compute ladder, storage types, networking, IaC, CI/CD.

## Risks/Stretch

Cloud cost. Stretch: add blue-green deployment.
