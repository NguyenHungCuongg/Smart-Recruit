FROM nginx:1.26-alpine

# Copy file build đã được tạo sẵn từ máy host vào thư mục phục vụ của nginx
COPY dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80 cho nginx
EXPOSE 80

# Chạy nginx khi container khởi động
CMD ["nginx", "-g", "daemon off;"]
