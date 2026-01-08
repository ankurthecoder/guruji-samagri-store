FROM node:18-alpine

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies (conditional for development)
ARG NODE_ENV=production
RUN if [ "$NODE_ENV" = "development" ]; \
    then npm install; \
    else npm install --only=production; \
    fi

# Copy source code
COPY . .

# Expose port
EXPOSE 5000

# Start the application
CMD ["node", "server.js"]
