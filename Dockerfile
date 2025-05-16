# Build stage
FROM node:20-alpine as build

# Set working directory
WORKDIR /app

# Copy package.json and package-lock.json
COPY work-life-frontend-boost/package.json ./
COPY work-life-frontend-boost/bun.lockb ./

# Install dependencies
RUN npm install

# Copy all files
COPY work-life-frontend-boost/ ./

# Build the app
RUN npm run build

# Production stage
FROM nginx:alpine

# Copy built files from build stage to nginx serve directory
COPY --from=build /app/dist /usr/share/nginx/html

# Copy custom nginx config if needed
# COPY work-life-frontend-boost/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]