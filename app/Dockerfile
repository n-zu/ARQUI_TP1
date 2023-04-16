FROM node:18

RUN mkdir /opt/app

WORKDIR /opt/app

COPY package.json package-lock.json ./

RUN npm i

ENTRYPOINT ["npm", "run", "prod"]