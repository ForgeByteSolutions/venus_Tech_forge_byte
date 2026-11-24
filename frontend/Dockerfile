# Stage 1: Build Angular Application
FROM node:20-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm install --no-audit --no-fund

COPY . .
RUN npm run build --configuration=production

# Stage 2: Serve with Nginx
FROM nginx:alpine

LABEL application="venu-tech-frontend"
LABEL description="Venu Tech eTariff Angular Frontend"

COPY --from=build /app/dist/mbr /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
