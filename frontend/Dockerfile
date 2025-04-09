# Development mode
FROM node:18-alpine

WORKDIR /app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm ci

# Copy the rest of the code
COPY . .

# Expose port 3000 for the dev server
EXPOSE 3000

# Start the development server with host flag
CMD ["npm", "run", "start:docker"]