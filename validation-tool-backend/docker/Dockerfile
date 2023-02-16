FROM node:16.15.0-alpine3.14

RUN apk --no-cache add git

RUN git clone https://github.com/Coleridge-Initiative/validation-tool/

WORKDIR validation-tool/validation-tool-backend

COPY .env .env

RUN npm install

RUN npm run build

EXPOSE 3000

CMD ["node", "dist/main.js"]