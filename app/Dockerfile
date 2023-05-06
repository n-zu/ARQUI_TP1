FROM node:18

WORKDIR /opt/app

COPY package.json package-lock.json ./

RUN npm i

ENTRYPOINT ["node", "index.js"]