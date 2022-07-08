FROM node:lts-alpine
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "tsconfig.json", "./"]
COPY "src" "./src"
RUN npm install
RUN npm run build

FROM node:lts-alpine
WORKDIR /usr/src/app
COPY ["package.json", "./"]
RUN npm install --production
COPY --from=0 /usr/src/app/out .
CMD [ "node", "main.js" ]
