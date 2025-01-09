#!/usr/bin/env bash
docker kill $(docker ps -aq) || true
docker rm $(docker ps -aq) || true
docker network prune --force || true
exit 0
