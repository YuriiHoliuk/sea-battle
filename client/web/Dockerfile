FROM node:22-alpine as builder

WORKDIR /app

# Copy package files
COPY package.json .
COPY yarn.lock .

# Copy workspace files needed for installation
COPY client/web/package.json ./client/web/
COPY shared/package.json ./shared/

# Install dependencies
RUN yarn install

# Copy source code
COPY client/web/ ./client/web/
COPY shared/ ./shared/
COPY tsconfig.json .

# Build the client application
WORKDIR /app/client/web
RUN yarn build

# Production stage
FROM nginx:alpine

# Copy the built files to the nginx serve directory
COPY --from=builder /app/client/web/dist /usr/share/nginx/html

# Copy custom nginx configuration
COPY client/web/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"] 