FROM nginx:stable-alpine
COPY *.pem /etc/nginx/cert/
COPY nginx.conf /etc/nginx/
EXPOSE 443 80
CMD ["nginx", "-g", "daemon off;"]