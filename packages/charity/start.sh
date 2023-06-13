#!/bin/bash

echo $DB_HOST
echo $DB_PORT
./mvnw clean package
java -XX:+UseSerialGC -jar target/charity-${APP_VERSION}.jar