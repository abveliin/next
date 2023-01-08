FROM node:18.12-alpine

WORKDIR /app

COPY package*.json ./



COPY next.config.js ./next.config.js



RUN npm install

RUN npx prisma init
RUN npx prisma generate

COPY . .

CMD ["npm", "run", "dev"]

#RUN npx prisma db push