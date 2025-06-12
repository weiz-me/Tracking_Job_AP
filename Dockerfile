# Base image
FROM node:18

# Set working directory
WORKDIR /app

# Copy backend
COPY backend ./backend

# Copy frontend
COPY Fe ./Fe

# Install backend dependencies
WORKDIR /app/backend
RUN npm install

# Install frontend dependencies
WORKDIR /app/Fe
RUN npm install

# Set working directory back to root
WORKDIR /app

# Copy startup script
COPY start.sh .

# Make the script executable
RUN chmod +x start.sh

# Expose ports
EXPOSE 3000
EXPOSE 5000

# Start both servers
CMD ["./start.sh"]
