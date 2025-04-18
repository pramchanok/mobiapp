FROM node:lts

WORKDIR /app

COPY package*.json ./

RUN npm i

COPY . .

EXPOSE 3000

RUN npx prisma generate

CMD ["npm", "run", "dev"]
