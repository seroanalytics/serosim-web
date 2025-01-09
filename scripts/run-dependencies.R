#!/usr/bin/env Rscript

httpuv::runStaticServer(
  dir = "./proxy/repo",
  port = 9090,
  browse = FALSE,
  headers = list("Access-Control-Allow-Origin" =  "*")
)
