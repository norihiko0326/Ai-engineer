FROM gradle:8-jdk21 as builder

WORKDIR /build

COPY build.gradle .
COPY gradle ./gradle
COPY settings.gradle .
COPY src ./src

RUN gradle clean build -x test

FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

COPY --from=builder /build/build/libs/kanban-task-app-*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
