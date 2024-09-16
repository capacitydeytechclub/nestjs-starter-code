# NestJS + PostgreSQL + Prisma + Docker

## Table of Contents

1. [Getting Started](#getting-started)
   - [Prerequisites](#prerequisites)
   - [Setup](#setup)
2. [Contributing](#-contributing)
   - [Contribution Guidelines](#contribution-guidelines)
   - [Commit Cheat Sheet](#_commit-cheat-sheet)

## Getting Started

This is a Medical database sharing application.

### Prerequisites

To run this project, you need the following installed:
- [Node 20.12.2](https://nodejs.org/) or later
- [NPM](https://www.npmjs.com/)

### Setup

1. **Clone the repository:**
    ```bash
    $ git clone https://github.com/capacitydeytechclub/team-beta-backend.git
    ```
2. **Change branch to backend-dev and install project dependencies:**
    ```bash
    $ git checkout backend-dev
    $ npm install
    ```

3. **Run docker and prisma servers. Check package.json scripts:**
    ```bash
    $ npm run prisma:deploy
    $ npm run prisma:generate:client
    $ npm run start:docker
    ```

4. **Run the server:**
    ```bash
    # development
    $ npm run start

    # watch mode
    $ npm run start:dev

    # production mode
    $ npm run start:prod
    ```

  5. **To run Test:**

  ```bash
  # unit tests
  $ npm run test

  # e2e tests
  $ npm run test:e2e

  # test coverage
  $ npm run test:cov
  ```

6. **Use postman to test your endpoint on:**
    - [http://localhost:3030/](http://localhost:3030/)

## 🤝 Contributing

Contributions, issues, and feature requests should follow the below description.

### Contribution Guidelines

1. **After git clone, always make pull from `backend-staging` branch:**
    ```bash
    $ git clone https://github.com/capacitydeytechclub/team-beta-backend.git
    $ git fetch
    $ git checkout backend-staging
    ```

2. **Create a new branch from the `backend-staging` branch:**
    ```bash
    $ git checkout -b backend/{commit-type}/{feature-name}

    # Examples

    # use this for new feature
    $ git checkout -b backend/feat/{feature-name}

    # use this for bug issues
    $ git checkout -b backend/bug/{bug-name}
    ```

3. **Ensure your branch is up to date with the `backend-staging` branch when you are to work on someone approved feature/bug:**
    ```bash
    $ git pull origin backend-staging
    ```

4. **Make your changes, then add them:**
    ```bash
    $ git add .
    ```

5. **Commit your changes with a descriptive message:**
    ```bash
    $ git commit -m "your commit message"
    ```

6. **Push your changes to GitHub:**
    ```bash
    $ git push -u origin <your branch name>
    ```

8. **Create a pull request to the `backend-dev` branch (not `backend-prod`):**
    - Provide a detailed description of your pull request.

### _Commit Cheat Sheet_

| Type     | Description                                                                                                 |
| -------- | ----------------------------------------------------------------------------------------------------------- |
| feat     | A new feature you're adding                                                                                              |
| bug      | A bug fix                                                                                                   |
| docs     | Documentation only changes                                                                                  |
| style    | Features and updates relating to styling                                                                   |
| refactor | Code change that neither fixes a bug nor adds a feature                                                   |
| perf     | Code change that improves performance                                                                     |
| test     | Adding missing tests or correcting existing tests                                                           |
| build    | Changes that affect the build system or external dependencies (example scopes: gulp, broccoli, npm)         |
| ci       | Changes to our CI configuration files and scripts (example scopes: Travis, Circle, BrowserStack, SauceLabs) |
| chore    | Other changes that don't modify source or test files                                                    |
| revert   | Reverts a previous commit                                                                                   |

## Documentation to Work With

- [NestJS](https://docs.nestjs.com)
- [Prisma](https://www.prisma.io/docs/orm/prisma-schema/data-model/models)
- [Docker](https://docs.docker.com/manuals)
- [Git Commands](https://www.atlassian.com/git/glossary#commands)

# team-beta-backend
