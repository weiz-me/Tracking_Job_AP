#!/bin/bash

# Start backend server
cd /app/backend
node server.js &

# Start frontend dev server
cd /app/Fe
npm run start

# Keep container alive
wait
