FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

RUN npm run build -- --configuration production


FROM nginx:stable-alpine

# Remove the default Nginx welcome page
RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d
COPY --from=build /app/dist/personal-application-project-client/browser /usr/share/nginx/html

EXPOSE 80
