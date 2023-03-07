FROM node:18-alpine


#Copy Dependencies
COPY package.json package.json
COPY package-lock.json package-lock.json


#Install Dependencies
RUN npm install
ENV NODE_ENV=production
COPY . .
ENTRYPOINT  ["node", "index.js" ]



