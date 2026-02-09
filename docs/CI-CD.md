# CI/CD Pipeline Documentation

This project uses **GitHub Actions** to automate the Continuous Integration (CI) process. The pipeline ensures that code quality is maintained by running linting, tests, and build checks on every push and pull request to the `main` and `develop` branches.

## Pipeline Structure

The pipeline is defined in `.github/workflows/ci.yml` and consists of the following jobs:

### Backend Jobs
1.  **lint-backend**: Checks code style and quality using ESLint.
2.  **test-backend**: Runs Unit and E2E tests. It spins up a PostgreSQL service container to support these tests.
3.  **build-backend**: Compiles the NestJS application. Depends on successful lint and test jobs.

### Frontend Jobs
1.  **lint-frontend**: Checks code style and quality using ESLint.
2.  **test-frontend**: Runs React components and unit tests using Jest.
3.  **build-frontend**: Builds the Next.js application. Depends on successful lint and test jobs.

### Docker Job
*   **build-docker**: Builds Docker images for both backend and frontend. This job runs only on the `main` branch and after all other jobs have passed. It utilizes Docker cache to speed up builds.

## Triggers

The pipeline is triggered automatically on:
*   `push` to `main` and `develop` branches.
*   `pull_request` targeting `main` and `develop` branches.

## Environment Variables

The `test-backend` job uses the following environment variables for the PostgreSQL service:
*   `DB_HOST`: localhost
*   `DB_PORT`: 5432
*   `DB_USER`: postgres
*   `DB_PASSWORD`: password
*   `DB_NAME`: event_booking_db
*   `JWT_SECRET`: test_secret

## How to Run Checks Locally

Before pushing your code, it is recommended to run checks locally to ensure the pipeline will pass.

### Backend
```bash
cd backend
npm run lint          # Fix auto-fixable errors with --fix if configured
npm run test          # Run unit tests
npm run test:e2e      # Run E2E tests (requires local DB running)
npm run build         # Verify build
```

### Frontend
```bash
cd frontend
npm run lint          # Check for lint errors
npm run test          # Run unit tests
npm run build         # Verify build
```

## Troubleshooting

### Lint Errors
If `lint` jobs fail, check the logs in the GitHub Actions "Actions" tab. Run `npm run lint` locally to reproduce and fix the issues. Many issues can be fixed automatically by running `npm run lint -- --fix` (if scripts support it) or manually addressing the reported errors.

### Test Failures
*   **Backend**: Ensure your local database configuration matches what the tests expect if running locally. In CI, a fresh Postgres container is used.
*   **Frontend**: Check `jest.config.js` and `jest.setup.js` if you encounter environment issues.

### Build Failures
Build failures often result from type errors or missing dependencies. Ensure `npm install` runs cleanly and `tsc` (TypeScript Compiler) reports no errors.
