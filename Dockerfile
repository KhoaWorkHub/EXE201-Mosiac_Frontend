# Stage 1: Build the application
FROM oven/bun:1 as build

WORKDIR /app

# Sao chép package.json và bun.lock
COPY package.json bun.lock ./

# Cài đặt dependencies
RUN bun install --frozen-lockfile

# Sao chép tất cả files dự án
COPY . .

# Build ứng dụng
ARG VITE_API_URL
ENV VITE_API_URL=${VITE_API_URL}

RUN bun run build

# Stage 2: Serve the application
FROM nginx:alpine

# Cấu hình nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Sao chép các files đã build từ stage 1
COPY --from=build /app/dist /usr/share/nginx/html

# Khi container khởi chạy, script này sẽ thay thế biến môi trường trong nginx.conf
COPY ./docker-entrypoint.sh /
RUN chmod +x /docker-entrypoint.sh
ENTRYPOINT ["/docker-entrypoint.sh"]

# Expose port 80
EXPOSE 80

# Khởi chạy nginx
CMD ["nginx", "-g", "daemon off;"]