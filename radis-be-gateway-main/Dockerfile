FROM amazoncorretto:21.0.4-alpine3.18
COPY target/securitygateway-0.0.1-SNAPSHOT.jar gateway.jar
EXPOSE 8090
ENTRYPOINT ["java","-jar","/gateway.jar"]
