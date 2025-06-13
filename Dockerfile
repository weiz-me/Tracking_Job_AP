# ---------- Step 1: Build the React App ----------
FROM node:20 AS frontend

WORKDIR /app

# Install dependencies
COPY Fe/package*.json ./Fe/
RUN cd Fe && npm install

# Copy all frontend code
COPY Fe ./Fe

# Build React
RUN cd Fe && npm run build


# ---------- Step 2: Set up Node.js backend ----------
FROM node:20 AS backend

WORKDIR /app

# Install backend dependencies
COPY backend/package*.json ./backend/
RUN cd backend && npm install

# Copy backend source
COPY backend ./backend

# Copy React build into backend's public folder
COPY --from=frontend /app/Fe/build ./backend/public

# Set working directory to backend
WORKDIR /app/backend

EXPOSE 5000

CMD ["node", "server.js"]
