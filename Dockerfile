FROM nginx:1.17

# Only used for generating self-signed certificates
RUN apt-get update && apt-get install -y openssl

# Clear out existing configuration
RUN rm /etc/nginx/conf.d/default.conf

VOLUME /var/log/nginx
VOLUME /run/proxy

COPY build /usr/share/nginx/html
COPY proxy/repo /usr/share/nginx/html/repo
COPY proxy/nginx.conf /etc/nginx/nginx.conf.template
COPY proxy/bin /usr/local/bin

ENTRYPOINT ["/usr/local/bin/serosim-proxy"]
