# Interview assignment: Booking App

A simple booking system with availability and pricing logic. Built with koa, prisma, postgresql and react (optional).

---

## features

- Product creation and listing
- Availability generation per date or date range
- Pricing capability (optional)
- Booking creation and confirmation
- REST API (tested with Jest + Supertest)
- Dockerized setup (backend, frontend, PostgreSQL)

---

## production considerations

- integrate IAM (e.g. Keycloak) for authentication and JWT validation
- add role-based access control
- validate input more strictly on backend
- enable HTTPS
- add user management
- add linting for development
- logging middleware
- run tests in CI
- add monitoring (prometheus, grafana)
- docker image optimizations
- improve error messages
- write more integration tests and more complex unit tests
- code reviews and add typed API responses

---

## tech stack

- **Backend**: koa, prisma ORM, TypeScript
- **Frontend (Optional)**: react
- **Database**: postgresql
- **Testing**: jest
- **Dev Tools**: docker, prettier

---

## getting started


### run with docker

```bash
docker-compose up --build
```

This spins up:

- postgresql database
- backend API on `http://localhost:3000`
- frontend on `http://localhost:3001`

---

## running tests

make sure the test database is running first (e.g. via docker):

```bash
docker run --name pgtest -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=booking_test -p 5432:5432 -d postgres
```

then its required to create tables using migrations:

```bash
# reset test database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/booking_test" npx prisma migrate reset --force --skip-seed

# run unit tests
npm run test
```

---

## project structure

```bash
.
├── prisma/             # prisma schema and migrations
├── src/                # app source code
├── tests/              # unit tests
├── Dockerfile          # backend dockrfile
├── docker-compose.yml  # docker-compose file
├── .env.test           # test env variables
├── tsconfig.json
└── README.md
```

---

## env variables

make sure to define `DATABASE_URL`

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/booking"
```

you can also use `.env.test` for test database configuration.
