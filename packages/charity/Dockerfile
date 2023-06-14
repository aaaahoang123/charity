# BUILD IMAGE
FROM openjdk:17 as BUILD

COPY . /app
WORKDIR /app

ENV TZ=Asia/Singapore

RUN ./mvnw package -Dmaven.test.skip=true

# Production image
FROM openjdk:17 as PRODUCTION

WORKDIR /app

COPY --from=BUILD /app/target/*.jar main.jar
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

ENTRYPOINT java -XX:+UseSerialGC -jar main.jar