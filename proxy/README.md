# SeroSim Proxy

A Dockerised nginx server for serving the SeroSim app. 
It is configured to serve both a webr repo containing the serosim package, and the static files that 
comprise the React app.

## Usage

The entrypoint takes the hostname as an argument, e.g.:

```
docker run serosim-proxy serosim.seroanalytics.org
```

## SSL certificates

The proxy just serves the app on port 80. SSL must be handled at the point of deployment.
