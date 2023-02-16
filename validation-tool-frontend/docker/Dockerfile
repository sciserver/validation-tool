FROM nginx:1.15-alpine

RUN apk upgrade

RUN apk add --no-cache --repository http://nl.alpinelinux.org/alpine/edge/main libuv

RUN apk add --no-cache --update-cache --repository http://dl-cdn.alpinelinux.org/alpine/edge/main nodejs=16.15.0-r1 npm=8.10.0-r0

RUN apk add --no-cache --update-cache --repository http://dl-cdn.alpinelinux.org/alpine/edge/community yarn=1.22.19-r0

RUN apk --no-cache add git

RUN git clone https://github.com/Coleridge-Initiative/validation-tool/

WORKDIR validation-tool/validation-tool-frontend

COPY .env.production .env.production

COPY vue.config.js vue.config.js

RUN yarn install

RUN npm run build

ENV CONTEXT_PATH_NAME validation

COPY nginx.conf /etc/nginx/conf.d/custom.template

EXPOSE 80

CMD (envsubst '\$CONTEXT_PATH_NAME' < /etc/nginx/conf.d/custom.template > /etc/nginx/conf.d/default.conf) && nginx -g 'daemon off;'
