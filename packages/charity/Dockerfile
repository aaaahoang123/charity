FROM eclipse-temurin:17-alpine as BUILD

WORKDIR /app

COPY .mvn/ ./.mvn
COPY mvnw pom.xml ./

RUN ./mvnw dependency:go-offline

COPY . /app

RUN ./mvnw package -Dmaven.test.skip=true && rm -rf ~/.m2/repository

# Production image
FROM eclipse-temurin:17-jre-alpine as PRODUCTION

WORKDIR /app

ENV TZ=Asia/Singapore
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

COPY --from=BUILD /app/target/*.jar main.jar

ENTRYPOINT java -XX:+UseSerialGC -jar main.jar