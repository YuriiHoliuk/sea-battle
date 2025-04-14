FROM node:22-alpine as builder

WORKDIR /app

# Copy package files
COPY package.json .
COPY yarn.lock .

# Copy workspace files needed for installation
COPY server/package.json ./server/
COPY shared/package.json ./shared/

# Install dependencies
RUN yarn install

# Copy source code
COPY server/ ./server/
COPY shared/ ./shared/
COPY tsconfig.json .

# Build the server application
WORKDIR /app/server
RUN yarn build

# Verify the build output directories exist
RUN ls -la dist && \
    if [ ! -d "dist/socket" ]; then echo "Error: socket directory not in build output" && exit 1; fi

# Production stage
FROM node:22-alpine

WORKDIR /app

# Copy only production dependencies
COPY package.json .
COPY yarn.lock .
COPY server/package.json ./server/
COPY shared/package.json ./shared/

# Install only production dependencies
RUN yarn install --production

# Copy built files from builder stage
COPY --from=builder /app/server/dist ./server/dist
COPY --from=builder /app/shared ./shared

# Set working directory to server
WORKDIR /app/server

# Expose port
EXPOSE 3000

# Start server
CMD ["node", "dist/server.js"] 