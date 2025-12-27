
# Ecclesia — Backend (Developer & Deployment Guide)

This document describes how to start development, prepare the runtime environment, run the project in development with automatic reload, test it in a browser, follow modern Python best practices, and run the service in production.

## 1. Start development

- IMPORTANT: Run all commands from the repository root. The virtual environment is expected at the repository root as `.venv` (not inside `backend`).

- Clone the repository and open the project root. The FastAPI application entry point is `app.main` inside the `backend` folder.
- Recommended Python: 3.11 or newer.
- Create a virtual environment at the project root and use the interpreter/pip directly from `./.venv/bin/`.

```bash
python -m venv .venv
./.venv/bin/python -m pip install --upgrade pip setuptools wheel
```

- From the project root install the backend in editable mode and install developer tools (install optional dev packages only in development/build environments):

```bash
./.venv/bin/pip install -e ./backend
./.venv/bin/pip install --upgrade pip
./.venv/bin/pip install -e "./backend[dev]" || true
```

## 2. Prepare the runtime environment

- Dependencies are declared in `pyproject.toml` (see [backend/pyproject.toml](backend/pyproject.toml#L1)).
- Use a `.env` file (gitignored) for environment-specific configuration. Example `.env`:

```
DATABASE_URL=postgresql://user:pass@localhost:5432/ecclesia
SECRET_KEY=replace-me
```

- Database migrations: Alembic is used for schema changes. From the project root either `cd backend` and run `alembic upgrade head`, or run Alembic with the backend config, for example:

```bash
cd backend && alembic upgrade head
```


## 3. Run in development (automatic reload)

- Start the dev server with Uvicorn (reload enabled). Run this from the project root. If you installed the backend editable via `pip install -e ./backend` you can run:


```bash
./.venv/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 --app-dir backend/app
```

- Editable install (`pip install -e ./backend`) keeps local changes available without reinstalling.

## 4. Test the project (open in browser)

- API interactive docs (FastAPI):
	- Swagger UI: http://localhost:8000/docs
	- ReDoc: http://localhost:8000/redoc
- Health endpoint (example):

```bash
curl http://localhost:8000/health
```

- Run automated tests from the project root:

```bash
./.venv/bin/pytest
```

## 5. Modern Python best practices

- Use `pyproject.toml` to centralize metadata and tooling.
- Pin versions for production deployments (use a lockfile or `pip-tools` / Poetry).
- Enforce formatting and checks with `pre-commit` hooks (`black`, `isort`, `ruff`/`flake8`).
- Add and maintain type annotations; run `mypy` in CI.
- Keep Alembic migrations in source control and run them during deployments.
- Do not commit secrets; use environment variables or secret managers.
- Add tests and run them in CI; run linters and type checks on pull requests.

### Enforcing these practices (recommended)

- Pre-commit: install and configure `pre-commit` to run formatters and linters locally before commits. A sample configuration is added at the repository root in `.pre-commit-config.yaml` — install it in dev environments only:

```bash
./.venv/bin/pip install pre-commit
./.venv/bin/pre-commit install
./.venv/bin/pre-commit run --all-files
```

- CI: ensure CI pipelines run the same checks (format/lint/type/tests). Example steps for CI on the project root:

```bash
./.venv/bin/pip install -e ./backend
./.venv/bin/pip install -e "./backend[dev]"
./.venv/bin/pre-commit run --all-files
./.venv/bin/mypy backend
./.venv/bin/pytest
```

- Type checking: maintain and expand `mypy` coverage incrementally. Treat type errors as build failures in CI.

- Alembic migrations: keep the migrations folder in source control (e.g. `backend/alembic`), review migrations in PRs, and run `alembic upgrade head` as part of deployment. Example deploy step:

```bash
cd backend && alembic upgrade head
```

This ensures formatting, linting, typing, and schema changes are enforced consistently for developers and in CI.


## 6. Run in production

- Use a production ASGI server (Gunicorn with Uvicorn workers is common). From the project root, after activating `.venv` and installing packages, run:

```bash
./.venv/bin/pip install gunicorn
./.venv/bin/gunicorn -k uvicorn.workers.UvicornWorker app.main:app -w 4 -b 0.0.0.0:8000 --log-level info
```

### Running different backend modes

- Web (API server): run the Uvicorn/Gunicorn command above.
- Celery worker: install the worker extras and run Celery from the project root (uses `./.venv/bin/`):

```bash
./.venv/bin/pip install -e "./backend[worker]"
./.venv/bin/celery -A backend.worker.app worker --loglevel=info
```

Note: adapt `-A backend.worker.app` to the module path of your Celery app. Celery and its broker (e.g., Redis) are optional and should be installed only in environments that run workers.

- Tune worker count (`-w`) according to CPU cores and workload.
- Containerize for deployment using the `Dockerfile` in the `backend` folder and run with `docker-compose` or an orchestration platform.
- Run `alembic upgrade head` as part of your deployment pipeline (with backups and migration plan).
- Expose health and readiness endpoints for orchestrators.
- Use TLS at the load balancer, enable connection pooling, caching (Redis), and monitoring (Prometheus, Sentry).


## Quick commands (run from project root)

```bash
# create venv at project root and install
python -m venv .venv
./.venv/bin/python -m pip install --upgrade pip setuptools wheel

# install editable backend and dev tools (dev/tools only in development/build env)
./.venv/bin/pip install -e ./backend
./.venv/bin/pip install -e "./backend[dev]" || true

# run dev server (reload)
./.venv/bin/uvicorn app.main:app --reload --host 0.0.0.0 --port 8000 --app-dir backend/app

# run tests (use venv pip/python)
./.venv/bin/pytest

# run production server (example)
./.venv/bin/gunicorn -k uvicorn.workers.UvicornWorker app.main:app -w 4 -b 0.0.0.0:8000
```


## Next steps (suggested)

- Add a `.env.example` with required variables.
- Add `pre-commit` configuration and CI pipeline for tests, linting, and type checks.
- Create a small `Makefile` or top-level scripts to standardize dev tasks (run/install/test from project root).



