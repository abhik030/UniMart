# Build stage
FROM node:18-alpine as build

WORKDIR /app

# Cache busting - add a timestamp to force rebuild
ARG CACHEBUST=timestamp

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the code
COPY . .

# Build the app with the timestamp to force rebuild
RUN echo "Building with CACHEBUST=${CACHEBUST}" && npm run build

# Production stage
FROM nginx:alpine

# Copy the build output
COPY --from=build /app/build /usr/share/nginx/html

# Copy nginx configuration
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]