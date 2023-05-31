#!/bin/bash

EnvMode=${KC_ENV:-dev}

if [ $EnvMode = 'production' ]; then
    /opt/keycloak/bin/kc.sh start --proxy edge
else
    /opt/keycloak/bin/kc.sh start-dev --spi-theme-static-max-age=-1 --spi-theme-cache-themes=false --spi-theme-cache-templates=false
fi