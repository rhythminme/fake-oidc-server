FROM node:12.16-alpine

LABEL maintainer="raj@rhythmin.me"
LABEL source="https://github.com/rhythminme/fake-oidc-server"

WORKDIR /app

# Update packages in base image
RUN apk update && apk upgrade && apk add git

COPY . .

RUN npm install --force

# User 1000 is already provided in the base image (as 'node')

RUN chown -R node:node /app

USER 1000

CMD [ "npm", "start" ]
