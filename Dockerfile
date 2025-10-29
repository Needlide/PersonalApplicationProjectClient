FROM node:20 AS build

WORKDIR /app

COPY package*.json ./
COPY .yarnrc.yml* yarn.lock* ./

RUN corepack enable
RUN echo 'nodeLinker: node-modules' > .yarnrc.yml

# Install dependencies
RUN yarn install

COPY . .

RUN yarn build --configuration production


FROM nginx:stable-alpine

# Remove the default Nginx welcome page
RUN rm /etc/nginx/conf.d/default.conf

COPY nginx.conf /etc/nginx/conf.d
COPY --from=build /app/dist/personal-application-project-client/browser /usr/share/nginx/html

EXPOSE 80
