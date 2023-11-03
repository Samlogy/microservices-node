# FROM nginx
# COPY nginx.conf /etc/nginx/nginx.conf

FROM node:alpine
WORKDIR /usr/app
COPY package*.json ./
RUN npm install 
COPY . . 
EXPOSE 5001
CMD ["npm", "run", "dev"]