# syntax=docker/dockerfile:1

FROM golang:alpine

RUN apk update && apk add --no-cache git build-base tzdata 

WORKDIR /app

COPY go.mod go.sum ./
RUN go mod download

# Copy all files
COPY . .
RUN chmod +x docker-entrypoint.sh

# Run build project
ENV GOARCH=amd64 GOOS=linux CGO_ENABLED=1

RUN go build -ldflags "-s -w" -v -o /bin/api cmd/server/main.go

ENV TZ=America/Sao_Paulo

EXPOSE 8000

ENTRYPOINT ["/app/docker-entrypoint.sh"]