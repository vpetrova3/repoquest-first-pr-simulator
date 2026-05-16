# RepoQuest: First PR Simulator

RepoQuest is an IBM Bob-powered developer onboarding tool that helps new developers go from an unfamiliar codebase to a meaningful first pull request.

Instead of only generating static documentation, RepoQuest turns a GitHub repository into a guided onboarding journey with architecture summaries, developer missions, mentor-style hints, test suggestions, contribution difficulty scoring, and a first-PR readiness report.

## Hackathon

Built for the IBM Bob Hackathon.

## Core Flow

1. User enters a GitHub repository URL.
2. RepoQuest analyzes the repository structure.
3. IBM Bob helps identify key files, workflows, and onboarding paths.
4. RepoQuest generates guided developer missions.
5. RepoQuest recommends a beginner-safe first PR.
6. The user receives a final readiness report.

## Planned Features

- GitHub repo input
- Repository overview
- Architecture map
- Guided onboarding missions
- Mentor-style hints
- Suggested tests
- Contribution difficulty scoring
- First PR recommendation
- Readiness report
- Exported IBM Bob task sessions in `bob_sessions/`

## Tech Stack

- Frontend: Next.js / React
- Backend: Node.js / Express or FastAPI
- Repository analysis: GitHub API
- AI development partner: IBM Bob IDE
- Optional: watsonx Orchestrate workflow layer

## Repository Structure

```text
frontend/
backend/
bob_sessions/
docs/
README.md
