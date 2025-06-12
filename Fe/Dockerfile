# Use Node image
FROM node:18

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy all frontend files
COPY . .

# Expose React dev server port
EXPOSE 3000

# Start frontend dev server
CMD ["npm", "run", "start"]
