FROM node:16-alpine
WORKDIR /usr/src/app
COPY . .
RUN npm install

EXPOSE 3000
CMD ["node", "dist/main.js"]