![example workflow](https://github.com/Taller2SeedyFiuba/Seedyfiuba_API_Gateway/actions/workflows/main.yml/badge.svg)

# SeedyFiuba API Gateway

Microservice that acts as a proxy to the Seedyfiuba ecosystem.

### Built With

* [ExpressJS](https://expressjs.com/)
* [Firebase-Admin](https://firebase.google.com/)
* [Docker](https://www.docker.com/)

### Deployed In
* [Heroku](https://www.heroku.com/) as a Container Registry.

## Getting Started

To get a local copy up and running follow these simple steps.

### Prerequisites

Docker-cli must be installed. 

A firebase account must be set-up for Auth-Validation to work.

### Installation

1. Clone the repo
   ```git
   git clone https://github.com/Taller2SeedyFiuba/Seedyfiuba_API_Gateway
   ```
2. Install NPM packages
   ```npm
   npm install
   ```
3. Set up environment variables based on ```web-variables.env.example```.

## Usage
Create external network if not exists:

```docker
docker network create my-net
```

Run service with associated DB:

```docker
docker-compose up --b
```

It's important to acknowledge that microservice start may fail if database is not ready. Solution to this situation resides in running the service again.

### Dependencies

For this microservice to correctly work .env variable must be set correctly. Instructions and example can be found in web-variables.env.example. For local development use web-variables.env.example.test.

* USERS_MS
* PROJECTS_MS
* SPONSORS_MS
* PAYMENT_GTW_MS
* NOTIFICATIONS_MS

### Docs

Swagger is used to document the API structure. 
```
{HOST}/api/api-docs
```

## Testing

#### Unit Tests
```npm
npm run test
```

#### IE Tests

```docker
docker-compose build && docker-compose run --rm api-gateway-service npm run test-ie
```

## Production Deployment CI

This repository is configured using GitHub Actions. When ```main``` is updated an automated deploy is done using CI.

### GitHub Actions secrets

* HEROKU_API_KEY
* HEROKU_APP_NAME
* HEROKU_EMAIL

## License
[MIT](https://choosealicense.com/licenses/mit/)