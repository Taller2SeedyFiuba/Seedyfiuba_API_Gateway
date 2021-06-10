![example workflow](https://github.com/Taller2SeedyFiuba/Seedyfiuba_API_Gateway/actions/workflows/main.yml/badge.svg)

# SeedyFiuba API Gateway

Microservicio que actua como proxy de entrada al ecosistema back-end de SeedyFiuba.

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

```docker
docker-compose up --b
```

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

## License
[MIT](https://choosealicense.com/licenses/mit/)