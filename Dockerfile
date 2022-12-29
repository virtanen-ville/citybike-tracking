FROM node:18

EXPOSE 3100

WORKDIR /usr/src/app

COPY . .

RUN npm install

CMD ["npm", "start"]
