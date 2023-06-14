#!/bin/bash
./mvnw package
java -XX:+UseSerialGC -jar target/charity-${APP_VERSION}.jar