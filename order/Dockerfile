FROM node:alpine
WORKDIR /usr/app
COPY package*.json ./
RUN npm install
COPY . . 
RUN npx prisma generate
EXPOSE 3002
CMD ["npm", "run", "dev"]