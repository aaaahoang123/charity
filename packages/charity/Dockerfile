FROM openjdk:17

COPY . /app
WORKDIR /app

ARG APP_VERSION=1.0.0
ENV TZ=Asia/Singapore
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN ./mvnw package -Dmaven.test.skip=true

ENTRYPOINT java -XX:+UseSerialGC -jar target/charity-${APP_VERSION}.jar