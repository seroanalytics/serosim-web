# Serosim for the web
[![Project Status: Concept – Minimal or no implementation has been done yet, or the repository is only intended to be a limited example, demo, or proof-of-concept.](https://www.repostatus.org/badges/latest/concept.svg)](https://www.repostatus.org/#concept)
![Docker Image Version](https://img.shields.io/docker/v/seroanalytics/serosim-web?logo=docker)
![GitHub License](https://img.shields.io/github/license/seroanalytics/serosim-web)

Client-side React + WebR application for simulating serosurvey data using [serosim](https://github.com/seroanalytics/serosim).

## Development

Install dependencies with `npm install`. Then the following scripts are available:

### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

For the app to work, a WebR repo containing the `serosim` package must be running on port 9090; this can
be started using `scripts/run-dev-dependencies.R`.

The page will reload if you make edits.\
You will also see any lint errors in the console.

### `npm test`

Runs tests using jest.

### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

### `npm run lint`

Run eslint on the code in `src`.

### `npm run eject`

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

**Note: this is a one-way operation. Once you `eject`, you can’t go back!**

If you aren’t satisfied with the build tool and configuration choices, you can `eject` at any time. This command will remove the single build dependency from your project.

Instead, it will copy all the configuration files and the transitive dependencies (webpack, Babel, ESLint, etc) right into your project so you have full control over them. All of the commands except `eject` will still work, but they will point to the copied scripts so you can tweak them. At this point you’re on your own.

You don’t have to ever use `eject`. The curated feature set is suitable for small and middle deployments, and you shouldn’t feel obligated to use this feature. However we understand that this tool wouldn’t be useful if you couldn’t customize it when you are ready for it.

## Deployment

### Docker
The app is deployed using a Dockerised `nginx` server.
See the [proxy/README.md](proxy/README.md) for details.

* To build the Docker image run `.scripts/build`.
* To push an image to DockerHub run `./scripts/push`
* To start a copy of the Dockerised app locally run `./scripts/run`.

### DigitalOcean
The SeroSim app is deployed on [DigitalOcean](https://cloud.digitalocean.com/) via the App Platform. You will need to be added to the `seroanalytics` team to make any changes to the settings. The app has a single service
which is deployed using a Docker image. 
The DigitalOcean app topology should look like this:

```
alerts:
- rule: DEPLOYMENT_FAILED
- rule: DOMAIN_FAILED
- rule: DEPLOYMENT_LIVE
domains:
- domain: serosim.seroanalytics.org
  type: PRIMARY
  zone: seroanalytics.org
features:
- buildpack-stack=ubuntu-22
ingress:
  rules:
  - component:
      name: serosim
    match:
      path:
        prefix: /
name: serosim
region: lon
services:
- http_port: 80
  image:
    registry: seroanalytics
    registry_type: DOCKER_HUB
    repository: serosim-web
    tag: 1f5c13c
  instance_count: 1
  instance_size_slug: apps-s-1vcpu-0.5gb
  name: serosim
  run_command: /usr/local/bin/serosim-proxy serosim.seroanalytics.org
```

A new image tag is created, pushed to DockerHub, and deployed to DigitalOcean on all pushes to main, 
via the [deploy.yaml](https://github.com/seroanalytics/serosim-web/blob/main/.github/workflows/deploy.yaml) Github Action.

## Domain
The domain name `seroanalytics.org` is registered with NameCheap, but DNS is managed via DigitalOcean under the Networking section.
