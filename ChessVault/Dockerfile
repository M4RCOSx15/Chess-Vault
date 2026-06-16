# Usa uma imagem do Java 21 (ou a versão que você usa)
FROM eclipse-temurin:21-jdk-jammy

# Define o diretório de trabalho dentro do container
WORKDIR /app

# Copia o arquivo jar gerado pelo Maven para dentro da imagem
COPY target/*.jar app.jar

# Define as variáveis de ambiente (o Render vai sobrescrever isso)
ENV SPRING_PROFILES_ACTIVE=prod

# Comando para rodar a aplicação
ENTRYPOINT ["java", "-jar", "app.jar"]