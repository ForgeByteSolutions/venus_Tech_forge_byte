FROM --platform=linux/amd64 nginx:alpine

LABEL application="venu-tech-frontend"
LABEL description="Venu Tech eTariff Angular Frontend"

COPY dist/mbr /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
