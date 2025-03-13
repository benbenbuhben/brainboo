# 1) BUILD STAGE
FROM node:18 AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install

# Copy the rest of the frontend source
COPY . .

# Build the production React app into /dist
RUN npm run build

# 2) RUN STAGE with Caddy
FROM caddy:latest

# Copy the compiled React app from the builder stage into /usr/share/caddy
COPY --from=builder /app/dist /usr/share/caddy

# Copy a custom Caddyfile that instructs Caddy how to serve your app
COPY Caddyfile /etc/caddy/Caddyfile

# Expose HTTP and HTTPS
EXPOSE 80
EXPOSE 443

# Run Caddy with your config
CMD ["caddy", "run", "--config", "/etc/caddy/Caddyfile"]
