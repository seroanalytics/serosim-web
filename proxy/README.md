# SeroSim Proxy

A Dockerised nginx server for serving the SeroSim app. 
It is configured to serve both a WebR repo containing the compiled `serosim` package, and the static files that 
comprise the React app.

## WebR repo

A WebR repo containing a compiled version of `serosim` is contained in the `proxy/repo` subdirectory. 
This means the version of `serosim` is hard-coded, and can only be updated by re-compiling a new version locally and committing it to this GH repo.
Ideally we should have some automated way of compiling the `serosim` package for WebR during build/deployment, so that it is up-to-date. 

## Usage

The entrypoint takes the hostname as an argument, e.g.:

```
docker run serosim-proxy serosim.seroanalytics.org
```

## SSL certificates

The proxy just serves the app on port 80. SSL must be handled at the point of deployment.
