ARG KEYCLOAK_VERSION=lastest
FROM quay.io/keycloak/keycloak:${KEYCLOAK_VERSION}

COPY ./startup.sh /opt/startup.sh

ENTRYPOINT /bin/bash /opt/startup.sh

EXPOSE 8080