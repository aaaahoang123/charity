FROM openjdk:17

COPY . /app
WORKDIR /app

ENV TZ=Asia/Singapore
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

RUN ./mvnw package -Dmaven.test.skip=true

ENTRYPOINT /bin/bash ./start.sh