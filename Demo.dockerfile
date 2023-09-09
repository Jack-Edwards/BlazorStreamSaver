FROM mcr.microsoft.com/dotnet/sdk:7.0 AS build
WORKDIR /source/

SHELL ["/bin/bash", "-c"]

RUN dotnet tool install --global dotnet-references
ENV PATH="${PATH}:/root/.dotnet/tools"

RUN apt-get update -yq && apt-get upgrade -yq && apt-get install -yq curl git nano
RUN curl -fsSL https://deb.nodesource.com/setup_20.x | bash - && apt-get install -yq nodejs
RUN npm install --global pnpm \
    && SHELL=bash pnpm setup \
    && source /root/.bashrc

COPY *.sln ./
COPY */*.csproj ./

RUN dotnet-references fix --entry-point ./BlazorStreamSaver.sln --working-directory ./ --remove-unreferenced-project-files
RUN dotnet restore BlazorStreamSaver.Demo

COPY ./ ./
RUN dotnet publish BlazorStreamSaver.Demo --no-restore --configuration release --output /app/

FROM caddy:2.6-alpine AS webhost
COPY BlazorStreamSaver.Demo/Caddyfile /etc/caddy/Caddyfile
COPY --from=build /app/wwwroot/ /srv/
EXPOSE 80
EXPOSE 443
