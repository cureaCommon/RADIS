FROM amazoncorretto:21.0.4-alpine3.18
COPY target/diagnosis-0.0.1-SNAPSHOT.jar diagnosis.jar
EXPOSE 8091
ENTRYPOINT ["java","-jar","/diagnosis.jar"]
