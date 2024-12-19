# Backend Challenge (SwiftCloud)
This repository presents a solution to the SwiftCloud coding challenge, assigned as part of the ScreenCloud test interview process. The solution is implemented using NestJs with Typescript.

## Environment
1. Node - v22.12.0
2. Bun - Support typescript and environment file natively
  ```bash
  # install bun
  $ npm install -g bun
  ```
3. Docker

## Run the demo

```Prepare the environment file by create .env file and copy the content in .env.example to .env file. You can see the database connection details such as username, password, port and host ```

### Option 1 Run the service with Docker
This option is to start all the neccssary service such as database and service.
It also provide sample data in the database.

1. Run the command to start the service
```bash
$ docker compose -f "docker-compose-demo.yml" up -d --build 
```
2. Check the service starts successfully
```bash
$ docker ps
```
You should see the information below
| CONTAINER ID | IMAGE                  | COMMAND                   | CREATED         | STATUS        | PORTS                                | NAMES                 |
|--------------|------------------------|---------------------------|-----------------|--------------|--------------------------------------|-----------------------|
| ebe7c9551b9d | swift-backend:latest   | `/usr/local/bin/dock…`    | 13 minutes ago | Up 13 minutes| 0.0.0.0:8001->8001/tcp              | swift-backend         |
| 4166612fdca1 | postgres:latest        | `docker-entrypoint.s…`    | 13 minutes ago | Up 13 minutes| 5432/tcp, 0.0.0.0:5434->5434/tcp    | swift-cloud-demo-db   |

<br/>

### Option 1.1 Run the service directly with Docker
This option is to start all the neccssary service such as database and service.
It also provide sample data in the database.

1. Run the command to start the service
```bash
$ bun start:demo 
```

<br />

### Option 2 Run the service directly on local machine
In case Docker is not available, it is still possible to everything on local machine.

1. Ensure that you have a database setup and configure the .env file to connect to the database
2. Run schema migration to create the database and import data for demo
```bash
$ bun prisma:dev:deploy 
```
3. Start the service
```bash
$ bun start:prod
```

## API Documentations
The api document is provided with Swagger. To access the api-docs, visit the link http://localhost:8001/api-docs.


## Data source
1. export data as csv from https://docs.google.com/spreadsheets/d/1BFT5RlMKw1blz10bUrsVuWI6FGjzsT72KHE-jRiSXFk/edit?gid=619956793#gid=619956793

## Project setup and scripts for development

1. Environment setup
Refer to .env.example

2. Project setup

```bash
$ bun install
```

3. Compile and run the project
```bash
# development
$ bun run start

# watch mode
$ bun run start:dev

# production mode
$ bun run start:prod

# demo mode - For demo purpose; start up db and run db seed
$ bun run start:demo
``` 

4. Run tests

  4.1 Unit test

    ```bash
    # unit tests
    $ bun test:unit

  4.2 E2E test.
    To simulate real-world conditions, end-to-end tests starts the service only once. 

    Coverage reports cannot be generated for end-to-end tests because the service runs as a web service. API calls are made during testing, preventing the coverage tool from detecting the executed code.

    ```bash
    # Reset E2E test database, start the e2e test and remove the test-db after finishing the tests
    $ bun test:e2e-full

    # Run only integration test. Use this when the test-db is alreay running
    $ bun test:e2e

    # Manually reset E2E test database 
    $ db:test:reset

    # e2e tests
    $ bun test:e2e
    ```

5. Start local postgres database in Docker
```bash
# First time initialization
$ docker compose up dev-db -d

# Remove the container
$ docker compose down

# Start container
$ docker compose start

# Stop container
$ docker compose stop

# Stop with specific service
$ docker compose stop myservicename

# Remove the specific service
$ docker compose rm -f myservicename

```

6. Prisma migration
```bash
# list all options
$ npx prisma

# migration manual
$ npx prisma migrate --help

# Run dev migration from changes in Prisma schema, apply it to the database
# trigger generators (e.g. Prisma Client)
$ npx prisma migrate dev

# Deploy the pending migrations to the database
$ npx prisma migrate deploy

# Push the Prisma schema state to the database
$ prisma db push
```

7. Dev scripts
```bash
# Manually migrate schema and apply seeding data
$ bun prisma:dev:deploy

# Remove the dev database, then re-create a new dev database and apply prisma migration script with seeding data
# CAUTION! All the data will be lost.
$ bun db:dev:reset

```


## Run the prject locally


- Name of artists and writers - store as one field as some names are unclear which one is first name or last name such as Shellback or Robert Ellis Orrall or St. Vincent
- Month is number from 1 - 12
- One song can be only in one album; Taylor does not reuse the song in albums
- Introduce a new column, Total Play.
  when the song is played, it needs to update this field.
  Benefits
  Performance: Fetching the total play count is extremely fast because it's stored directly in the Song record, eliminating the need for repeated aggregation.

  Lower Latency: Once the value is stored, retrieval is almost instantaneous, especially useful when the total play count is queried frequently.

  Easier Analytics: If you need to use the total plays count for analytics, sorting, or filtering, it’s faster and more efficient than calculating the total every time.

  Downside
  Data Integrity Issues: need to ensure the totalPlays field is updated correctly, either by using application logic or database triggers, which introduces complexity.

  - Api Document http://localhost:8000/api-docs#

