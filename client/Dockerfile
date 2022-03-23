FROM node:alpine as builder

RUN mkdir /palette_frontend
WORKDIR /palette_frontend

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build


FROM nginx:alpine

COPY ./.nginx/nginx.conf /etc/nginx/nginx.conf

RUN rm -rf /usr/share/nginx/html/*

COPY --from=builder /palette_frontend/build /usr/share/nginx/html

EXPOSE 8081 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]